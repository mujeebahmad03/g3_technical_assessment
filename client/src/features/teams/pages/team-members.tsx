"use client";

import { useState } from "react";

import { InviteMembersModal, TeamMemberTable } from "@/teams/components";

export const TeamMembers = ({ teamId }: { teamId: string }) => {
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const handleAddMember = () => {
    setIsAddMemberModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Members</h1>
        <p className="text-muted-foreground">
          Manage your members and collaborate with others.
        </p>
      </div>
      <TeamMemberTable teamId={teamId} onAddMember={handleAddMember} />
      <InviteMembersModal
        open={isAddMemberModalOpen}
        onOpenChange={setIsAddMemberModalOpen}
      />
    </div>
  );
};
