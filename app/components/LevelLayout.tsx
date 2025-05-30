'use client';

import { ReactNode, useRef } from 'react';
import { useUser } from '../context/UserProvider';
import MatrixBackground from './MatrixBackground';
import Scoreboard from './Scoreboard';
import GlobalAudioPlayer, { GlobalAudioPlayerHandle } from './GlobalAudioPlayer';

interface LevelLayoutProps {
  children: ReactNode;
  levelId: string;
  levelTitle: string;
  levelDescription: string;
  objectives: string[];
  colorCode?: 'red' | 'blue' | 'green' | 'purple' | 'cyan' | 'orange';
  loreText?: string;
  loreSubtext?: string;
}

export default function LevelLayout({
  children,
  levelId,
  levelTitle,
  levelDescription,
  objectives,
  colorCode = 'red',
  loreText = 'Dr. Tenebris Draconis has left a trail of breadcrumbs.',
  loreSubtext = 'The truth is hidden beneath the surface.'
}: LevelLayoutProps) {
  const { user } = useUser();
  const audioPlayerRef = useRef<GlobalAudioPlayerHandle>(null);
  
  // Map color codes to CSS variables
  const colorMap: Record<string, {
    text: string;
    border: string;
    bg: string;
    hover: string;
    matrixColor: string;
  }> = {
    red: {
      text: 'text-red-500',
      border: 'border-red-800',
      bg: 'bg-red-900/30',
      hover: 'hover:bg-red-900/50',
      matrixColor: 'red'
    },
    blue: {
      text: 'text-blue-500',
      border: 'border-blue-800',
      bg: 'bg-blue-900/30',
      hover: 'hover:bg-blue-900/50',
      matrixColor: 'blue'
    },
    green: {
      text: 'text-green-500',
      border: 'border-green-800',
      bg: 'bg-green-900/30',
      hover: 'hover:bg-green-900/50',
      matrixColor: 'green'
    },
    purple: {
      text: 'text-purple-500',
      border: 'border-purple-800',
      bg: 'bg-purple-900/30',
      hover: 'hover:bg-purple-900/50',
      matrixColor: 'purple'
    },
    cyan: {
      text: 'text-cyan-500',
      border: 'border-cyan-800',
      bg: 'bg-cyan-900/30',
      hover: 'hover:bg-cyan-900/50',
      matrixColor: 'cyan'
    },
    orange: {
      text: 'text-orange-500',
      border: 'border-orange-800',
      bg: 'bg-orange-900/30',
      hover: 'hover:bg-orange-900/50',
      matrixColor: 'orange'
    }
  };
  
  const colors = colorMap[colorCode];
  
  return (
    <div className={`page-content min-h-screen bg-black ${colors.text} relative overflow-auto`}>
      <MatrixBackground colorCode={colors.matrixColor as "red" | "green" | "blue" | "purple"} density="medium" />
      
      <GlobalAudioPlayer 
        ref={audioPlayerRef} 
        levelId={levelId} 
        initialVolume={0.5} 
        autoPlay={false} 
      />
      
      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="mt-16 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Main content area (2/3 width) */}
            <div className="md:col-span-8 w-full">
              {children}
            </div>
            
            {/* Right sidebar with Information Panel and Scoreboard (1/3 width) */}
            <div className="md:col-span-4 w-full space-y-6">
              {/* Information Panel */}
              <div className={`bg-black/70 border ${colors.border} p-4 rounded-lg`}>
                <h2 className={`text-xl font-mono border-b ${colors.border} pb-2 mb-4`}>
                  LEVEL: {levelId.toUpperCase()}
                </h2>
                <div className="prose prose-sm prose-invert prose-blue">
                  <p>{levelTitle}</p>
                  <p className="mt-2">{levelDescription}</p>
                  <p className="mt-2">Objectives:</p>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                  
                  <div className={`mt-4 pt-4 border-t ${colors.border}`}>
                    <p className="text-xs">{loreText}</p>
                    <p className="text-xs mt-1">{loreSubtext}</p>
                  </div>
                </div>
              </div>
              
              {/* Scoreboard */}
              <div className="scoreboard-container">
                <Scoreboard 
                  currentUser={user ? {
                    username: user.username,
                    score: user.score || 0,
                    karma: typeof user.karma === 'number'
                      ? user.karma
                      : typeof user.karma === 'object' && user.karma !== null
                        ? Math.round(
                            (
                              (user.karma as any)?.loyalty || 0 + 
                              (user.karma as any)?.defiance || 0 + 
                              (user.karma as any)?.mercy || 0 + 
                              (user.karma as any)?.curiosity || 0 + 
                              (user.karma as any)?.integration || 0
                            ) / 5
                          )
                        : 0
                  } : undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 