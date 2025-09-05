"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TaskForm } from "./task-form";
import { useTeamMembers } from "@/teams/hooks";

export function CreateTaskDialog({ teamId }: { teamId: string }) {
  const [open, setOpen] = useState(false);

  const { members } = useTeamMembers(teamId, { limit: 100 });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Create a new task and assign it to your team.
          </DialogDescription>
        </DialogHeader>
        <TaskForm
          mode="create"
          onOpenChange={setOpen}
          teamId={teamId}
          teamMembers={members}
        />
      </DialogContent>
    </Dialog>
  );
}
