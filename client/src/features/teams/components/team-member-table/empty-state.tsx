"use client";

import { Users, UserPlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TableEmptyStateProps {
  isFiltered: boolean;
  onClearFilters?: () => void;
  onInviteMember?: () => void;
}

export function TableEmptyState({
  isFiltered,
  onClearFilters,
  onInviteMember,
}: TableEmptyStateProps) {
  if (isFiltered) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Search className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No members found</h3>
        <p className="text-muted-foreground mb-4 max-w-sm">
          No team members match your current filters. Try adjusting your search
          criteria.
        </p>
        {onClearFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            Clear filters
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Users className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No team members yet</h3>
      <p className="text-muted-foreground mb-4 max-w-sm">
        Get started by inviting your first team member to collaborate on this
        project.
      </p>
      {onInviteMember && (
        <Button onClick={onInviteMember}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite member
        </Button>
      )}
    </div>
  );
}
