export interface Aura {
  name: string;
  color: string;
  chance: number;
  description: string;
  id?: string;
}

export interface AuraResult {
  aura: Aura | null;
  isRevealed: boolean;
}

export interface AuraHistory {
  aura: Aura;
  timestamp: number;
}

export interface Collection {
  auras: CollectedAura[];
  completionPercentage: number;
}

export interface CollectedAura {
  aura: Aura;
  count: number;
  firstCollectedAt: number;
}

export interface DailyReward {
  day: number;
  claimed: boolean;
  reward: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  progress: number;
  target: number;
  reward: string;
}

export interface UserStats {
  totalAuras: number;
  rareAurasFound: number;
  lastDailyReward: number;
  streak: number;
}