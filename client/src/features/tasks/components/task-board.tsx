"use client";

import { useState } from "react";

import { Kanban, KanbanBoard, KanbanOverlay } from "@/components/ui/kanban";
import { TaskColumn } from "./task-column";
import { TaskCard } from "./task-card";

import { Task, TaskStatus } from "../types";

export function TaskBoard({
  taskColumns,
}: {
  taskColumns: Record<TaskStatus, Task[]>;
}) {
  const [columns, setColumns] =
    useState<Record<TaskStatus, Task[]>>(taskColumns);

  return (
    <Kanban
      value={columns}
      onValueChange={setColumns}
      getItemValue={(item) => item.id}
    >
      <KanbanBoard className="grid auto-rows-fr grid-cols-3">
        {Object.entries(columns).map(([columnValue, tasks]) => (
          <TaskColumn key={columnValue} value={columnValue} tasks={tasks} />
        ))}
      </KanbanBoard>

      <KanbanOverlay>
        {({ value, variant }) => {
          if (variant === "column") {
            const tasks = columns[value as TaskStatus] ?? [];
            return <TaskColumn value={String(value)} tasks={tasks} isOverlay />;
          }

          const task = Object.values(columns)
            .flat()
            .find((task) => task.id === value);

          if (!task) return null;

          return <TaskCard task={task} />;
        }}
      </KanbanOverlay>
    </Kanban>
  );
}
