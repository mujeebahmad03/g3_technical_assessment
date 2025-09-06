"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useDeleteTask } from "@/tasks/hooks";

import type { Task } from "@/tasks/types";

interface TaskDeleteDialogProps {
  task: Task | null;
  teamId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TaskDeleteDialog({
  open,
  onOpenChange,
  task,
  teamId,
}: TaskDeleteDialogProps) {
  const deleteMutation = useDeleteTask(teamId);

  if (!task) return null;

  const isLoading = deleteMutation.isPending;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Task</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{task?.title}"? This action cannot
            be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteMutation.mutateAsync(task.id)}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
