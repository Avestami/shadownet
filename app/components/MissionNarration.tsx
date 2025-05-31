'use client';

import { useState, useEffect } from 'react';
import AudioPlayer from './AudioPlayer';

interface MissionNarrationProps {
  narration: string;
  onComplete?: () => void;
  audioSrc?: string;
}

export default function MissionNarration({ 
  narration, 
  onComplete,
  audioSrc = '/audio/alpha.mp3'
}: MissionNarrationProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    // Start audio when component mounts
    setIsAudioPlaying(true);
    
    // Typewriter effect
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < narration.length) {
        setDisplayedText(narration.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
        if (onComplete) {
          setTimeout(onComplete, 1000); // Give time to read the last character
        }
      }
    }, 50); // Adjust speed as needed

    return () => {
      clearInterval(interval);
      setIsAudioPlaying(false);
    };
  }, [narration, onComplete]);

  return (
    <div className="relative">
      <AudioPlayer 
        levelId="narration" 
        autoPlay={isAudioPlaying} 
        initialVolume={0.3} 
      />
      
      <div className="bg-black bg-opacity-90 border border-cyan-500 rounded-lg p-6 mb-6 shadow-2xl">
        <div className="text-cyan-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">
          {displayedText}
          {!isComplete && <span className="animate-pulse">_</span>}
        </div>
      </div>
      
      {isComplete && (
        <div className="text-center text-gray-500 text-xs font-mono animate-pulse">
          [TRANSMISSION COMPLETE]
        </div>
      )}
    </div>
  );
} 