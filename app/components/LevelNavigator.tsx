'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '../context/UserProvider';

interface Level {
  id: string;
  title: string;
}

const LEVELS: Level[] = [
  { id: 'alpha', title: 'Alpha - Perimeter Security' },
  { id: 'beta', title: 'Beta - Signal Dissonance' },
  { id: 'gamma', title: 'Gamma - Database Infiltration' },
  { id: 'delta', title: 'Delta - Memory Extraction' },
  { id: 'sigma', title: 'Sigma - District 14 Liberation' },
  { id: 'theta', title: 'Theta - Mirror System' },
  { id: 'zeta', title: 'Zeta - Teenage Coders' },
  { id: 'sigma-2', title: 'Sigma-2 - AI Cultists' },
  { id: 'omega', title: 'Omega - Final Convergence' }
];

export default function LevelNavigator() {
  const router = useRouter();
  const { user } = useUser();
  const [isExpanded, setIsExpanded] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<Record<string, boolean>>({});
  const [unlockedLevels, setUnlockedLevels] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    if (user) {
      // Determine which levels are unlocked and completed based on user data
      const userFlags = user.flagsCaptured || [];
      
      // Use choices array instead of karmaChoices, which doesn't exist on User
      let userChoices: string[] = [];
      try {
        if (typeof user.choices === 'string') {
          userChoices = JSON.parse(user.choices);
        } else if (Array.isArray(user.choices)) {
          userChoices = user.choices.map(c => String(c));
        }
      } catch (error) {
        console.error('Error parsing user choices:', error);
      }
      
      // Check for flags captured
      const captured: Record<string, boolean> = {
        alpha: userFlags.includes('SHADOWNET{DTHEREFORTH}'),
        beta: userFlags.includes('SHADOWNET{SOUND876}'),
        gamma: userFlags.includes('SHADOWNET{S3CR3T_D34TH}'),
        delta: userFlags.includes('SHADOWNET{NEUR0LINK}'),
        sigma: userFlags.includes('SHADOWNET{DISTRICT_FREEDOM}'),
        theta: userFlags.includes('SHADOWNET{REFLECTIONS}'),
        zeta: userFlags.includes('SHADOWNET{TOKEN_FORGED}'),
        'sigma-2': userFlags.includes('SHADOWNET{FIRST_WORSHIP}'),
        omega: userFlags.includes('SHADOWNET{ASCENSION}')
      };
      
      // A level is truly completed if flag is captured
      const completed: Record<string, boolean> = {};
      LEVELS.forEach(level => {
        completed[level.id] = captured[level.id];
      });
      
      // Make all levels accessible regardless of completion status
      const unlocked: Record<string, boolean> = {};
      LEVELS.forEach(level => {
        unlocked[level.id] = true; // All levels are unlocked
      });
      
      setCompletedLevels(completed);
      setUnlockedLevels(unlocked);
    }
  }, [user]);
  
  const navigateToLevel = (levelId: string) => {
    // Allow navigation to any level, regardless of unlock status
    console.log('[NAVIGATOR] Navigating to level:', levelId);
    
    // First try using router.push, which might not work in some cases
    try {
      router.push(`/levels/${levelId}`);
    } catch (error) {
      console.error('[NAVIGATOR] Router error:', error);
      
      // Fallback to direct window.location navigation
      window.location.href = `/levels/${levelId}`;
    }
    
    setIsExpanded(false);
  };

  // Determine button style based on level status
  const getLevelButtonStyle = (levelId: string) => {
    if (completedLevels[levelId]) {
      return "px-3 py-2 bg-green-900/80 hover:bg-green-800 text-green-300 rounded text-sm min-w-10 h-10 flex items-center justify-center border border-green-700 shadow-[0_0_8px_rgba(0,255,0,0.3)]";
    } else if (unlockedLevels[levelId]) {
      return "px-3 py-2 bg-blue-900/80 hover:bg-blue-800 text-blue-300 rounded text-sm min-w-10 h-10 flex items-center justify-center border border-blue-700 shadow-[0_0_8px_rgba(0,0,255,0.3)]";
    } else {
      // Still show as interactive but with a different style for locked levels
      return "px-3 py-2 bg-gray-900/80 hover:bg-gray-800 text-gray-400 rounded text-sm min-w-10 h-10 flex items-center justify-center border border-gray-700";
    }
  };

  return (
    <div className="level-navigator fixed top-0 left-0 w-full z-20 bg-black/80 backdrop-blur-md border-b border-red-900/50 shadow-[0_0_15px_rgba(255,0,0,0.2)]">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-red-500 hover:text-red-400 focus:outline-none transition-colors"
            aria-label="Toggle level menu"
          >
            {/* Cyberpunk-themed menu icon */}
            <div className="w-6 h-6 flex flex-col justify-around">
              <div className="w-6 h-0.5 bg-red-500 shadow-[0_0_5px_rgba(255,0,0,0.5)]"></div>
              <div className="w-4 h-0.5 bg-red-500 shadow-[0_0_5px_rgba(255,0,0,0.5)] ml-2"></div>
              <div className="w-6 h-0.5 bg-red-500 shadow-[0_0_5px_rgba(255,0,0,0.5)]"></div>
            </div>
          </button>
          <span className="text-red-400 text-sm font-mono">LEVEL SELECT</span>
        </div>
        
        {/* Level buttons for quick navigation */}
        <div className="hidden sm:flex space-x-2">
          {LEVELS.map((level, index) => (
            <button
              key={level.id}
              onClick={() => {
                console.log(`[NAVIGATOR] Clicking level ${level.id}`);
                // Use direct navigation instead of router to ensure it always works
                window.location.href = `/levels/${level.id}`;
              }}
              className={getLevelButtonStyle(level.id)}
              title={`${level.title} ${completedLevels[level.id] ? '(Completed)' : unlockedLevels[level.id] ? '(Unlocked)' : '(Locked but accessible)'}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      
      {/* Expanded level menu (mobile-friendly) */}
      {isExpanded && (
        <div className="absolute w-full bg-black/95 py-2 px-4 shadow-md border-t border-red-900/50 backdrop-blur-md shadow-[0_5px_15px_rgba(255,0,0,0.2)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[70vh] overflow-y-auto">
            {LEVELS.map((level, index) => (
              <button
                key={level.id}
                onClick={() => {
                  console.log(`[NAVIGATOR] Expanded menu: clicking level ${level.id}`);
                  // Use direct navigation instead of router
                  window.location.href = `/levels/${level.id}`;
                  setIsExpanded(false);
                }}
                className={`text-left px-4 py-2 rounded text-sm font-mono ${
                  completedLevels[level.id] 
                    ? 'bg-green-900/30 hover:bg-green-800/40 text-green-400 border border-green-700/50 shadow-[0_0_8px_rgba(0,255,0,0.2)]' 
                    : unlockedLevels[level.id]
                      ? 'bg-blue-900/30 hover:bg-blue-800/40 text-blue-400 border border-blue-700/50 shadow-[0_0_8px_rgba(0,0,255,0.2)]'
                      : 'bg-gray-900/30 hover:bg-gray-800/40 text-gray-400 border border-gray-700/50'
                }`}
              >
                <span className="mr-2 font-bold">{index + 1}.</span>
                {level.title}
              </button>
            ))}
          </div>
          
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => setIsExpanded(false)}
              className="px-3 py-1 bg-red-900/80 hover:bg-red-800 text-red-300 rounded text-xs border border-red-700 shadow-[0_0_8px_rgba(255,0,0,0.3)]"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 