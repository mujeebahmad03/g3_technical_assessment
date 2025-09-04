import { User } from "@/types/auth";

export interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isArchived: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  role: "ADMIN" | "MEMBER";
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
