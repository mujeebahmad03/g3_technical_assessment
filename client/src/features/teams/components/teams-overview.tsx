"use client";

import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TeamCard } from "./team-card";
import { CreateTeamModal } from "./create-team-modal";
import { useTeams } from "../hooks";
import { dashboardRoutes } from "@/config";

export function TeamsOverview() {
  const [searchQuery, setSearchQuery] = useState("");
  const { push } = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { teams, isLoading } = useTeams();

  const filteredTeams = useMemo(() => {
    if (!searchQuery) return teams;

    return teams.filter(
      (team) =>
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [teams, searchQuery]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Teams</h1>
            <p className="text-muted-foreground">
              Manage your teams and collaborate with others.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">
            Manage your teams and collaborate with others.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create team
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {filteredTeams.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery ? "No teams found" : "No teams yet"}
          </h3>
          <p className="text-muted-foreground mb-4 max-w-sm mx-auto">
            {searchQuery
              ? "Try adjusting your search terms to find the team you're looking for."
              : "Get started by creating your first team to collaborate with others."}
          </p>
          {!searchQuery && (
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create your first team
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              memberCount={Math.floor(Math.random() * 10) + 1} // Mock member count
              onViewMembers={() => push(dashboardRoutes.members(team.id))}
              onViewSettings={() => {
                // Added onViewSettings handler
                // TODO: Navigate to team settings page
                console.log("View settings for team:", team.id);
              }}
              onEdit={() => {
                // TODO: Open edit team modal
                console.log("Edit team:", team.id);
              }}
              onDelete={() => {
                // TODO: Open delete confirmation
                console.log("Delete team:", team.id);
              }}
            />
          ))}
        </div>
      )}

      <CreateTeamModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}
