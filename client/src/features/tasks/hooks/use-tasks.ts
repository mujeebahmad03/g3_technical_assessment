import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type {
  CreateTaskFormData,
  UpdateTaskFormData,
  TaskFilterData,
} from "@/tasks/validations";
import { Task, TaskStatus } from "@/tasks/types";
import { apiRoutes } from "@/config";

// Get all tasks with optional filters
export function useTasks(teamId: string, filters?: TaskFilterData) {
  return useQuery({
    queryKey: ["tasks", teamId, filters],
    queryFn: async () => {
      return api.getPaginated<Task>(apiRoutes.tasks.getTasks(teamId));
    },
  });
}

// Get single task by ID
export function useTask(teamId: string, taskId: string) {
  return useQuery({
    queryKey: ["tasks", taskId],
    queryFn: async () => {
      return api.get<Task>(apiRoutes.tasks.getTask(teamId, taskId));
    },
    enabled: !!taskId,
  });
}

// Create new task
export function useCreateTask(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTaskFormData) => {
      return api.post<Task>(apiRoutes.tasks.createTask(teamId), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

// Update task
export function useUpdateTask(teamId: string, taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateTaskFormData) => {
      return api.patch<Task>(apiRoutes.tasks.updateTask(teamId, taskId), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", taskId] });
    },
  });
}

// Delete task
export function useDeleteTask(teamId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) =>
      api.delete(apiRoutes.tasks.deleteTask(teamId, taskId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

// Update task status (for drag and drop)
export function useUpdateTaskStatus(teamId: string, taskId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ status }: { status: TaskStatus }) => {
      return api.patch<Task>(apiRoutes.tasks.updateTask(teamId, taskId), {
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
