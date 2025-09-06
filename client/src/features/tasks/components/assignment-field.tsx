import { Check, ChevronsUpDown, User } from "lucide-react";
import { ReactNode } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
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
import { cn, getInitials } from "@/lib/utils";
import { TeamMember } from "@/teams/types";
import { formatMemberName } from "../utils";

interface AssignmentFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  description?: string;
  assigneeOpen: boolean;
  setAssigneeOpen: (open: boolean) => void;
  teamMembers: TeamMember[];
  selectedAssignee: TeamMember | undefined;
}

export function AssignmentField<T extends FieldValues>({
  form,
  name,
  assigneeOpen,
  setAssigneeOpen,
  selectedAssignee,
  teamMembers,
  label = "Assign to",
  description,
}: AssignmentFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover open={assigneeOpen} onOpenChange={setAssigneeOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={assigneeOpen}
                  className={cn(
                    "justify-between h-12",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {selectedAssignee ? (
                    <AssigneeAvatar member={selectedAssignee} />
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
            <PopoverContent
              className="w-full p-0"
              align="start"
              style={{ width: "var(--radix-popover-trigger-width)" }}
            >
              <Command>
                <CommandInput placeholder="Search team members..." />
                <CommandList>
                  <CommandEmpty>No team member found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      value=""
                      onSelect={() => {
                        field.onChange("");
                        setAssigneeOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          !field.value ? "opacity-100" : "opacity-0",
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
                          field.onChange(member.userId);
                          setAssigneeOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            field.value === member.userId
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        <AssigneeAvatar member={member} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <FormDescription>{description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function AssigneeAvatar({ member }: { member: TeamMember }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6">
        <AvatarImage src={member.user.profileImage || "/placeholder.svg"} />
        <AvatarFallback className="text-xs">
          {getInitials(member.user.firstName, member.user.lastName)}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{formatMemberName(member)}</span>
        <span className="text-xs text-muted-foreground">
          {member.user.email}
        </span>
      </div>
    </div>
  );
}
