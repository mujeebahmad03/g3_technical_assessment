import z from "zod";
import { TaskPriority, TaskStatus } from "../types";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .min(3, "Task title must be at least 3 characters")
    .max(100, "Task title must be less than 100 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
  assignedTo: z.string().optional(),
  dueDate: z.string().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskFilterSchema = z.object({
  status: z.enum(TaskStatus).optional(),
  priority: z.enum(TaskPriority).optional(),
  assignedTo: z.string().optional(),
  teamId: z.string().optional(),
  search: z.string().optional(),
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
export type TaskFilterData = z.infer<typeof taskFilterSchema>;
