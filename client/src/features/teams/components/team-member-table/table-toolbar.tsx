"use client";

import type { Table } from "@tanstack/react-table";
import {
  Columns3Icon,
  PlusIcon,
  TrashIcon,
  CircleAlertIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { TeamMember } from "@/teams/types";

interface TableToolbarProps {
  table: Table<TeamMember>;
  onAddMember?: () => void;
  onBulkRemove: () => Promise<void>;
}

export function TableToolbar({
  table,
  onAddMember,
  onBulkRemove,
}: TableToolbarProps) {
  const selectedRowsCount = table.getSelectedRowModel().rows.length;

  return (
    <div className="flex items-center gap-3">
      {/* Delete button */}
      {selectedRowsCount > 0 && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="ml-auto bg-transparent" variant="outline">
              <TrashIcon
                className="-ms-1 opacity-60"
                size={16}
                aria-hidden="true"
              />
              Remove
              <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                {selectedRowsCount}
              </span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <div className="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full border"
                aria-hidden="true"
              >
                <CircleAlertIcon className="opacity-80" size={16} />
              </div>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove team members?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action will remove {selectedRowsCount} selected{" "}
                  {selectedRowsCount === 1 ? "member" : "members"} from the
                  team. They will lose access to team resources.
                </AlertDialogDescription>
              </AlertDialogHeader>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onBulkRemove}>
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Toggle columns visibility */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Columns3Icon
              className="-ms-1 opacity-60"
              size={16}
              aria-hidden="true"
            />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  onSelect={(event) => event.preventDefault()}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Add member button */}
      <Button className="ml-auto" onClick={onAddMember}>
        <PlusIcon className="-ms-1 opacity-60" size={16} aria-hidden="true" />
        Add member
      </Button>
    </div>
  );
}
