'use client';

import { useState } from 'react';
import { gsap } from 'gsap';

interface ContinueButtonProps {
  onClick: () => void;
  text?: string;
}

const ContinueButton = ({ 
  onClick, 
  text = "Continue to this level" 
}: ContinueButtonProps) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const handleMouseEnter = () => {
    setIsHovering(true);
    
    // Apply glitch effect
    gsap.to(".button-text", {
      duration: 0.1,
      x: () => Math.random() * 4 - 2,
      y: () => Math.random() * 4 - 2,
      opacity: () => 0.8 + Math.random() * 0.2,
      repeat: 5,
      yoyo: true,
      ease: "power1.inOut"
    });
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-20">
      <button
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="button text-xl md:text-3xl px-6 py-4 relative overflow-hidden"
      >
        {isHovering && (
          <div className="absolute inset-0 bg-red-900 opacity-30 animate-pulse"></div>
        )}
        <span className="button-text relative z-10">{text}</span>
      </button>
    </div>
  );
};

export default ContinueButton; 