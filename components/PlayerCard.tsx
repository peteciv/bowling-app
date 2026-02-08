'use client';

import { Check, X, Crown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlayerWithAvailability } from '@/lib/types';

interface PlayerCardProps {
  playerData: PlayerWithAvailability;
  onToggle: (playerId: string, newValue: boolean | null) => void;
}

export function PlayerCard({ playerData, onToggle }: PlayerCardProps) {
  const { player, isAvailable, isBye, isLocked } = playerData;

  return (
    <div
      className={cn(
        'p-4 rounded-xl border-2 transition-all',
        isAvailable === true && 'bg-green-50 border-traffic-green',
        isAvailable === false && 'bg-red-50 border-traffic-red',
        isAvailable === null && 'bg-gray-50 border-gray-300',
        isLocked && 'opacity-60',
        isBye && 'border-dashed'
      )}
    >
      {/* Top section - Player info and status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Status icon */}
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              isAvailable === true && 'bg-traffic-green',
              isAvailable === false && 'bg-traffic-red',
              isAvailable === null && 'bg-gray-400'
            )}
          >
            {isAvailable === true && <Check className="w-6 h-6 text-white" />}
            {isAvailable === false && <X className="w-6 h-6 text-white" />}
            {isAvailable === null && <HelpCircle className="w-6 h-6 text-white" />}
          </div>

          {/* Name and badge */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg text-gray-900">
                {player.name}
              </span>
              {isBye && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                  <Crown className="w-3 h-3" />
                  BYE
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {isAvailable === true && "I'm in!"}
              {isAvailable === false && "I'm out"}
              {isAvailable === null && "No response"}
              {isLocked && ' (locked)'}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom section - Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onToggle(player.id, true)}
          disabled={isLocked}
          className={cn(
            'flex-1 py-2.5 px-4 rounded-lg font-medium transition-all',
            'border-2 flex items-center justify-center gap-2',
            isAvailable === true
              ? 'bg-traffic-green text-white border-traffic-green'
              : 'bg-white text-gray-700 border-gray-300 hover:border-traffic-green hover:text-traffic-green',
            isLocked && 'cursor-not-allowed opacity-50'
          )}
        >
          <Check className="w-4 h-4" />
          I'm in
        </button>
        <button
          onClick={() => onToggle(player.id, false)}
          disabled={isLocked}
          className={cn(
            'flex-1 py-2.5 px-4 rounded-lg font-medium transition-all',
            'border-2 flex items-center justify-center gap-2',
            isAvailable === false
              ? 'bg-traffic-red text-white border-traffic-red'
              : 'bg-white text-gray-700 border-gray-300 hover:border-traffic-red hover:text-traffic-red',
            isLocked && 'cursor-not-allowed opacity-50'
          )}
        >
          <X className="w-4 h-4" />
          I'm out
        </button>
      </div>
    </div>
  );
}
