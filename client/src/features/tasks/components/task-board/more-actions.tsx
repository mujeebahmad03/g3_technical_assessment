"use client";
import { Edit, MoreHorizontal, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "@/tasks/types";
import { TaskDeleteDialog } from "./delete-dialog";
import { UpdateTaskDialog } from "../update-task-dialog";
import { AssignTask } from "../assign-task";

export function MoreAction({ task }: { task: Task }) {
  const [modalState, setModalState] = useState({
    assign: false,
    update: false,
    delete: false,
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleAssignClick = () => {
    setDropdownOpen(false); // Close dropdown first
    setModalState((prev) => ({ ...prev, assign: true }));
  };

  const handleUpdateClick = () => {
    setDropdownOpen(false); // Close dropdown first
    setModalState((prev) => ({ ...prev, update: true }));
  };

  const handleDeleteClick = () => {
    setDropdownOpen(false); // Close dropdown first
    setModalState((prev) => ({ ...prev, delete: true }));
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-muted"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-3 w-3" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleAssignClick}
          >
            <UserPlus className="mr-2 h-3 w-3" />
            Assign
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleUpdateClick}
          >
            <Edit className="mr-2 h-3 w-3" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={handleDeleteClick}
          >
            <Trash2 className="mr-2 h-3 w-3" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modals */}
      <AssignTask
        task={task}
        open={modalState.assign}
        setOpen={(open) => setModalState((prev) => ({ ...prev, assign: open }))}
      />

      <UpdateTaskDialog
        task={task}
        open={modalState.update}
        setOpen={(open) => setModalState((prev) => ({ ...prev, update: open }))}
      />

      <TaskDeleteDialog
        task={task}
        teamId={task.teamId}
        open={modalState.delete}
        onOpenChange={(open) =>
          setModalState((prev) => ({ ...prev, delete: open }))
        }
      />
    </>
  );
}
