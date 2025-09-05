"use client";

import type { ColumnDef, FilterFn } from "@tanstack/react-table";
import { UserIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RowActions } from "./row-actions";
import type { TeamMember, TeamMemberActions } from "@/teams/types";

const multiColumnFilterFn: FilterFn<TeamMember> = (
  row,
  columnId,
  filterValue
) => {
  const searchableRowContent =
    `${row.original.user.firstName} ${row.original.user.lastName} ${row.original.user.email} ${row.original.user.username}`.toLowerCase();
  const searchTerm = (filterValue ?? "").toLowerCase();
  return searchableRowContent.includes(searchTerm);
};

const roleFilterFn: FilterFn<TeamMember> = (
  row,
  columnId,
  filterValue: string[]
) => {
  if (!filterValue?.length) return true;
  const role = row.getValue(columnId) as string;
  return filterValue.includes(role);
};

export const createColumns = (
  actions: TeamMemberActions
): ColumnDef<TeamMember>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Member",
    accessorKey: "user",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center gap-3">
          {user.profileImage ? (
            <img
              src={user.profileImage || "/placeholder.svg"}
              alt={`${user.firstName} ${user.lastName}`}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <UserIcon size={16} className="text-muted-foreground" />
            </div>
          )}
          <div>
            <div className="font-medium">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-muted-foreground">
              @{user.username}
            </div>
          </div>
        </div>
      );
    },
    size: 220,
    filterFn: multiColumnFilterFn,
    enableHiding: false,
  },
  {
    header: "Email",
    accessorKey: "user.email",
    cell: ({ row }) => row.original.user.email,
    size: 220,
  },
  {
    header: "Role",
    accessorKey: "role",
    cell: ({ row }) => <Badge variant="secondary">{row.original.role}</Badge>,
    size: 120,
    filterFn: roleFilterFn,
  },
  {
    header: "Joined",
    accessorKey: "joinedAt",
    cell: ({ row }) => {
      const joinedAt = new Date(row.original.joinedAt);
      return (
        <div className="text-sm">
          {joinedAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
    size: 120,
  },
  {
    header: "Last Login",
    accessorKey: "user.lastLogin",
    cell: ({ row }) => {
      const lastLogin = row.original.user.lastLogin;
      if (!lastLogin)
        return <span className="text-muted-foreground">Never</span>;

      const loginDate = new Date(lastLogin);
      return (
        <div className="text-sm">
          {loginDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      );
    },
    size: 120,
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <RowActions row={row} actions={actions} />,
    size: 60,
    enableHiding: false,
  },
];
