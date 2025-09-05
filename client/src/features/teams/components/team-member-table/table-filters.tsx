"use client";

import { useId, useRef } from "react";
import { CircleXIcon, FilterIcon, ListFilterIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TableFiltersProps {
  searchKey: string;
  onSearchChange: (value: string) => void;
  uniqueRoleValues: string[];
  roleCounts: Map<string, number>;
  selectedRoles: string[];
  onRoleChange: (checked: boolean, value: string) => void;
}

export function TableFilters({
  searchKey,
  onSearchChange,
  uniqueRoleValues,
  roleCounts,
  selectedRoles,
  onRoleChange,
}: TableFiltersProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Input
          id={`${id}-input`}
          ref={inputRef}
          className={cn("peer min-w-60 ps-9", Boolean(searchKey) && "pe-9")}
          value={searchKey}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter by name, username, or email..."
          type="text"
          aria-label="Filter by name, username, or email"
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <ListFilterIcon size={16} aria-hidden="true" />
        </div>
        {Boolean(searchKey) && (
          <button
            className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Clear filter"
            onClick={() => {
              onSearchChange("");
              if (inputRef.current) {
                inputRef.current.focus();
              }
            }}
          >
            <CircleXIcon size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Filter by role */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <FilterIcon
              className="-ms-1 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Role
            {selectedRoles.length > 0 && (
              <span className="bg-background text-muted-foreground/70 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
                {selectedRoles.length}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto min-w-36 p-3" align="start">
          <div className="space-y-3">
            <div className="text-muted-foreground text-xs font-medium">
              Filters
            </div>
            <div className="space-y-3">
              {uniqueRoleValues.map((value, i) => (
                <div key={value} className="flex items-center gap-2">
                  <Checkbox
                    id={`${id}-${i}`}
                    checked={selectedRoles.includes(value)}
                    onCheckedChange={(checked: boolean) =>
                      onRoleChange(checked, value)
                    }
                  />
                  <Label
                    htmlFor={`${id}-${i}`}
                    className="flex grow justify-between gap-2 font-normal"
                  >
                    {value}{" "}
                    <span className="text-muted-foreground ms-2 text-xs">
                      {roleCounts.get(value)}
                    </span>
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
