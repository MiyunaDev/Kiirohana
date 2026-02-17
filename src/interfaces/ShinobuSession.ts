// interfaces/ShinobuSession.ts
import type { ServiceItem } from "./Service";

export interface ShinobuUser {
  id: string;
  username: string;
  displayName?: string,
  email: string;
  role: string;
  avatarUrl?: string;
  bio?: string,
  stats: {
    level: number,
    currentXp: number,
    xpToNextLevel: number,
    progress: number
  }
}

export interface ShinobuSession {
  service: ServiceItem;
  user: ShinobuUser;
}