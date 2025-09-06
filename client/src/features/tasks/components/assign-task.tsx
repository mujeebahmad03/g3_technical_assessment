"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import { AssignmentField } from "./assignment-field";

import { AssignTaskFormData, assignTask } from "@/tasks/validations";
import { useTeamMembers } from "@/teams/hooks";
import { useAssignTask } from "@/tasks/hooks";
import { Task } from "@/tasks/types";

interface AssignTaskProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  task: Task;
}

export function AssignTask({ task, open, setOpen }: AssignTaskProps) {
  const [assigneeOpen, setAssigneeOpen] = useState(false);
  const assignTaskMutation = useAssignTask();
  const { members } = useTeamMembers(task.teamId, { limit: 100 });

  const form = useForm<AssignTaskFormData>({
    resolver: zodResolver(assignTask),
    defaultValues: {
      assigneeId: "",
    },
  });

  const selectedAssignee = members.find(
    (member) => member.userId === form.watch("assigneeId")
  );

  const handleSubmit = async (data: AssignTaskFormData) => {
    try {
      await assignTaskMutation.mutateAsync({
        teamId: task.teamId,
        taskId: task.id,
        ...data,
      });
      setOpen(false);
    } catch (error) {
      console.log({ error });
    }
  };

  const isLoading = assignTaskMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Assign {task.title} task</DialogTitle>
          <DialogDescription>
            Choose a member to assign this task to
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 mt-4"
          >
            <AssignmentField
              form={form}
              name="assigneeId"
              assigneeOpen={assigneeOpen}
              setAssigneeOpen={setAssigneeOpen}
              selectedAssignee={selectedAssignee}
              teamMembers={members}
              description="Optional. Choose a team member to assign this task to."
            />

            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <LoadingButton
                isLoading={isLoading}
                type="submit"
                className="w-auto"
                disabled={isLoading}
              >
                Assign
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
