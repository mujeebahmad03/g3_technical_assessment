import { Role, Task, TeamMember } from "prisma/generated/prisma/client";

export interface UserSelect {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  bio: string | null;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamSelect {
  id: string;
  name: string;
  description: string | null;
}

export interface TeamMemberWithRelations extends TeamMember {
  user: UserSelect;
  team: TeamSelect;
}

export interface TaskWithRelations extends Task {
  creator: { id: string } | null;
  assignee: { id: string } | null;
  team: { id: string };
}

export interface TeamAccessOptions {
  allowedRoles?: Role[];
  requireOwnership?: boolean;
  resourceType?: "task" | "team" | "invitation";
}
