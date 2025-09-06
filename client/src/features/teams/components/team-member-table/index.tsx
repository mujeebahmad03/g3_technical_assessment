"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableFilters } from "./table-filters";
import { TableToolbar } from "./table-toolbar";
import { TablePagination } from "./table-pagination";
import { createColumns } from "./table-columns";
import { TeamMemberTableSkeleton } from "./skeleton";
import { TableEmptyState } from "./empty-state";

import { useDebouncedValue } from "@/hooks/client";
import { cn } from "@/lib/utils";
import { useTeamMembers } from "@/teams/hooks";
import type { TeamMemberActions, TeamMembersFilters } from "@/teams/types";

interface TeamMemberTableProps {
  teamId: string;
  actions?: TeamMemberActions;
  onAddMember?: () => void;
}

export function TeamMemberTable({
  teamId,
  actions,
  onAddMember,
}: TeamMemberTableProps) {
  const [searchKey, setSearchKey] = useState("");
  const [selectedRole, setSelectedRole] = useState<
    "ADMIN" | "MEMBER" | undefined
  >();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "user",
      desc: false,
    },
  ]);

  const debouncedSearchKey = useDebouncedValue(searchKey, 300);

  const filters: TeamMembersFilters = useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      searchKey: debouncedSearchKey || undefined,
      filters: selectedRole ? { role: { eq: selectedRole } } : undefined,
      sort:
        sorting.length > 0
          ? `${sorting[0].id}:${sorting[0].desc ? "desc" : "asc"}`
          : undefined,
    }),
    [pagination, debouncedSearchKey, selectedRole, sorting],
  );

  const { members, meta, isLoading, error, bulkRemove, removeUser } =
    useTeamMembers(teamId, filters);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const handleDeleteRows = async () => {
    const selectedRows = table.getSelectedRowModel().rows;
    const userIds = selectedRows.map((row) => row.original.userId);
    await bulkRemove({ targetIds: userIds });
    table.resetRowSelection();
  };
  const allActions: TeamMemberActions = {
    ...actions,
    onRemoveMember: async (userId: string) => {
      await removeUser(userId);
    },
  };

  const columns = useMemo(() => createColumns(allActions), [allActions]);

  const table = useReactTable({
    data: members,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    onSortingChange: setSorting,
    enableSortingRemoval: false,
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    pageCount: meta?.totalPages || 0,
    state: {
      sorting,
      pagination,
      columnVisibility,
    },
  });

  const uniqueRoleValues = ["ADMIN", "MEMBER"];
  const roleCounts = new Map([
    ["ADMIN", members.filter((m) => m.role === "ADMIN").length],
    ["MEMBER", members.filter((m) => m.role === "MEMBER").length],
  ]);

  const handleRoleChange = (checked: boolean, value: string) => {
    if (checked) {
      setSelectedRole(value as "ADMIN" | "MEMBER");
    } else {
      setSelectedRole(undefined);
    }
  };

  const hasFilters = debouncedSearchKey || selectedRole;
  const hasData = members.length > 0;
  const hasFilteredResults = members.length > 0;

  const handleClearFilters = () => {
    setSearchKey("");
    setSelectedRole(undefined);
  };

  if (isLoading) {
    return <TeamMemberTableSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <p>Error loading team members. Please try again.</p>
      </div>
    );
  }

  if (!hasData || (!hasFilteredResults && hasFilters)) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TableFilters
            searchKey={searchKey}
            onSearchChange={setSearchKey}
            uniqueRoleValues={uniqueRoleValues}
            roleCounts={roleCounts}
            selectedRoles={selectedRole ? [selectedRole] : []}
            onRoleChange={handleRoleChange}
          />
          <TableToolbar
            table={table}
            onAddMember={onAddMember}
            onBulkRemove={handleDeleteRows}
          />
        </div>
        <TableEmptyState
          isFiltered={!!hasFilters}
          onClearFilters={handleClearFilters}
          onInviteMember={onAddMember}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TableFilters
          searchKey={searchKey}
          onSearchChange={setSearchKey}
          uniqueRoleValues={uniqueRoleValues}
          roleCounts={roleCounts}
          selectedRoles={selectedRole ? [selectedRole] : []}
          onRoleChange={handleRoleChange}
        />
        <TableToolbar
          table={table}
          onAddMember={onAddMember}
          onBulkRemove={handleDeleteRows}
        />
      </div>

      {/* Table */}
      <div className="bg-background overflow-hidden rounded-md border">
        <Table className="table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: `${header.getSize()}px` }}
                      className="h-11"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              "flex h-full cursor-pointer items-center justify-between gap-2 select-none",
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            if (
                              header.column.getCanSort() &&
                              (e.key === "Enter" || e.key === " ")
                            ) {
                              e.preventDefault();
                              header.column.getToggleSortingHandler()?.(e);
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="last:py-0">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination table={table} totalItems={meta?.totalItems || 0} />
    </div>
  );
}
