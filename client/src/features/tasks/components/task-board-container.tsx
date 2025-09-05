"use client";

import { useTasks } from "@/tasks/hooks";
import { Task, TaskStatus } from "../types";
import { TaskBoard } from "./task-board";

export default function TaskBoardContainer({ teamId }: { teamId: string }) {
  const todoTasksQuery = useTasks(teamId, {
    filters: { status: { eq: TaskStatus.TODO } },
  });

  const inProgressTasksQuery = useTasks(teamId, {
    filters: { status: { eq: TaskStatus.IN_PROGRESS } },
  });

  const doneTasksQuery = useTasks(teamId, {
    filters: { status: { eq: TaskStatus.DONE } },
  });

  const taskColumns: Record<TaskStatus, Task[]> = {
    [TaskStatus.TODO]: todoTasksQuery.data?.data ?? [],
    [TaskStatus.IN_PROGRESS]: inProgressTasksQuery.data?.data ?? [],
    [TaskStatus.DONE]: doneTasksQuery.data?.data ?? [],
  };

  return <TaskBoard taskColumns={taskColumns} />;
}
