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
  dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const taskFilterSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  searchKey: z.string().optional(),
  filters: z
    .object({
      status: z.object({ eq: z.enum(TaskStatus) }).optional(),
      priority: z.object({ eq: z.enum(TaskPriority) }).optional(),
      assignedTo: z.object({ eq: z.string() }).optional(),
    })
    .optional(),
  sort: z.string().optional(),
});

export const assignTask = z.object({
  assigneeId: z.string(),
});

export type AssignTaskFormData = z.infer<typeof assignTask>;
export type TaskFilterData = z.infer<typeof taskFilterSchema>;
export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
