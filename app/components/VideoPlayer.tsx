'use client';

import { useState, useRef, useEffect } from 'react';

interface VideoPlayerProps {
  src: string;
  onVideoEnd: () => void;
  isPlaying: boolean;
  muted?: boolean;
}

const VideoPlayer = ({ 
  src, 
  onVideoEnd, 
  isPlaying,
  muted = false 
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Load video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);
  
  // Handle video loaded
  useEffect(() => {
    const handleVideoLoaded = () => {
      setIsLoaded(true);
    };
    
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadeddata', handleVideoLoaded);
      
      return () => {
        video.removeEventListener('loadeddata', handleVideoLoaded);
      };
    }
  }, []);
  
  // Play/pause control
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !isLoaded) return;
    
    if (isPlaying) {
      // Allow user interaction before playing to avoid autoplay restrictions
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Auto-play prevented:', error);
          // In case of autoplay prevention, we can add a UI element to let the user click to play
          const attemptPlay = () => {
            video.play().catch(e => console.error('Play still prevented:', e));
          };
          
          // Add a click event to the video to attempt play again
          video.addEventListener('click', attemptPlay, { once: true });
        });
      }
    } else {
      video.pause();
    }
  }, [isPlaying, isLoaded]);
  
  // Video end handler
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleEnded = () => {
      onVideoEnd();
    };
    
    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [onVideoEnd]);
  
  return (
    <div className="video-container fixed inset-0 z-20 bg-black flex items-center justify-center">
      <video 
        ref={videoRef}
        className="full-screen-video"
        muted={muted}
        preload="auto"
        playsInline
        controls={false}
        onClick={() => videoRef.current?.play()}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer; 