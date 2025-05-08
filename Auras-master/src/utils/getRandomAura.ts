import { Aura } from '../types';
import { auras } from '../data/auras';
import { getUserStats } from './localStorage';

interface GetRandomAuraOptions {
  luckyBoost?: number;
  guaranteedRarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'unique' | 'mythical';
  excludeAuras?: string[];
  chance?: number;
}

interface AuraWithNormalizedChance extends Aura {
  normalizedChance: number;
}

export function getRandomAura(options: GetRandomAuraOptions = {}): Aura {
  const { luckyBoost = 0, guaranteedRarity, excludeAuras = [], chance } = options;
  

  if (guaranteedRarity === 'mythical') {
    return {
      name: "Мистическая аура",
      color: "#FF00FF", 
      chance: chance || 0.1,
      description: "Невероятно редкая аура с мистическими свойствами. Излучает таинственную энергию, недоступную обычным людям.",
      id: "mythical_aura"
    };
  }
  

  if (guaranteedRarity === 'unique') {
    return {
      name: "Уникальная коллекционная аура",
      color: "#00FFFF", 
      chance: 0.5,
      description: "Особая аура, доступная только самым преданным коллекционерам. Редкий экземпляр для вашей коллекции.",
      id: "unique_collectible_aura"
    };
  }
  
  let availableAuras = auras.filter(aura => !excludeAuras.includes(aura.name));
  
  if (guaranteedRarity) {
    const rarityRanges = {
      common: { min: 25, max: 50 },
      uncommon: { min: 10, max: 24 },
      rare: { min: 5, max: 9 },
      epic: { min: 2, max: 4 },
      legendary: { min: 0, max: 1 }
    };
    
    const range = rarityRanges[guaranteedRarity];
    if (range) {
      availableAuras = availableAuras.filter(aura => 
        aura.chance >= range.min && aura.chance <= range.max
      );
      
      if (availableAuras.length === 0) {
        availableAuras = auras.filter(aura => !excludeAuras.includes(aura.name));
      }
    }
  }
  
  const userStats = getUserStats();
  const achievementBoost = userStats.rareAurasFound >= 5 ? 5 : 0; 
  
  const totalLuckBoost = luckyBoost + achievementBoost;
  let normalizedAurasTemp: AuraWithNormalizedChance[] = [];
  
  if (totalLuckBoost > 0) {
    normalizedAurasTemp = availableAuras.map(aura => {
      const isCommon = aura.chance > 10;
      const isRare = aura.chance <= 5;
      
      let adjustedChance = aura.chance;
      
      if (isCommon) {
        adjustedChance = Math.max(aura.chance * (1 - (totalLuckBoost / 100)), aura.chance / 2);
      } else if (isRare) {
        adjustedChance = aura.chance * (1 + (totalLuckBoost / 20));
      }
      
      return {
        ...aura,
        normalizedChance: adjustedChance
      };
    });
  } else {
    normalizedAurasTemp = availableAuras.map(aura => ({
      ...aura,
      normalizedChance: aura.chance
    }));
  }
  
  const totalChance = normalizedAurasTemp.reduce((sum, aura) => sum + aura.normalizedChance, 0);
  const normalizedAuras = normalizedAurasTemp.map(aura => ({
    ...aura,
    normalizedChance: (aura.normalizedChance / totalChance) * 100
  }));
  
  const random = Math.random() * 100;
  let cumulativeChance = 0;
  
  for (const aura of normalizedAuras) {
    cumulativeChance += aura.normalizedChance;
    if (random <= cumulativeChance) {
      return aura;
    }
  }
  return normalizedAuras[normalizedAuras.length - 1];
}

export function generateMultipleAuras(count: number, options: GetRandomAuraOptions = {}): Aura[] {
  const results: Aura[] = [];
  
  for (let i = 0; i < count; i++) {
    const excludeAuras = results.map(aura => aura.name);
    const newOptions = { ...options, excludeAuras };
    
    results.push(getRandomAura(newOptions));
  }
  
  return results;
}