'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Define level data
const LEVELS = [
  { id: 'alpha', title: 'Alpha - Echoed Transmission' },
  { id: 'beta', title: 'Beta - Signal Dissonance' },
  { id: 'gamma', title: 'Gamma - Spectral Overlay' },
  { id: 'delta', title: 'Delta - Memory Residue' },
  { id: 'sigma', title: 'Sigma - Network Shadows' },
  { id: 'theta', title: 'Theta - Hardware Trojan' },
  { id: 'zeta', title: 'Zeta - Web Intrusion' },
  { id: 'sigma-2', title: 'Sigma-2 - Cryptographic Weakness' },
  { id: 'omega', title: 'Omega - The Convergence' }
];

export default function LevelNavigator() {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const navigateToLevel = (levelId: string) => {
    router.push(`/levels/${levelId}`);
    setIsExpanded(false);
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      {isExpanded ? (
        <div className="bg-black/90 border border-gray-700 rounded-lg p-3 shadow-lg">
          <div className="text-center mb-2">
            <h3 className="text-white text-sm font-mono">Select Level</h3>
          </div>
          <div className="grid grid-cols-3 gap-2 max-w-xl">
            {LEVELS.map((level, index) => (
              <button
                key={level.id}
                onClick={() => navigateToLevel(level.id)}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm min-w-10 h-10 flex items-center justify-center"
                title={level.title}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="mt-3 text-center">
            <button
              onClick={() => setIsExpanded(false)}
              className="px-3 py-1 bg-red-900 hover:bg-red-800 text-white rounded text-xs w-full"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm font-mono shadow-lg border border-gray-700"
        >
          Level Select
        </button>
      )}
    </div>
  );
} 