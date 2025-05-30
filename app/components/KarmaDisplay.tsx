'use client';

interface KarmaValues {
  loyalty: number;
  defiance: number;
  mercy: number;
  curiosity: number;
  integration: number;
}

interface KarmaDisplayProps {
  karma: KarmaValues | number;
  score: number;
}

export default function KarmaDisplay({ karma, score }: KarmaDisplayProps) {
  // Calculate total karma or use the provided value
  const totalKarma = typeof karma === 'number' 
    ? karma 
    : Math.round(
        (karma.loyalty + karma.defiance + karma.mercy + karma.curiosity + karma.integration) / 5
      );

  // Determine karma status
  const getKarmaStatus = () => {
    if (totalKarma >= 70) return 'High';
    if (totalKarma <= 30) return 'Low';
    return 'Neutral';
  };
  
  // Determine karma color
  const getKarmaColor = () => {
    if (totalKarma >= 70) return 'text-green-400';
    if (totalKarma <= 30) return 'text-red-400';
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
          {totalKarma} ({getKarmaStatus()})
        </span>
      </div>
      {typeof karma !== 'number' && (
        <div className="mt-2 text-xs">
          <div className="text-cyan-400">Loyalty: {karma.loyalty}</div>
          <div className="text-red-400">Defiance: {karma.defiance}</div>
          <div className="text-green-400">Mercy: {karma.mercy}</div>
          <div className="text-yellow-400">Curiosity: {karma.curiosity}</div>
          <div className="text-purple-400">Integration: {karma.integration}</div>
        </div>
      )}
    </div>
  );
} 