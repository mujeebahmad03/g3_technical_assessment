import { User } from "@/types/auth";

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface Task {
  id: string;

  title: string;

  description: string | null;

  status: TaskStatus;

  priority: TaskPriority;

  dueDate: Date | null;

  completedAt: Date | null;

  teamId: string;

  createdBy: string;

  assignedTo: string | null;

  assignee?: User | null;

  createdAt: Date;

  updatedAt: Date;
}

export interface TaskFilters {
  page?: number;
  limit?: number;
  searchKey?: string;
  filters?: {
    assignedTo?: { eq: string };
    priority?: { eq: TaskPriority };
  };
  sort?: string;
}
