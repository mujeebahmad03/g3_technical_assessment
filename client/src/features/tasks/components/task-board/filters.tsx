"use client";

import { useState } from "react";
import { Search, Filter, X, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TaskPriority, type TaskFilters } from "@/tasks/types";

interface KanbanFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  users: Array<{
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  }>;
}

export function KanbanFilters({
  filters,
  onFiltersChange,
  users,
}: KanbanFiltersProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({
      ...filters,
      searchKey: value || undefined,
    });
  };

  const handlePriorityChange = (value: string) => {
    onFiltersChange({
      ...filters,
      filters: {
        ...filters.filters,
        priority: value === "all" ? undefined : { eq: value as TaskPriority },
      },
    });
  };

  const handleAssigneeChange = (value: string) => {
    onFiltersChange({
      ...filters,
      filters: {
        ...filters.filters,
        assignedTo: value === "all" ? undefined : { eq: value },
      },
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      searchKey: undefined,
      filters: {},
    });
    setIsFilterOpen(false);
  };

  const activeFiltersCount = [
    filters.searchKey,
    filters.filters?.priority?.eq,
    filters.filters?.assignedTo?.eq,
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks, descriptions, or assignees..."
          value={filters.searchKey || ""}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {filters.searchKey && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSearchChange("")}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative bg-transparent">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                {activeFiltersCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                )}
              </div>

              {/* Priority Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={filters.filters?.priority?.eq || "all"}
                  onValueChange={handlePriorityChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All priorities</SelectItem>
                    <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                    <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                    <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Assignee Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Assignee</label>
                <Select
                  value={filters.filters?.assignedTo?.eq || "all"}
                  onValueChange={handleAssigneeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All assignees" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All assignees</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          {user.firstName} {user.lastName} (@{user.username})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          {filters.searchKey && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.searchKey}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSearchChange("")}
                className="h-3 w-3 p-0 hover:bg-transparent"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
          {filters.filters?.priority?.eq && (
            <Badge variant="secondary" className="gap-1">
              Priority: {filters.filters.priority.eq}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePriorityChange("all")}
                className="h-3 w-3 p-0 hover:bg-transparent"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
          {filters.filters?.assignedTo?.eq && (
            <Badge variant="secondary" className="gap-1">
              Assignee:{" "}
              {
                users.find((u) => u.id === filters.filters?.assignedTo?.eq)
                  ?.username
              }
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleAssigneeChange("all")}
                className="h-3 w-3 p-0 hover:bg-transparent"
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
