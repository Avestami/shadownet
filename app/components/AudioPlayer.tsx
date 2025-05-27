'use client';

import { useRef, useEffect, useState } from 'react';

interface AudioPlayerProps {
  src: string;
  isPlaying: boolean;
  loop?: boolean;
  volume?: number;
}

const AudioPlayer = ({ 
  src, 
  isPlaying, 
  loop = true, 
  volume = 0.5 
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Track user interaction with the page to enable audio
  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      // Remove listeners after first interaction
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
    
    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    
    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, []);
  
  // Set up audio when source changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.src = src;
    audio.loop = loop;
    audio.volume = volume;
    audio.load();
  }, [src, loop, volume]);
  
  // Control playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasInteracted) return;
    
    if (isPlaying) {
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Audio playback prevented:', error);
          // We'll try again after user interaction
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, hasInteracted]);
  
  // Clean up
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);
  
  return <audio ref={audioRef} />;
};

export default AudioPlayer; 