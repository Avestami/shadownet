'use client';

import { useState, useEffect } from 'react';
import { useDialogue } from '../contexts/DialogueContext';
import VideoPlayer from './VideoPlayer';
import AudioPlayer from './AudioPlayer';
import Terminal from './Terminal';
import ContinueButton from './ContinueButton';

interface LevelProps {
  levelNumber: number;
  videoSrc: string;
}

const Level = ({ levelNumber, videoSrc }: LevelProps) => {
  const {
    currentDialogue,
    handleOptionSelected,
    handleMessageSubmit,
    levelComplete,
    completeLevel
  } = useDialogue();
  
  const [showVideo, setShowVideo] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(true);
  const [playMusic, setPlayMusic] = useState(false);
  
  // Reset state when level changes
  useEffect(() => {
    setShowVideo(false);
    setShowTerminal(false);
    setShowContinueButton(true);
    setPlayMusic(false);
  }, [levelNumber]);
  
  // Continue button handler
  const handleContinue = () => {
    setShowContinueButton(false);
    setShowVideo(true);
  };
  
  // Video end handler
  const handleVideoEnd = () => {
    setShowVideo(false);
    setShowTerminal(true);
    setPlayMusic(true); // Start playing background music when video ends
  };
  
  // When level is complete, show continue button
  useEffect(() => {
    if (levelComplete) {
      // Short delay to allow any terminal messages to be displayed
      const timer = setTimeout(() => {
        setShowTerminal(false);
        setShowContinueButton(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [levelComplete]);
  
  // Handle click on the continue button after level completion
  const handleLevelComplete = () => {
    setPlayMusic(false); // Stop music when proceeding to next level
    completeLevel();
  };
  
  return (
    <div className="w-full h-screen bg-black relative">
      {/* Continue Button */}
      {showContinueButton && (
        <ContinueButton 
          onClick={levelComplete ? handleLevelComplete : handleContinue} 
          text={levelComplete ? "Continue to next level" : "Continue to this level"}
        />
      )}
      
      {/* Video Player */}
      {showVideo && (
        <VideoPlayer 
          src={videoSrc} 
          onVideoEnd={handleVideoEnd}
          isPlaying={showVideo} 
        />
      )}
      
      {/* Terminal Interface */}
      {showTerminal && currentDialogue && (
        <div className="w-full h-screen p-4 md:p-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-4xl h-full">
            <Terminal 
              initialMessages={currentDialogue.messages}
              options={currentDialogue.options}
              onOptionSelected={handleOptionSelected}
              allowTyping={currentDialogue.allowTyping}
              onMessageSubmit={handleMessageSubmit}
            />
          </div>
        </div>
      )}
      
      {/* Background Music */}
      {currentDialogue?.backgroundMusic && (
        <AudioPlayer 
          src={currentDialogue.backgroundMusic} 
          isPlaying={playMusic}
          loop={true}
          volume={0.3}
        />
      )}
    </div>
  );
};

export default Level; 