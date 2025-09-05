import { TeamMember } from "@/teams/types";
import { TaskPriority, TaskStatus } from "../types";

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
