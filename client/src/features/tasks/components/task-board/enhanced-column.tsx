"use client";

import { GripVertical, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { EmptyState } from "./empty-state";
import { TaskSkeleton } from "./skeleton";
import { TaskCard } from "./task-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  KanbanColumn,
  KanbanColumnContent,
  KanbanColumnHandle,
} from "@/components/ui/kanban";

import { TaskStatus, type TaskFilters } from "@/tasks/types";
import { useTasks } from "@/tasks/hooks";

const COLUMN_TITLES: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "Todo",
  [TaskStatus.IN_PROGRESS]: "In Progress",
  [TaskStatus.DONE]: "Done",
};

interface KanbanColumnEnhancedProps {
  status: TaskStatus;
  filters: TaskFilters;
  isOverlay?: boolean;
  teamId: string;
}

export function KanbanColumnEnhanced({
  status,
  filters,
  isOverlay,
  teamId,
}: KanbanColumnEnhancedProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useTasks(teamId, { ...filters, filters: { status: { eq: status } } });

  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  // Auto-load more when scrolling to bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allTasks = data?.pages.flatMap((page) => page.data) ?? [];
  const totalCount = data?.pages[0]?.meta.totalItems ?? 0;

  if (isLoading) {
    return (
      <div className="rounded-md border bg-card p-2.5 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-sm">
              {COLUMN_TITLES[status]}
            </span>
            <Badge variant="secondary">
              <div className="w-4 h-4 bg-muted-foreground/20 rounded animate-pulse" />
            </Badge>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 p-0.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <TaskSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border bg-card p-2.5 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5">
            <span className="font-semibold text-sm">
              {COLUMN_TITLES[status]}
            </span>
            <Badge variant="destructive">Error</Badge>
          </div>
        </div>
        <EmptyState
          type="error"
          title="Failed to load tasks"
          description="There was an error loading the tasks. Please try again."
          action={{
            label: "Retry",
            onClick: () => window.location.reload(),
          }}
        />
      </div>
    );
  }

  return (
    <KanbanColumn
      value={status}
      className="rounded-md border bg-card p-2.5 shadow-xs h-fit max-h-[calc(100vh-200px)]"
    >
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-sm">{COLUMN_TITLES[status]}</span>
          <Badge variant="secondary">{totalCount}</Badge>
        </div>
        <KanbanColumnHandle asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 opacity-0 group-hover/kanban-column:opacity-100"
          >
            <GripVertical className="h-3 w-3" />
          </Button>
        </KanbanColumnHandle>
      </div>

      <KanbanColumnContent
        value={status}
        className="flex flex-col gap-2.5 p-0.5 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
      >
        {allTasks.length === 0 ? (
          <EmptyState
            type="no-tasks"
            title="No tasks"
            description={`No tasks in ${COLUMN_TITLES[
              status
            ].toLowerCase()} yet.`}
          />
        ) : (
          <>
            {allTasks.map((task) => (
              <TaskCard key={task.id} task={task} asHandle={!isOverlay} />
            ))}

            {/* Load more trigger */}
            {hasNextPage && (
              <div ref={loadMoreRef} className="flex justify-center py-4">
                {isFetchingNextPage ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading more...
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fetchNextPage()}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Load more tasks
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </KanbanColumnContent>
    </KanbanColumn>
  );
}
