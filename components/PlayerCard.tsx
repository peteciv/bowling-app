'use client';

import { useState } from 'react';
import { Check, X, Crown, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlayerWithAvailability } from '@/lib/types';

interface PlayerCardProps {
  playerData: PlayerWithAvailability;
  onToggle: (playerId: string, newValue: boolean | null) => void;
}

export function PlayerCard({ playerData, onToggle }: PlayerCardProps) {
  const { player, isAvailable, isBye, isLocked } = playerData;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingValue, setPendingValue] = useState<boolean | null>(null);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const nextValue: boolean | null =
      value === 'null' ? null : value === 'true';

    const hasSubmittedAvailability = isAvailable !== null;
    const isChangingSubmittedValue =
      hasSubmittedAvailability && nextValue !== isAvailable;

    if (isChangingSubmittedValue) {
      setPendingValue(nextValue);
      setIsConfirmOpen(true);
      return;
    }

    onToggle(player.id, nextValue);
  };

  const handleCancelChange = () => {
    setPendingValue(null);
    setIsConfirmOpen(false);
  };

  const handleConfirmChange = () => {
    onToggle(player.id, pendingValue);
    setPendingValue(null);
    setIsConfirmOpen(false);
  };

  return (
    <>
      <div
        className={cn(
          'flex items-center justify-between p-4 rounded-xl border-2 transition-all',
          isAvailable === true && 'bg-green-50 border-traffic-green',
          isAvailable === false && 'bg-red-50 border-traffic-red',
          isAvailable === null && 'bg-gray-50 border-gray-300',
          isLocked && 'opacity-60',
          isBye && 'border-dashed'
        )}
      >
        {/* Left side - Player info */}
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
            {isLocked && (
              <span className="text-sm text-gray-500">(locked)</span>
            )}
          </div>
        </div>

        {/* Right side - Dropdown */}
        <select
          value={isAvailable === null ? 'null' : isAvailable.toString()}
          onChange={handleSelectChange}
          disabled={isLocked}
          className={cn(
            'px-4 py-2 rounded-lg border-2 font-medium transition-all',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            isAvailable === true && 'border-traffic-green bg-traffic-green text-white focus:ring-traffic-green',
            isAvailable === false && 'border-traffic-red bg-traffic-red text-white focus:ring-traffic-red',
            isAvailable === null && 'border-gray-300 bg-white text-gray-700 focus:ring-gray-400',
            isLocked && 'cursor-not-allowed opacity-50'
          )}
        >
          <option value="null">No Reply</option>
          <option value="true">Yes I can!</option>
          <option value="false">No I can&apos;t</option>
        </select>
      </div>

      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={handleCancelChange}
            aria-label="Close confirmation dialog"
          />
          <div className="relative w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Confirm Change
            </h3>
            <p className="text-sm text-gray-600">
              Please confirm you want to change your availability.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                onClick={handleCancelChange}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-bowling-red text-white hover:bg-bowling-red-dark"
                onClick={handleConfirmChange}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
