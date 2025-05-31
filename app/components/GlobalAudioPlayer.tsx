'use client';

import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface GlobalAudioPlayerProps {
  levelId: string;
  autoPlay?: boolean;
  initialVolume?: number;
  onCapture?: () => void;
}

// Define the exported methods
export interface GlobalAudioPlayerHandle {
  playCapture: () => Promise<void>;
  setVolume: (volume: number) => void;
  playLevelAudio: () => Promise<void>;
  pauseAudio: () => void;
  isMuted: boolean;
  toggleMute: () => void;
}

/**
 * A reusable audio player component for level pages
 * Features:
 * - Volume control
 * - Play/pause toggle
 * - Automatic audio loading based on level
 * - Flag capture sound
 */
const GlobalAudioPlayer = forwardRef<GlobalAudioPlayerHandle, GlobalAudioPlayerProps>(({ 
  levelId, 
  autoPlay = false,
  initialVolume = 0.5,
  onCapture
}, ref) => {
  const [volume, setVolume] = useState(initialVolume);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const captureAudioRef = useRef<HTMLAudioElement | null>(null);

  // Keep track of the previous volume when muting
  const prevVolumeRef = useRef<number>(initialVolume);

  // Check if audio file exists
  useEffect(() => {
    const checkAudioExists = async () => {
      try {
        // Try to fetch the audio file to see if it exists
        const response = await fetch(`/audio/${levelId}.mp3`, { method: 'HEAD' });
        if (!response.ok) {
          console.warn(`Audio file for level ${levelId} doesn't exist or can't be accessed`);
          setHasError(true);
        }
      } catch (error) {
        console.error(`Error checking audio file for level ${levelId}:`, error);
        setHasError(true);
      }
    };
    
    checkAudioExists();
  }, [levelId]);

  // Auto-play when component mounts
  useEffect(() => {
    // Don't try to play if we already know the file doesn't exist
    if (hasError) return;
    
    // Use a small delay to let the browser settle
    const timer = setTimeout(() => {
      if (audioRef.current && autoPlay) {
        console.log(`Auto-playing audio for level ${levelId}...`);
        audioRef.current.play()
          .then(() => {
            console.log(`Audio for ${levelId} playing successfully`);
            setIsPlaying(true);
            setAutoplayBlocked(false);
          })
          .catch(error => {
            console.error(`Error auto-playing audio for ${levelId}:`, error);
            
            // If autoplay was blocked, we'll show a message and set up click-to-play
            if (error.name === 'NotAllowedError') {
              console.log('Autoplay blocked by browser. User must interact first.');
              setAutoplayBlocked(true);
            } else {
              setHasError(true);
            }
          });
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [levelId, autoPlay, hasError]);

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    // Play a success sound when flag is captured
    playCapture: async () => {
      if (captureAudioRef.current) {
        try {
          // Store current position if audio is already playing
          const wasPlaying = audioRef.current && !audioRef.current.paused;
          const currentPosition = audioRef.current ? audioRef.current.currentTime : 0;
          
          // Temporarily reduce background audio volume
          if (audioRef.current && !isMuted) {
            audioRef.current.volume = volume * 0.3; // Reduce to 30% of current volume
          }
          
          // Play the capture sound at full volume
          captureAudioRef.current.volume = isMuted ? 0 : volume;
          await captureAudioRef.current.play();
          
          // Call the onCapture callback if provided
          if (onCapture) {
            onCapture();
          }
          
          // Reset background audio volume after capture sound finishes
          captureAudioRef.current.onended = () => {
            if (audioRef.current && !isMuted) {
              audioRef.current.volume = volume;
            }
          };
          
          return Promise.resolve();
        } catch (error) {
          console.error('Error playing capture sound:', error);
          return Promise.reject(error);
        }
      }
      return Promise.resolve();
    },
    // Allow external volume control
    setVolume: (newVolume: number) => {
      setVolume(newVolume);
      if (!isMuted) {
        prevVolumeRef.current = newVolume;
      }
    },
    // Play level background audio
    playLevelAudio: async () => {
      if (audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          return Promise.resolve();
        } catch (error) {
          console.error('Error playing audio:', error);
          setHasError(true);
          return Promise.reject(error);
        }
      }
      return Promise.resolve();
    },
    // Pause audio
    pauseAudio: () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    },
    // Get mute status
    isMuted,
    // Toggle mute
    toggleMute: () => {
      setIsMuted(!isMuted);
    }
  }));

  // Update audio volume when volume state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
    if (captureAudioRef.current) {
      captureAudioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle mute toggle
  useEffect(() => {
    if (isMuted) {
      prevVolumeRef.current = volume;
      if (audioRef.current) audioRef.current.volume = 0;
      if (captureAudioRef.current) captureAudioRef.current.volume = 0;
    } else {
      if (audioRef.current) audioRef.current.volume = volume;
      if (captureAudioRef.current) captureAudioRef.current.volume = volume;
    }
  }, [isMuted, volume]);

  // Handle audio error
  useEffect(() => {
    const handleError = () => {
      console.error(`Error loading audio for level: ${levelId}`);
      setHasError(true);
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('error', handleError);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('error', handleError);
      }
    };
  }, [levelId]);

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (!isMuted) {
      prevVolumeRef.current = newVolume;
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
          setHasError(true);
        });
        setIsPlaying(true);
      }
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed top-16 left-4 z-30 bg-black/70 p-2 rounded border border-red-800 flex flex-wrap items-center gap-2 max-w-[250px] sm:max-w-none shadow-[0_0_10px_rgba(255,0,0,0.3)]">
      {/* Show play music button when not playing */}
      {!isPlaying && (
        <div 
          onClick={togglePlayPause}
          className="cursor-pointer animate-pulse bg-red-900/40 px-2 py-1 rounded text-xs text-red-300 mr-2 w-full sm:w-auto text-center"
        >
          Click to play music
        </div>
      )}

      {/* Play/Pause Button */}
      <button 
        onClick={togglePlayPause}
        className="w-6 h-6 flex items-center justify-center text-red-500 hover:text-red-400"
        title={isPlaying ? "Pause" : "Play"}
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

      {/* Mute Button */}
      <button 
        onClick={toggleMute}
        className="w-6 h-6 flex items-center justify-center text-red-500 hover:text-red-400"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>

      {/* Volume Control */}
      <div className="flex items-center gap-1">
        <span className="text-red-500 text-xs">VOL</span>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={isMuted ? 0 : volume} 
          onChange={handleVolumeChange}
          className="w-16 sm:w-20 accent-red-500"
          title={`Volume: ${Math.round(volume * 100)}%`}
        />
      </div>

      {/* Level indicator */}
      <div className="hidden sm:block text-xs text-red-400 ml-1">
        {levelId.toUpperCase()}
      </div>

      {/* Level audio */}
      <audio 
        ref={audioRef}
        src={`/audio/${levelId}.mp3`} 
        loop 
        preload="auto"
        onEnded={() => setIsPlaying(false)}
      />

      {/* Capture sound */}
      <audio 
        ref={captureAudioRef}
        src="/audio/capture.mp3" 
        preload="auto"
      />

      {/* Error message for missing audio */}
      {hasError && (
        <span className="text-xs text-red-400">Audio error</span>
      )}
    </div>
  );
});

GlobalAudioPlayer.displayName = 'GlobalAudioPlayer';

export default GlobalAudioPlayer; 