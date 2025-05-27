'use client';

interface KarmaDisplayProps {
  karma: number;
  score: number;
}

export default function KarmaDisplay({ karma, score }: KarmaDisplayProps) {
  // Determine karma status
  const getKarmaStatus = () => {
    if (karma >= 70) return 'High';
    if (karma <= 30) return 'Low';
    return 'Neutral';
  };
  
  // Determine karma color
  const getKarmaColor = () => {
    if (karma >= 70) return 'text-green-400';
    if (karma <= 30) return 'text-red-400';
    return 'text-yellow-400';
  };
  
  return (
    <div className="flex flex-col items-end bg-gray-800 p-3 rounded-md shadow-lg">
      <div className="mb-1">
        <span className="text-gray-400 mr-2">Score:</span>
        <span className="text-blue-400 font-bold">{score}</span>
      </div>
      <div>
        <span className="text-gray-400 mr-2">Karma:</span>
        <span className={`font-bold ${getKarmaColor()}`}>
          {karma} ({getKarmaStatus()})
        </span>
      </div>
    </div>
  );
} 