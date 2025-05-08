import React from 'react';

export function getRarityBadge(chance: number) {
  if (chance <= 2) {
    return (
      <span className="px-2 py-1 bg-yellow-500 text-black rounded-full text-xs font-bold animate-pulse">
        Легендарная
      </span>
    );
  }
  if (chance <= 5) {
    return (
      <span className="px-2 py-1 bg-purple-500 text-white rounded-full text-xs font-bold">
        Эпическая
      </span>
    );
  }
  
  return null;
}

export function getRarityColor(chance: number): string {
  if (chance <= 2) return 'bg-yellow-500/20';
  if (chance <= 5) return 'bg-purple-500/20';
  if (chance <= 10) return 'bg-blue-500/20';
  return 'bg-gray-500/20';
}
