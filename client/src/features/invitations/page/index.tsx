"use client";

import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  InvitationStatusCard,
  PendingInvitations,
} from "@/invitations/components";

interface InvitationsPageProps {
  onBack?: () => void;
}

export function Invitations({ onBack }: InvitationsPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              Team Invitations
            </h1>
            <p className="text-muted-foreground">
              Manage pending invitations and team member requests.
            </p>
          </div>
        </div>
      </div>

      <InvitationStatusCard />

      <PendingInvitations />
    </div>
  );
}
