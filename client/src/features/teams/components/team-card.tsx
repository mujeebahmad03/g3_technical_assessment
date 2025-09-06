"use client";

import { Calendar, Users, MoreHorizontal, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import { useCurrentTeam } from "@/teams/hooks";
import { Role, UserTeam } from "@/teams/types";

interface TeamCardProps {
  team: UserTeam;
  memberCount?: number;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewMembers?: () => void;
  onViewSettings?: () => void; // Added onViewSettings prop
}

export function TeamCard({
  team,
  memberCount = 0,
  onEdit,
  onDelete,
  onViewMembers,
  onViewSettings, // Added onViewSettings parameter
}: TeamCardProps) {
  const { currentTeam, setCurrentTeam } = useCurrentTeam();
  const isSelected = currentTeam?.id === team.id;

  const handleSelect = () => {
    setCurrentTeam(isSelected ? null : team);
  };

  const isOwner = team.role === Role.ADMIN;

  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
        isSelected && "ring-2 ring-primary ring-offset-2 shadow-md",
      )}
      onClick={handleSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg leading-none truncate">
                {team.name}
              </h3>
              {isOwner && (
                <Badge variant="secondary" className="text-xs">
                  Owner
                </Badge>
              )}
            </div>
            {team.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {team.description}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onViewMembers?.();
                }}
              >
                <Users className="mr-2 h-4 w-4" />
                View members
              </DropdownMenuItem>
              {isOwner && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewSettings?.();
                  }}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Team settings
                </DropdownMenuItem>
              )}
              {isOwner && (
                <>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.();
                    }}
                  >
                    Edit team
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.();
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    Delete team
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>
                {memberCount} member{memberCount !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Created {new Date(team.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {isSelected && (
            <Badge variant="default" className="text-xs">
              Active
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
