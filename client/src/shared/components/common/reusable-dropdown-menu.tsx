import { ChevronDown } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}

interface ReusableDropdownMenuProps {
  triggerText: string;
  triggerVariant?:
    | "primary"
    | "mono"
    | "destructive"
    | "secondary"
    | "outline"
    | "dashed"
    | "ghost"
    | "dim"
    | "foreground"
    | "inverse";
  menuItems: MenuItem[];
  contentWidth?: string;
  align?: "start" | "center" | "end";
}

export function ReusableDropdownMenu({
  triggerText,
  triggerVariant = "primary",
  menuItems,
  contentWidth = "w-56",
  align = "end",
}: ReusableDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={triggerVariant}>
          {triggerText}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={contentWidth}>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <DropdownMenuItem key={uuidv4()} onClick={item.onClick}>
              <IconComponent className="mr-2 h-4 w-4" />
              {item.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
