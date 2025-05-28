'use client';

import { useState, useEffect } from 'react';
import { Choice } from '../../data/story';

interface ChoiceButtonProps {
  choice: Choice;
  onClick: () => void;
  disabled?: boolean;
  karma?: number; // Current karma level - helps determine some consequences
}

export default function ChoiceButton({ choice, onClick, disabled = false, karma = 0 }: ChoiceButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showConsequence, setShowConsequence] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [canReveal, setCanReveal] = useState(false);
  
  // Initial effect for buttons - some choices are locked until you hover for a period
  useEffect(() => {
    // Choices with high negative karma are locked by default
    const isLockedChoice = choice.karmaDelta < -5;
    if (isLockedChoice) {
      setCanReveal(false);
    } else {
      setCanReveal(true);
    }
  }, [choice]);
  
  // Effect to handle reveal timer on locked choices
  useEffect(() => {
    if (isHovered && !canReveal) {
      // For locked choices, require hovering for a period
      const revealTimer = setTimeout(() => {
        setCanReveal(true);
      }, 1500); // 1.5 seconds hover to unlock
      
      return () => clearTimeout(revealTimer);
    }
  }, [isHovered, canReveal]);
  
  // Determine karma effect color
  const getKarmaDeltaColor = () => {
    if (choice.karmaDelta > 0) return 'text-green-400';
    if (choice.karmaDelta < 0) return 'text-red-400';
    return 'text-gray-400';
  };
  
  // Render karma delta with plus sign for positive values
  const renderKarmaDelta = () => {
    if (choice.karmaDelta > 0) return `+${choice.karmaDelta}`;
    return choice.karmaDelta;
  };
  
  // Calculate the real consequences - can be worse if karma is already low
  const calculateRealConsequences = () => {
    // If karma is already low, bad choices have worse consequences
    if (karma < 30 && choice.karmaDelta < 0) {
      return `${choice.consequences} (Warning: Critical karma levels - consequences amplified)`;
    } 
    // If karma is high, good choices might have better outcomes
    else if (karma > 70 && choice.karmaDelta > 0) {
      return `${choice.consequences} (Bonus: High karma advantage detected)`;
    }
    
    return choice.consequences;
  };
  
  // Handle hover interaction
  const handleMouseEnter = () => {
    setIsHovered(true);
    setShowTooltip(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    setShowTooltip(false);
    setShowConsequence(false);
  };
  
  // Handle click - show consequence briefly
  const handleClick = () => {
    if (disabled || !canReveal) return;
    
    setShowConsequence(true);
    // Brief delay to show consequence before executing the choice
    setTimeout(() => {
      onClick();
    }, 800);
  };
  
  return (
    <div className="relative">
      <button
        className={`w-full text-left p-4 rounded-md border transition duration-200 ${
          !canReveal ? 'bg-red-900/20 border-red-800 text-red-400 cursor-wait' :
          disabled ? 'bg-gray-900/50 border-gray-800 cursor-not-allowed opacity-60' :
          'bg-black border-red-800 hover:border-red-600 hover:shadow-[0_0_10px_rgba(255,0,0,0.3)]'
        }`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        disabled={disabled}
      >
        {!canReveal ? (
          <div className="flex items-center">
            <span className="text-red-500 mr-2">🔒</span>
            <span className="flex-grow">
              <span className="animate-pulse">Keep cursor here to unlock dangerous choice...</span>
            </span>
          </div>
        ) : (
          <span className="block text-lg font-medium text-red-300">{choice.text}</span>
        )}
        
        {/* Progress bar for locked choices */}
        {isHovered && !canReveal && (
          <div className="mt-2 h-1 bg-red-900/30 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 animate-[reveal_1.5s_linear]" />
          </div>
        )}
      </button>
      
      {/* Consequences popup */}
      {showConsequence && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-black border-2 border-red-700 p-6 max-w-md rounded-md animate-[appear_0.3s_ease-out]">
            <h3 className="text-red-500 text-xl mb-3 font-mono">CONSEQUENCE DETECTED</h3>
            <p className="text-white mb-4">{calculateRealConsequences()}</p>
            <div className="flex justify-between items-center">
              <div className={`${getKarmaDeltaColor()} font-bold`}>Karma: {renderKarmaDelta()}</div>
              <div className="text-gray-400 text-sm">executing choice...</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Hover tooltip */}
      {showTooltip && canReveal && (
        <div className="absolute z-10 w-full bg-black text-gray-100 p-3 rounded-md shadow-lg border border-red-700 bottom-full left-0 mb-2">
          <div className="mb-2">
            <span className="text-red-400">Karma Effect:</span>{' '}
            <span className={getKarmaDeltaColor()}>
              {renderKarmaDelta()}
            </span>
          </div>
          <div>
            <span className="text-red-400">Potential Consequence:</span>{' '}
            <span className="text-gray-300">{choice.consequences}</span>
          </div>
          {choice.karmaDelta < -5 && (
            <div className="mt-2 text-red-500 text-xs">
              WARNING: This choice has significant negative karma impact!
            </div>
          )}
        </div>
      )}
    </div>
  );
} 