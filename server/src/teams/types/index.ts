import { Role } from "prisma/generated/prisma/enums";

export interface RawUserTeam {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isArchived: boolean;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  members: {
    role: Role;
  }[];
}
