'use client';

import { useState, useEffect } from 'react';
import { useDialogue } from '../contexts/DialogueContext';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Level from './Level';
import MatrixBackground from './MatrixBackground';
import LevelSelector from './LevelSelector';

const Game = () => {
  const { level } = useDialogue();
  const [showLevelSelector, setShowLevelSelector] = useState(false);
  const { data: session } = useSession();
  
  // Map levels to their video sources
  const levelVideos = {
    1: '/videos/level1.mp4',
    2: '/videos/level2.mp4',
    3: '/videos/level3.mp4',
    4: '/videos/level4.mp4',
  };
  
  return (
    <div className="game-container w-full h-screen overflow-hidden bg-black relative">
      {/* Matrix Background - always present */}
      <MatrixBackground />
      
      {/* Persian Title */}
      <div className="absolute top-4 left-0 w-full text-center z-10 pointer-events-none">
        <h1 className="text-red-600 text-xl md:text-3xl font-bold flicker-text" dir="rtl">
          شبکه سایه: رازهای مخفی انسان‌ها
        </h1>
        <h2 className="text-red-400 text-sm md:text-lg mt-1">
          ShadowNet: Hidden Truths of Mankind
        </h2>
      </div>
      
      {/* Game Controls */}
      <div className="absolute top-4 right-4 z-50 flex space-x-2">
        {session ? (
          // User is logged in
          <>
            <span className="text-gray-400 text-xs px-3 py-1 font-mono">
              Agent: <span className="text-green-400">{session.user?.username}</span>
            </span>
            <button 
              onClick={() => setShowLevelSelector(true)}
              className="bg-red-900 hover:bg-red-800 text-white text-xs px-3 py-1 rounded font-mono transition-colors"
              title="Select Level"
            >
              LEVELS
            </button>
            <Link 
              href="/scoreboard"
              className="bg-blue-900 hover:bg-blue-800 text-white text-xs px-3 py-1 rounded font-mono transition-colors"
              title="View Scoreboard"
            >
              SCORES
            </Link>
          </>
        ) : (
          // User is not logged in
          <>
            <Link 
              href="/auth/login"
              className="bg-green-900 hover:bg-green-800 text-white text-xs px-3 py-1 rounded font-mono transition-colors"
              title="Login to your account"
            >
              LOGIN
            </Link>
            <Link 
              href="/auth/register"
              className="bg-purple-900 hover:bg-purple-800 text-white text-xs px-3 py-1 rounded font-mono transition-colors"
              title="Create a new account"
            >
              REGISTER
            </Link>
            <Link 
              href="/scoreboard"
              className="bg-blue-900 hover:bg-blue-800 text-white text-xs px-3 py-1 rounded font-mono transition-colors"
              title="View Scoreboard"
            >
              SCORES
            </Link>
          </>
        )}
      </div>
      
      {/* Dev Tools Link - small and discrete in corner */}
      <div className="absolute bottom-4 right-4 z-50">
        <a 
          href="/dev" 
          className="text-xs text-red-800 hover:text-red-600 font-mono transition-colors opacity-50 hover:opacity-100"
          title="Development Tools"
        >
          [DEV MODE]
        </a>
      </div>
      
      {/* Current Level */}
      <Level 
        levelNumber={level} 
        videoSrc={levelVideos[level as keyof typeof levelVideos] || levelVideos[1]}
      />
      
      {/* Level Selector Modal */}
      {showLevelSelector && (
        <LevelSelector onClose={() => setShowLevelSelector(false)} />
      )}
    </div>
  );
};

export default Game; 