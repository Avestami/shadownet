'use client';

import { useRef, useEffect, useState } from 'react';

interface EnhancedAudioPlayerProps {
  src: string;
  isPlaying: boolean;
  loop?: boolean;
  volume?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
  onAudioLoaded?: () => void;
  onAudioError?: (error: string) => void;
}

const EnhancedAudioPlayer = ({ 
  src, 
  isPlaying, 
  loop = true, 
  volume = 0.5,
  fadeInDuration = 1000,
  fadeOutDuration = 500,
  onAudioLoaded,
  onAudioError
}: EnhancedAudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentVolume, setCurrentVolume] = useState(0);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
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
    
    setIsLoading(true);
    audio.src = src;
    audio.loop = loop;
    audio.volume = 0; // Start with 0 volume for fade in
    
    const handleCanPlayThrough = () => {
      setIsLoading(false);
      if (onAudioLoaded) {
        onAudioLoaded();
      }
    };
    
    const handleError = () => {
      setIsLoading(false);
      if (onAudioError) {
        onAudioError(`Failed to load audio: ${src}`);
      }
    };
    
    audio.addEventListener('canplaythrough', handleCanPlayThrough);
    audio.addEventListener('error', handleError);
    audio.load();
    
    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlayThrough);
      audio.removeEventListener('error', handleError);
    };
  }, [src, loop, onAudioLoaded, onAudioError]);
  
  // Fade function
  const fadeAudio = (targetVolume: number, duration: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
    }
    
    const startVolume = audio.volume;
    const volumeDiff = targetVolume - startVolume;
    const steps = 50; // Number of fade steps
    const stepDuration = duration / steps;
    const volumeStep = volumeDiff / steps;
    
    let currentStep = 0;
    
    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      const newVolume = startVolume + (volumeStep * currentStep);
      
      if (currentStep >= steps) {
        audio.volume = targetVolume;
        setCurrentVolume(targetVolume);
        if (fadeIntervalRef.current) {
          clearInterval(fadeIntervalRef.current);
          fadeIntervalRef.current = null;
        }
      } else {
        audio.volume = newVolume;
        setCurrentVolume(newVolume);
      }
    }, stepDuration);
  };
  
  // Control playback with fade effects
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !hasInteracted || isLoading) return;
    
    if (isPlaying) {
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Fade in
            fadeAudio(volume, fadeInDuration);
          })
          .catch((error) => {
            console.error('Audio playback prevented:', error);
            if (onAudioError) {
              onAudioError('Audio playback was prevented by browser');
            }
          });
      }
    } else {
      // Fade out then pause
      fadeAudio(0, fadeOutDuration);
      setTimeout(() => {
        audio.pause();
      }, fadeOutDuration);
    }
  }, [isPlaying, hasInteracted, isLoading, volume, fadeInDuration, fadeOutDuration, onAudioError]);
  
  // Update volume when prop changes
  useEffect(() => {
    if (isPlaying && !isLoading) {
      fadeAudio(volume, 500); // Quick fade to new volume
    }
  }, [volume, isPlaying, isLoading]);
  
  // Clean up
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);
  
  return (
    <>
      <audio ref={audioRef} />
      {/* Optional: Audio status indicator */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-green-400 p-2 rounded text-xs font-mono z-50">
          Audio: {isLoading ? 'Loading...' : isPlaying ? 'Playing' : 'Paused'} 
          {!isLoading && ` | Vol: ${Math.round(currentVolume * 100)}%`}
        </div>
      )}
    </>
  );
};

export default EnhancedAudioPlayer; 