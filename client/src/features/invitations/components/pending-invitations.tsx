"use client";

import { formatDistanceToNow } from "date-fns";
import { Mail, Clock, Check, X, RefreshCw } from "lucide-react";
import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeamInvitations } from "../hooks";

export function PendingInvitations() {
  const [page, setPage] = useState(1);
  const { invitations, meta, isLoading, acceptInvitation, isAccepting } =
    useTeamInvitations({ page, limit: 5 });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Pending Invitations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                  <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (invitations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Pending Invitations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No pending invitations
            </h3>
            <p className="text-muted-foreground">
              You don't have any pending team invitations at the moment.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Pending Invitations
            <Badge variant="secondary" className="ml-2">
              {meta?.totalItems || invitations.length}
            </Badge>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  <Mail className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <div className="font-medium">{invitation.email}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    Invited{" "}
                    {formatDistanceToNow(new Date(invitation.invitedAt), {
                      addSuffix: true,
                    })}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {invitation.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => acceptInvitation(invitation.id)}
                disabled={isAccepting}
              >
                {isAccepting ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Check className="mr-2 h-4 w-4" />
                )}
                Accept
              </Button>
              <Button variant="ghost" size="sm" disabled={isAccepting}>
                <X className="mr-2 h-4 w-4" />
                Decline
              </Button>
            </div>
          </div>
        ))}

        {meta && meta.hasMore && (
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => setPage(page + 1)}
              className="w-full"
            >
              Load more invitations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
