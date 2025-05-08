import { AuraHistory, Aura, Collection, Achievement, UserStats, DailyReward } from '../types';

const HISTORY_KEY = 'aura_history';
const COLLECTION_KEY = 'aura_collection';
const ACHIEVEMENTS_KEY = 'aura_achievements';
const USER_STATS_KEY = 'aura_user_stats';
const DAILY_REWARDS_KEY = 'aura_daily_rewards';

export function saveAuraToHistory(auraHistory: AuraHistory): void {
  const history = getAuraHistory();
  history.unshift(auraHistory);
  
  const limitedHistory = history.slice(0, 50);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
}

export function getAuraHistory(): AuraHistory[] {
  const history = localStorage.getItem(HISTORY_KEY);
  return history ? JSON.parse(history) : [];
}

export function clearAuraHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}


export function addAuraToCollection(aura: Aura): void {
  const collection = getCollection();
  const existingAura = collection.auras.find(item => item.aura.name === aura.name);
  
  if (existingAura) {
    existingAura.count += 1;
  } else {
    collection.auras.push({
      aura,
      count: 1,
      firstCollectedAt: Date.now()
    });
  }
  

  collection.completionPercentage = Math.round((collection.auras.length / getTotalUniqueAurasCount()) * 100);
  
  localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
  updateAchievementsAfterCollecting(aura);
}

export function getCollection(): Collection {
  const collection = localStorage.getItem(COLLECTION_KEY);
  return collection ? JSON.parse(collection) : { auras: [], completionPercentage: 0 };
}


function getTotalUniqueAurasCount(): number {
  return 90;
}


export function getAchievements(): Achievement[] {
  const achievements = localStorage.getItem(ACHIEVEMENTS_KEY);
  if (achievements) return JSON.parse(achievements);
  

  const defaultAchievements: Achievement[] = [
    {
      id: 'collector_novice',
      name: 'Коллекционер: Новичок',
      description: 'Соберите 10 разных аур',
      completed: false,
      progress: 0,
      target: 10,
      reward: 'Разблокирует ежедневные награды'
    },
    {
      id: 'collector_adept',
      name: 'Коллекционер: Адепт',
      description: 'Соберите 25 разных аур',
      completed: false,
      progress: 0,
      target: 25,
      reward: 'Повышенные шансы на редкие ауры'
    },
    {
      id: 'collector_master',
      name: 'Коллекционер: Мастер',
      description: 'Соберите все ауры',
      completed: false,
      progress: 0,
      target: getTotalUniqueAurasCount(),
      reward: 'Редкая аура Мастера Коллекций'
    },
    {
      id: 'daily_streak_week',
      name: 'Недельный ритуал',
      description: 'Получайте ауры 7 дней подряд',
      completed: false,
      progress: 0,
      target: 7,
      reward: 'Бонус к ежедневным наградам'
    },
    {
      id: 'rare_hunter',
      name: 'Охотник за редкостями',
      description: 'Найдите 5 редких аур (шанс <= 5%)',
      completed: false,
      progress: 0,
      target: 5,
      reward: 'Увеличенный шанс легендарных аур'
    }
  ];
  
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(defaultAchievements));
  return defaultAchievements;
}

export function updateAchievement(id: string, progress: number): void {
  const achievements = getAchievements();
  const achievement = achievements.find(a => a.id === id);
  
  if (achievement) {
    achievement.progress = progress;
    
    if (achievement.progress >= achievement.target && !achievement.completed) {
      achievement.completed = true;
    }
    
    localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  }
}

function updateAchievementsAfterCollecting(aura: Aura): void {
  const collection = getCollection();
  const achievements = getAchievements();
  const stats = getUserStats();
  
  const uniqueAurasCount = collection.auras.length;
  achievements.forEach(achievement => {
    if (achievement.id.startsWith('collector_')) {
      updateAchievement(achievement.id, uniqueAurasCount);
    }
  });
  

  if (aura.chance <= 5) {
    stats.rareAurasFound += 1;
    updateUserStats(stats);
    
    const rareHunter = achievements.find(a => a.id === 'rare_hunter');
    if (rareHunter) {
      updateAchievement('rare_hunter', stats.rareAurasFound);
    }
  }
}


export function getUserStats(): UserStats {
  const stats = localStorage.getItem(USER_STATS_KEY);
  return stats ? JSON.parse(stats) : {
    totalAuras: 0,
    rareAurasFound: 0,
    lastDailyReward: 0,
    streak: 0
  };
}

export function updateUserStats(stats: UserStats): void {
  localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
}

