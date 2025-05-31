import React from 'react';

interface LevelLoadingProps {
  color?: string;
  text?: string;
}

export default function LevelLoading({
  color = 'text-red-500',
  text = 'Loading Level Data'
}: LevelLoadingProps) {
  return (
    <div className={`min-h-screen bg-black ${color} flex items-center justify-center`}>
      <div className="text-center">
        <div className="animate-pulse text-xl mb-2">{text}</div>
        <div className="flex gap-1 justify-center">
          {[...Array(3)].map((_, i) => (
            <div 
              key={i} 
              className={`w-3 h-3 rounded-full bg-current animate-pulse`}
              style={{ animationDelay: `${i * 0.15}s`, opacity: 0.7 }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
} 