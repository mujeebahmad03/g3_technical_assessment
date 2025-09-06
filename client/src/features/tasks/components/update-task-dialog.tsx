"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskForm } from "./task-form";

import { useTeamMembers } from "@/teams/hooks";
import { Task } from "../types";

interface UpdateDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  task: Task;
}

export function UpdateTaskDialog({ task, open, setOpen }: UpdateDialogProps) {
  const { members } = useTeamMembers(task.teamId, { limit: 100 });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Update {task.title}</DialogTitle>
          <DialogDescription>Update the details of this task</DialogDescription>
        </DialogHeader>
        <TaskForm
          mode="edit"
          task={task}
          onOpenChange={setOpen}
          teamId={task.teamId}
          teamMembers={members}
        />
      </DialogContent>
    </Dialog>
  );
}
