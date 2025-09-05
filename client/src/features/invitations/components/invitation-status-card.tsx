"use client";

import { Mail, Users, Clock, CheckCircle, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTeamInvitations } from "@/invitations/hooks";

export function InvitationStatusCard() {
  const { invitations, isLoading } = useTeamInvitations();

  const pendingCount = invitations.filter(
    (inv) => inv.status === "PENDING"
  ).length;
  const acceptedCount = invitations.filter(
    (inv) => inv.status === "ACCEPTED"
  ).length;
  const rejectedCount = invitations.filter(
    (inv) => inv.status === "REJECTED"
  ).length;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-16 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    {
      title: "Total Invitations",
      value: invitations.length,
      icon: Mail,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Pending",
      value: pendingCount,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Accepted",
      value: acceptedCount,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Rejected",
      value: rejectedCount,
      icon: X,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
