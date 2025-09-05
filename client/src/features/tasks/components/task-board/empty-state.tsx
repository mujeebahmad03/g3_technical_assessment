"use client";

import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  type: "no-tasks" | "no-results" | "error";
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  type,
  title,
  description,
  action,
}: EmptyStateProps) {
  const getIcon = () => {
    switch (type) {
      case "no-tasks":
        return <Plus className="size-12 text-muted-foreground" />;
      case "no-results":
        return <Search className="size-12 text-muted-foreground" />;
      case "error":
        return <Filter className="size-12 text-muted-foreground" />;
      default:
        return <Plus className="size-12 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="mb-4">{getIcon()}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  );
}
