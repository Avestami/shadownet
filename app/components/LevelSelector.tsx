'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDialogue } from '../contexts/DialogueContext';

interface LevelSelectorProps {
  onClose: () => void;
}

const LevelSelector = ({ onClose }: LevelSelectorProps) => {
  const [unlockedLevels, setUnlockedLevels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { goToDialogue } = useDialogue();

  // Level data
  const levelData = [
    { id: 'level1', name: 'Tehran Metropolis', dialogueId: 'intro' },
    { id: 'level2', name: 'Khuzestan Facility', dialogueId: 'level2_start' },
    { id: 'level3', name: 'Orbital Station', dialogueId: 'level3_start' },
    { id: 'level4', name: 'Mars Colony', dialogueId: 'level4_start' },
  ];

  // Fetch unlocked levels
  useEffect(() => {
    const fetchUnlockedLevels = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/unlock');
        
        if (!response.ok) {
          throw new Error('Failed to fetch unlocked levels');
        }
        
        const data = await response.json();
        setUnlockedLevels(data.unlockedLevels || []);
      } catch (err) {
        console.error('Error fetching unlocked levels:', err);
        setError('Failed to load unlocked levels. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUnlockedLevels();
  }, []);

  // Handle level selection
  const handleLevelSelect = (dialogueId: string) => {
    goToDialogue(dialogueId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-black/90 border border-red-600 p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-mono text-red-500">LEVEL SELECT</h2>
          <button 
            onClick={onClose}
            className="text-red-400 hover:text-red-200"
          >
            ✕
          </button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-red-500 font-mono">Loading available levels...</div>
          </div>
        ) : error ? (
          <div className="text-red-500 font-mono text-center py-4">{error}</div>
        ) : (
          <div className="space-y-2">
            {levelData.map((level) => {
              const isUnlocked = unlockedLevels.includes(level.id);
              
              return (
                <div 
                  key={level.id}
                  className={`p-3 border ${
                    isUnlocked 
                      ? 'border-red-700 hover:border-red-500 cursor-pointer' 
                      : 'border-gray-800 opacity-60 cursor-not-allowed'
                  } rounded-md transition-colors`}
                  onClick={isUnlocked ? () => handleLevelSelect(level.dialogueId) : undefined}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono text-sm text-red-400">{level.id.toUpperCase()}</div>
                      <div className="text-white font-bold">{level.name}</div>
                    </div>
                    <div>
                      {isUnlocked ? (
                        <span className="text-green-500 text-sm">UNLOCKED</span>
                      ) : (
                        <span className="text-gray-500 text-sm">LOCKED</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-900 hover:bg-red-800 text-white font-mono rounded transition-colors"
          >
            RETURN TO GAME
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelSelector; 