import {
  Users,
  Code,
  Palette,
  Briefcase,
  Settings,
  Rocket,
  Layers,
  Globe,
  Database,
  MessageSquare,
} from "lucide-react";

const ICON_POOL = [
  Users,
  Code,
  Palette,
  Briefcase,
  Settings,
  Rocket,
  Layers,
  Globe,
  Database,
  MessageSquare,
];

// cache so we don't re-hash the same team id on every render
const iconCache = new Map<string, React.ElementType>();

export function getTeamLogo(teamId: string): React.ElementType {
  if (iconCache.has(teamId)) {
    return iconCache.get(teamId)!;
  }

  // very fast hash using char codes
  let hash = 0;
  for (let i = 0; i < teamId.length; i++) {
    hash = (hash * 31 + teamId.charCodeAt(i)) >>> 0; // unsigned 32-bit int
  }

  const icon = ICON_POOL[hash % ICON_POOL.length];
  iconCache.set(teamId, icon);
  return icon;
}
