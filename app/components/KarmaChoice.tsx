'use client';

import { useState } from 'react';

interface KarmaChoiceProps {
  prompt: string;
  onDecision: (choice: 'yes' | 'no', karmaChange: number) => void;
  yesKarma: number;
  noKarma: number;
  disabled?: boolean;
}

export default function KarmaChoice({ 
  prompt, 
  onDecision, 
  yesKarma, 
  noKarma, 
  disabled = false 
}: KarmaChoiceProps) {
  const [hasChosen, setHasChosen] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<'yes' | 'no' | null>(null);

  const handleChoice = (choice: 'yes' | 'no') => {
    if (hasChosen || disabled) return;
    
    const karmaChange = choice === 'yes' ? yesKarma : noKarma;
    setSelectedChoice(choice);
    setHasChosen(true);
    onDecision(choice, karmaChange);
  };

  const getKarmaColor = (karma: number) => {
    if (karma > 0) return 'text-green-400';
    if (karma < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getKarmaDisplay = (karma: number) => {
    if (karma > 0) return `+${karma}`;
    return karma.toString();
  };

  return (
    <div className="bg-gray-900 border border-cyan-500 rounded-lg p-6 my-4 shadow-lg">
      <div className="text-cyan-300 mb-4 font-mono text-sm leading-relaxed">
        {prompt}
      </div>
      
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => handleChoice('yes')}
          disabled={hasChosen || disabled}
          className={`px-6 py-3 rounded border font-mono text-sm transition-all duration-200 ${
            hasChosen
              ? selectedChoice === 'yes'
                ? 'bg-green-900 border-green-400 text-green-300'
                : 'bg-gray-800 border-gray-600 text-gray-500'
              : 'bg-gray-800 border-cyan-500 text-cyan-300 hover:bg-cyan-900 hover:border-cyan-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex flex-col items-center">
            <span>YES</span>
            <span className={`text-xs ${getKarmaColor(yesKarma)}`}>
              {getKarmaDisplay(yesKarma)} karma
            </span>
          </div>
        </button>
        
        <button
          onClick={() => handleChoice('no')}
          disabled={hasChosen || disabled}
          className={`px-6 py-3 rounded border font-mono text-sm transition-all duration-200 ${
            hasChosen
              ? selectedChoice === 'no'
                ? 'bg-red-900 border-red-400 text-red-300'
                : 'bg-gray-800 border-gray-600 text-gray-500'
              : 'bg-gray-800 border-cyan-500 text-cyan-300 hover:bg-cyan-900 hover:border-cyan-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex flex-col items-center">
            <span>NO</span>
            <span className={`text-xs ${getKarmaColor(noKarma)}`}>
              {getKarmaDisplay(noKarma)} karma
            </span>
          </div>
        </button>
      </div>
      
      {hasChosen && (
        <div className="mt-4 text-center text-sm text-gray-400 font-mono">
          Choice recorded. Karma updated.
        </div>
      )}
    </div>
  );
}