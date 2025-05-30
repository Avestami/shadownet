'use client';

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface AudioPlayerProps {
  levelId: string;
  autoPlay?: boolean;
  initialVolume?: number;
  onCapture?: () => void;
}

// Define the exported methods
export interface AudioPlayerHandle {
  playCapture: () => Promise<void>;
  setVolume: (volume: number) => void;
}

const AudioPlayer = forwardRef<AudioPlayerHandle, AudioPlayerProps>(({ 
  levelId, 
  autoPlay = false,
  initialVolume = 0.5,
  onCapture
}, ref) => {
  const [volume, setVolume] = useState(initialVolume);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    // Play a success sound when flag is captured
    playCapture: async () => {
      if (audioRef.current) {
        try {
          // Store current position if audio is already playing
          const wasPlaying = !audioRef.current.paused;
          const currentPosition = audioRef.current.currentTime;
          
          // Play the audio
          await audioRef.current.play();
          
          // Call the onCapture callback if provided
          if (onCapture) {
            onCapture();
          }
          
          // If it wasn't playing before, pause it after 2 seconds
          if (!wasPlaying) {
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.pause();
                // Reset to previous position
                audioRef.current.currentTime = currentPosition;
              }
            }, 2000);
          }
        } catch (error) {
          console.error('Error playing capture sound:', error);
        }
      }
    },
    // Allow external volume control
    setVolume: (newVolume: number) => {
      setVolume(newVolume);
    }
  }));

  // Update audio volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Auto-play if specified
  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Error auto-playing audio:', error);
      });
    }
  }, [autoPlay]);

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed top-4 left-4 z-20 bg-black/70 p-2 rounded border border-red-800 flex items-center space-x-2">
      <button 
        onClick={togglePlayPause}
        className="w-6 h-6 flex items-center justify-center text-red-500 hover:text-red-400"
      >
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </button>
      <span className="text-red-500 text-xs">VOL</span>
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.01" 
        value={volume} 
        onChange={handleVolumeChange}
        className="w-20 accent-red-500"
      />
      <audio 
        ref={audioRef}
        src={`/audio/${levelId}.mp3`} 
        loop 
        preload="auto"
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
});

AudioPlayer.displayName = 'AudioPlayer';

export default AudioPlayer; 