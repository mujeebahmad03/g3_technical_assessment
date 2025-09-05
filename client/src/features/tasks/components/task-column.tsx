"use client";

import * as React from "react";
import { GripVertical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnHandle,
} from "@/components/ui/kanban";
import { TaskCard } from "./task-card";

import { Task, TaskStatus } from "@/tasks/types";

const COLUMN_TITLES: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "Todo",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.DONE]: "Done",
};

interface TaskColumnProps
  extends Omit<React.ComponentProps<typeof KanbanColumn>, "children"> {
  tasks: Task[];
  isOverlay?: boolean;
}

export function TaskColumn({
  value,
  tasks,
  isOverlay,
  ...props
}: TaskColumnProps) {
  return (
    <KanbanColumn
      value={value}
      {...props}
      className="rounded-md border bg-card p-2.5 shadow-xs"
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-sm">
            {COLUMN_TITLES[value as TaskStatus]}
          </span>
          <Badge variant="secondary">{tasks.length}</Badge>
        </div>
        <KanbanColumnHandle asChild>
          <Button variant="dim" size="sm" mode="icon">
            <GripVertical />
          </Button>
        </KanbanColumnHandle>
      </div>
      <KanbanColumnContent
        value={value}
        className="flex flex-col gap-2.5 p-0.5"
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} asHandle={!isOverlay} />
        ))}
      </KanbanColumnContent>
    </KanbanColumn>
  );
}
