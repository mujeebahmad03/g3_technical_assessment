import { TeamMember } from "@/teams/types";
import { Task, TaskPriority, TaskStatus } from "@/tasks/types";

export const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case "LOW":
      return "text-green-600 dark:text-green-400";
    case "MEDIUM":
      return "text-yellow-600 dark:text-yellow-400";
    case "HIGH":
      return "text-orange-600 dark:text-orange-400";
    default:
      return "text-muted-foreground";
  }
};

export const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case "TODO":
      return "text-gray-600 dark:text-gray-400";
    case "IN_PROGRESS":
      return "text-blue-600 dark:text-blue-400";
    case "DONE":
      return "text-green-600 dark:text-green-400";
    default:
      return "text-muted-foreground";
  }
};

export const formatMemberName = (member: TeamMember) => {
  const { firstName, lastName, username } = member.user;
  return firstName && lastName ? `${firstName} ${lastName}` : username;
};

// Helper to create empty columns structure
export const createEmptyColumns = () =>
  Object.values(TaskStatus).reduce((acc, status) => {
    acc[status] = [];
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

// Helper to group tasks by status
export const groupTasksByStatus = (tasks: Task[]) => {
  const columns = createEmptyColumns();
  tasks.forEach((task) => {
    if (columns[task.status]) {
      columns[task.status].push(task);
    }
  });
  return columns;
};

// Helper to get all tasks flattened from columns
export const getFlattenedTasks = (cols: Record<TaskStatus, Task[]>) =>
  Object.values(cols).flat();

// Helper to find task by id in columns
export const findTaskById = (
  cols: Record<TaskStatus, Task[]>,
  taskId: string
) => getFlattenedTasks(cols).find((task) => task.id === taskId);
