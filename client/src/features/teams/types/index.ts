import { User } from "@/types/auth";

export enum Role {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isArchived: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  members?: TeamMember[];
}

export interface UserTeam {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isArchived: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  role: Role;
  logo: React.ElementType;
}

export interface TeamMember {
  id: string;
  role: Role;
  joinedAt: string;
  invitedAt?: string;
  invitedBy?: string;
  userId: string;
  teamId: string;
  user: User;
}

export interface TeamInvitation {
  id: string;
  email: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  invitedAt: string;
  acceptedAt?: string;
  rejectedAt?: string;
  teamId: string;
  invitedBy: string;
}

export interface BulkRemovePayload {
  targetIds: string[];
}

export interface TeamMembersFilters {
  page?: number;
  limit?: number;
  searchKey?: string;
  filters?: {
    role?: {
      eq: "ADMIN" | "MEMBER";
    };
  };
  sort?: string;
}

export interface InviteUserPayload {
  email?: string;
  username?: string;
}

export interface BulkInvitePayload {
  invitees: InviteUserPayload[];
}

export interface TeamMemberActions {
  onRemoveMember: (userId: string) => Promise<void> | void;
  onEditMember?: (
    teamId: string,
    userId: string,
    updates: Partial<TeamMember>
  ) => Promise<void> | void;
  onViewProfile?: (teamId: string, userId: string) => void;
  onSendMessage?: (teamId: string, userId: string) => void;
  onManagePermissions?: (teamId: string, userId: string) => void;
}

export interface TeamMembersFilters {
  page?: number;
  limit?: number;
  searchKey?: string;
  filters?: {
    role?: {
      eq: "ADMIN" | "MEMBER";
    };
  };
  sort?: string;
}
