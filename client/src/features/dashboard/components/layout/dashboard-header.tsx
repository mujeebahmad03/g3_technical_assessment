"use client";

import { Fragment } from "react";

import { ThemeModeToggle } from "@/components/common";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import { DashboardHeaderProps } from "@/dashboard/types";
import { InviteMembersModal } from "@/teams/components";
import { useCurrentTeam } from "@/teams/hooks";
import { Role } from "@/teams/types";

export const DashboardHeader = ({
  breadcrumbs,
  currentPage,
}: DashboardHeaderProps) => {
  const { currentTeam } = useCurrentTeam();

  return (
    <header className="bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden md:block">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <Fragment key={crumb.href}>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={crumb.href}>
                    {crumb.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </Fragment>
            ))}
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{currentPage}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-2 px-4 md:ml-auto">
        {currentTeam?.role === Role.ADMIN && <InviteMembersModal />}
        <ThemeModeToggle />
      </div>
    </header>
  );
};