export function incrementTotalAuras(): void {
  const stats = getUserStats();
  stats.totalAuras += 1;
  updateUserStats(stats);
}


export function getDailyRewards(): DailyReward[] {
  const rewards = localStorage.getItem(DAILY_REWARDS_KEY);
  if (rewards) return JSON.parse(rewards);

  const defaultRewards: DailyReward[] = [
    { day: 1, claimed: false, reward: "Увеличенный шанс редкой ауры +10%" },
    { day: 2, claimed: false, reward: "Двойная генерация ауры" },
    { day: 3, claimed: false, reward: "Бустер удачи на 24 часа +20%" },
    { day: 4, claimed: false, reward: "10 очков коллекции" },
    { day: 5, claimed: false, reward: "Тройная генерация ауры" },
    { day: 6, claimed: false, reward: "Бонусный редкий цвет ауры" },
    { day: 7, claimed: false, reward: "Гарантированная эпическая аура" },
    { day: 8, claimed: false, reward: "Бустер удачи +15% на 48 часов" },
    { day: 9, claimed: false, reward: "2× двойная генерация ауры" },
    { day: 10, claimed: false, reward: "Эксклюзивная рамка для аур" },
    { day: 11, claimed: false, reward: "Бустер редкости +25%" },
    { day: 12, claimed: false, reward: "5× случайных аур" },
    { day: 13, claimed: false, reward: "Уникальный эффект при генерации" },
    { day: 14, claimed: false, reward: "Гарантированная легендарная аура" },
    { day: 15, claimed: false, reward: "Возможность смешивать ауры" },
    { day: 16, claimed: false, reward: "Увеличение шанса редких аур на 30%" },
    { day: 17, claimed: false, reward: "3× тройной генерации" },
    { day: 18, claimed: false, reward: "Особый титул «Искатель Аур»" },
    { day: 19, claimed: false, reward: "Поиск по цвету ауры" },
    { day: 20, claimed: false, reward: "Доступ к специальным аурам" },
    { day: 21, claimed: false, reward: "Уникальная коллекционная аура" },
    { day: 22, claimed: false, reward: "Генератор аур со спецэффектами" },
    { day: 23, claimed: false, reward: "Бустер всех характеристик +40%" },
    { day: 24, claimed: false, reward: "10× генераций ауры" },
    { day: 25, claimed: false, reward: "Аура со светящимся эффектом" },
    { day: 26, claimed: false, reward: "Бустер удачи +50% на 72 часа" },
    { day: 27, claimed: false, reward: "Персонализация интерфейса" },
    { day: 28, claimed: false, reward: "7× гарантированных редких аур" },
    { day: 29, claimed: false, reward: "Эксклюзивный VIP-статус" },
    { day: 30, claimed: false, reward: "Мультигенератор 5× аур за раз" },
    { day: 31, claimed: false, reward: "Мистическая аура (шанс 0.1%)" },
  ];
  
  localStorage.setItem(DAILY_REWARDS_KEY, JSON.stringify(defaultRewards));
  return defaultRewards;
}

export function claimDailyReward(day: number): boolean {
  const rewards = getDailyRewards();
  const stats = getUserStats();
  const today = new Date().setHours(0, 0, 0, 0);
  

  if (stats.lastDailyReward === today) {
    return false; 
  }
  
  const reward = rewards.find(r => r.day === day);
  if (reward && !reward.claimed) {
    const yesterday = today - 86400000; 
    
    if (stats.lastDailyReward === yesterday) {
      stats.streak += 1;
    } else if (stats.lastDailyReward !== 0 && stats.lastDailyReward < yesterday) {
      stats.streak = 1;
    }
    
    reward.claimed = true;
    stats.lastDailyReward = today;
    if (day === 31) {
      rewards.forEach(r => r.claimed = false);
    }
    

    localStorage.setItem(DAILY_REWARDS_KEY, JSON.stringify(rewards));
    updateUserStats(stats);
    

    const streakAchievement = getAchievements().find(a => a.id === 'daily_streak_week');
    if (streakAchievement) {
      updateAchievement('daily_streak_week', stats.streak);
    }
    
    return true;
  }
  
  return false;
}


export function resetAllProgress(): void {
  localStorage.removeItem(HISTORY_KEY);
  localStorage.removeItem(COLLECTION_KEY);
  localStorage.removeItem(ACHIEVEMENTS_KEY);
  localStorage.removeItem(USER_STATS_KEY);
  localStorage.removeItem(DAILY_REWARDS_KEY);
}