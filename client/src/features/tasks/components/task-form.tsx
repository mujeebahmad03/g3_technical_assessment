"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { cn, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CreateTaskFormData,
  UpdateTaskFormData,
  createTaskSchema,
  updateTaskSchema,
} from "../validations";
import { TeamMember } from "@/teams/types";
import { Task, TaskPriority, TaskStatus } from "../types";
import {
  DateFormField,
  InputFormField,
  SelectFormField,
  TextareaFormField,
} from "@/components/form-fields";
import { formatMemberName, getPriorityColor, getStatusColor } from "../utils";
import { LoadingButton } from "@/components/ui/loading-button";
import { useCreateTask, useUpdateTask } from "../hooks";

interface TaskFormProps {
  mode: "create" | "edit";
  task?: Task;
  teamMembers: TeamMember[];
  teamId: string;
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TaskForm = ({
  teamId,
  mode,
  onOpenChange,
  task,
  teamMembers,
}: TaskFormProps) => {
  const [assigneeOpen, setAssigneeOpen] = useState(false);
  const createTaskMutation = useCreateTask(teamId);
  const updateTaskMutation = useUpdateTask(teamId, task?.id ?? "");
  const isLoading =
    createTaskMutation.isPending || updateTaskMutation.isPending;
  const schema = mode === "create" ? createTaskSchema : updateTaskSchema;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? TaskStatus.TODO,
      priority: task?.priority ?? TaskPriority.MEDIUM,
      assignedTo: task?.assignedTo ?? "",
      dueDate: new Date(task?.dueDate ?? new Date()),
    },
  });

  const selectedAssignee = teamMembers.find(
    (member) => member.userId === form.watch("assignedTo")
  );

  const handleSubmit = async (
    data: CreateTaskFormData | UpdateTaskFormData
  ) => {
    try {
      if (mode === "create") {
        await createTaskMutation.mutateAsync(data as CreateTaskFormData);
      } else if (task) {
        await updateTaskMutation.mutateAsync(data);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-4">
          {/* Title Field */}
          <InputFormField
            form={form}
            name="title"
            label="Title"
            placeholder="Enter task title..."
            required
          />

          {/* Description Field */}
          <TextareaFormField
            form={form}
            name="description"
            label="Description"
            placeholder="Add a description for this task..."
            description="Optional. Provide additional context or requirements."
            rows={3}
          />

          {/* Status and Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectFormField
              control={form.control}
              name="status"
              label="Status"
              placeholder="Select status"
              options={Object.values(TaskStatus)}
              getLabel={(status) => status.replace("_", " ")}
              getValue={(status) => status}
              renderOption={(status) => (
                <span className={cn("font-medium", getStatusColor(status))}>
                  {status}
                </span>
              )}
            />

            <SelectFormField
              control={form.control}
              name="priority"
              label="Priority"
              placeholder="Select priority"
              options={Object.values(TaskPriority)}
              getLabel={(priority) => priority}
              getValue={(priority) => priority}
              renderOption={(priority) => (
                <span className={cn("font-medium", getPriorityColor(priority))}>
                  {priority}
                </span>
              )}
            />
          </div>

          {/* Assignee Field */}
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Assign to</FormLabel>
                <Popover open={assigneeOpen} onOpenChange={setAssigneeOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={assigneeOpen}
                        className={cn(
                          "justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {selectedAssignee ? (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={
                                  selectedAssignee.user.profileImage ||
                                  "/placeholder.svg"
                                }
                              />
                              <AvatarFallback className="text-xs">
                                {getInitials(
                                  selectedAssignee.user.firstName,
                                  selectedAssignee.user.lastName
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <span>{formatMemberName(selectedAssignee)}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span>Select team member...</span>
                          </div>
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search team members..." />
                      <CommandList>
                        <CommandEmpty>No team member found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value=""
                            onSelect={() => {
                              form.setValue("assignedTo", "");
                              setAssigneeOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                !field.value ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Unassigned
                              </span>
                            </div>
                          </CommandItem>
                          {teamMembers.map((member) => (
                            <CommandItem
                              key={member.id}
                              value={`${formatMemberName(member)} ${
                                member.user.email
                              }`}
                              onSelect={() => {
                                form.setValue("assignedTo", member.userId);
                                setAssigneeOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value === member.userId
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={
                                      member.user.profileImage ||
                                      "/placeholder.svg"
                                    }
                                  />
                                  <AvatarFallback className="text-xs">
                                    {getInitials(
                                      member.user.firstName,
                                      member.user.lastName
                                    )}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">
                                    {formatMemberName(member)}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {member.user.email}
                                  </span>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Optional. Choose a team member to assign this task to.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Due Date Field */}
          <DateFormField
            form={form}
            name="dueDate"
            label="Due Date"
            description="Optional. Set a deadline for this task."
            disabledDates={(date) =>
              date < new Date(new Date().setHours(0, 0, 0, 0))
            }
          />
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <LoadingButton
            isLoading
            type="submit"
            disabled={isLoading}
            loadingText={mode === "create" ? "Creating..." : "Updating..."}
          >
            {mode === "create" ? "Create Task" : "Update Task"}
          </LoadingButton>
        </DialogFooter>
      </form>
    </Form>
  );
};
