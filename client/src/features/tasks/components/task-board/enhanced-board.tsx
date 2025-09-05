"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  Kanban,
  KanbanBoard,
  KanbanOverlay,
  type KanbanMoveEvent,
} from "@/components/ui/kanban";
import { KanbanFilters } from "./filters";
import { useUpdateTaskStatus } from "@/tasks/hooks";
import { useTeamMembers } from "@/teams/hooks";
import { KanbanColumnEnhanced } from "./enhanced-column";

import { TaskStatus, type TaskFilters, type Task } from "@/tasks/types";
import { CreateTaskDialog } from "../create-task-dialog";

export function KanbanBoardEnhanced({ teamId }: { teamId: string }) {
  const [filters, setFilters] = useState<TaskFilters>({});
  const [columns, setColumns] = useState<Record<TaskStatus, Task[]>>({
    [TaskStatus.TODO]: [],
    [TaskStatus.IN_PROGRESS]: [],
    [TaskStatus.DONE]: [],
  });

  const updateTaskStatusMutation = useUpdateTaskStatus();

  const { members } = useTeamMembers(teamId, { limit: 100 });

  const handleMove = async (event: KanbanMoveEvent) => {
    const { activeContainer, overContainer } = event;

    if (activeContainer === overContainer) return;

    const taskId = event.event.active.id as string;
    const newStatus = overContainer as TaskStatus;

    try {
      await updateTaskStatusMutation.mutateAsync({
        taskId,
        status: newStatus,
        teamId,
      });

      toast.success(
        `Task moved to ${newStatus.replace("_", " ").toLowerCase()}`
      );
    } catch (error) {
      toast.error("Failed to update task status");
      console.error("Error updating task status:", error);
    }
  };

  const columnOrder = [
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  const users = members.map(({ user }) => user);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task Board</h1>
          <p className="text-muted-foreground">
            Manage your tasks with drag-and-drop functionality
          </p>
        </div>
        <CreateTaskDialog teamId={teamId}/>
      </div>

      {/* Filters */}
      <KanbanFilters
        filters={filters}
        onFiltersChange={setFilters}
        users={users}
      />

      {/* Kanban Board */}
      <div className="relative">
        <Kanban
          value={columns}
          onValueChange={setColumns}
          getItemValue={(item) => item?.id || ""}
          onMove={handleMove}
          className="w-full"
        >
          <KanbanBoard className="grid grid-cols-1 sm:grid-cols-3 gap-4 auto-rows-fr overflow-x-auto sm:overflow-x-visible pb-4">
            {columnOrder.map((status) => (
              <KanbanColumnEnhanced
                key={status}
                status={status}
                filters={filters}
                teamId={teamId}
              />
            ))}
          </KanbanBoard>

          <KanbanOverlay>
            {({ value, variant }) => {
              if (variant === "column") {
                return (
                  <KanbanColumnEnhanced
                    status={value as TaskStatus}
                    filters={filters}
                    isOverlay
                    teamId={teamId}
                  />
                );
              }
              return null;
            }}
          </KanbanOverlay>
        </Kanban>
      </div>
    </div>
  );
}
