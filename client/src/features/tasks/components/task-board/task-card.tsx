"use client";

import * as React from "react";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KanbanItem, KanbanItemHandle } from "@/components/ui/kanban";
import { TaskDeleteDialog } from "./delete-dialog";
import { UpdateTaskDialog } from "../update-task-dialog";
import { AssignTask } from "../assign-task";

import { getInitials } from "@/lib/utils";
import { Task, TaskPriority } from "@/tasks/types";
import { MoreAction } from "./more-actions";

interface TaskCardProps
  extends Omit<React.ComponentProps<typeof KanbanItem>, "value" | "children"> {
  task: Task;
  asHandle?: boolean;
}

export function TaskCard({ task, asHandle, ...props }: TaskCardProps) {
  const cardContent = (
    <div className="rounded-md border bg-card p-3 shadow-xs">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="line-clamp-1 font-medium text-sm">{task.title}</span>
          <div className="flex items-center gap-3">
            <Badge
              variant={
                task.priority === TaskPriority.HIGH
                  ? "destructive"
                  : task.priority === TaskPriority.MEDIUM
                  ? "primary"
                  : "warning"
              }
              appearance="outline"
              className="pointer-events-none h-5 rounded-sm px-1.5 text-[11px] capitalize shrink-0"
            >
              {task.priority}
            </Badge>
            <MoreAction task={task} />
          </div>
        </div>
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          {task.assignee && (
            <div className="flex items-center gap-1">
              <Avatar className="size-4">
                <AvatarImage src={task.assignee.profileImage} />
                <AvatarFallback>
                  {getInitials(task.assignee.firstName, task.assignee.lastName)}
                </AvatarFallback>
              </Avatar>
              <span className="line-clamp-1">{task.assignee.username}</span>
            </div>
          )}
          {task.dueDate && (
            <time className="text-[10px] tabular-nums whitespace-nowrap">
              {format(task.dueDate, "PPpp")}
            </time>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <KanbanItem value={task.id} {...props}>
      {asHandle ? (
        <KanbanItemHandle>{cardContent}</KanbanItemHandle>
      ) : (
        cardContent
      )}
    </KanbanItem>
  );
}
