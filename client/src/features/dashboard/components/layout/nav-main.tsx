"use client";

import { useRouter } from "next/navigation";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavMenu } from "@/dashboard/hooks";

export function NavMain() {
  const navMenu = useNavMenu();
  const { push } = useRouter();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navMenu.map((item) => (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton
              tooltip={item.label}
              onClick={() => push(item.href)}
              isActive={item.isActive}
            >
              {item.icon && <item.icon />}
              <span>{item.label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
