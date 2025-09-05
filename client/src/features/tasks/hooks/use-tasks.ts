"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { apiRoutes } from "@/config";
import { api } from "@/lib/api";
import type {
  CreateTaskFormData,
  UpdateTaskFormData,
  TaskFilterData,
} from "@/tasks/validations";
import { Task, TaskStatus } from "@/tasks/types";

export function useTasks(teamId: string, filters?: TaskFilterData) {
  const queryClient = useQueryClient();

  // === Queries ===
  const tasksQuery = useQuery({
    queryKey: ["tasks", teamId, filters],
    queryFn: () =>
      api.getPaginated<Task>(apiRoutes.tasks.getTasks(teamId), filters),
    enabled: !!teamId,
  });

  const taskQuery = (taskId?: string) =>
    useQuery({
      queryKey: ["tasks", teamId, taskId],
      queryFn: () =>
        api.get<Task>(apiRoutes.tasks.getTask(teamId, taskId as string)),
      enabled: !!taskId,
    });

  // === Mutations ===
  const createTaskMutation = useMutation({
    mutationFn: (data: CreateTaskFormData) =>
      api.post<Task>(apiRoutes.tasks.createTask(teamId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", teamId] });
    },
  });

  const updateTaskMutation = (taskId: string) =>
    useMutation({
      mutationFn: (data: UpdateTaskFormData) =>
        api.patch<Task>(apiRoutes.tasks.updateTask(teamId, taskId), data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks", teamId] });
        queryClient.invalidateQueries({ queryKey: ["tasks", teamId, taskId] });
      },
    });

  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: string) =>
      api.delete(apiRoutes.tasks.deleteTask(teamId, taskId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", teamId] });
    },
  });

  const updateTaskStatusMutation = (taskId: string) =>
    useMutation({
      mutationFn: ({ status }: { status: TaskStatus }) =>
        api.patch<Task>(apiRoutes.tasks.updateTask(teamId, taskId), { status }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["tasks", teamId] });
      },
    });

  return {
    // queries
    tasks: tasksQuery.data?.data ?? [],
    meta: tasksQuery.data?.meta,
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    taskQuery, // call it as taskQuery(taskId)

    // mutations
    createTask: createTaskMutation.mutate,
    isCreating: createTaskMutation.isPending,

    updateTask: (taskId: string) => updateTaskMutation(taskId).mutate,
    isUpdating: (taskId: string) => updateTaskMutation(taskId).isPending,

    deleteTask: deleteTaskMutation.mutateAsync,
    isDeleting: deleteTaskMutation.isPending,

    updateTaskStatus: (taskId: string) =>
      updateTaskStatusMutation(taskId).mutate,
    isUpdatingStatus: (taskId: string) =>
      updateTaskStatusMutation(taskId).isPending,
  };
}
