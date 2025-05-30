'use client';

interface KarmaValues {
  loyalty: number;
  defiance: number;
  mercy: number;
  curiosity: number;
  integration: number;
  [key: string]: number; // Allow other karma types
}

interface KarmaDisplayProps {
  karma: KarmaValues | number | any; // Allow any type for compatibility
  score: number;
}

export default function KarmaDisplay({ karma, score }: KarmaDisplayProps) {
  // Parse karma object if needed and handle all types
  const getKarmaValues = (): KarmaValues => {
    const defaultKarma: KarmaValues = {
      loyalty: 0,
      defiance: 0,
      mercy: 0,
      curiosity: 0,
      integration: 0
    };
    
    // Handle number type
    if (typeof karma === 'number') {
      return defaultKarma;
    }
    
    // Handle string (JSON) type
    if (typeof karma === 'string') {
      try {
        return JSON.parse(karma);
      } catch (e) {
        console.error('Invalid karma JSON:', e);
        return defaultKarma;
      }
    }
    
    // Handle null or undefined
    if (!karma) {
      return defaultKarma;
    }
    
    // Handle object type
    if (typeof karma === 'object') {
      return {
        loyalty: karma.loyalty || 0,
        defiance: karma.defiance || 0,
        mercy: karma.mercy || 0,
        curiosity: karma.curiosity || 0,
        integration: karma.integration || 0
      };
    }
    
    // Default fallback
    return defaultKarma;
  };
  
  const karmaValues = getKarmaValues();
  
  // Calculate total karma
  const totalKarma = typeof karma === 'number' 
    ? karma 
    : Math.round(
        (
          karmaValues.loyalty + 
          karmaValues.defiance + 
          karmaValues.mercy + 
          karmaValues.curiosity + 
          karmaValues.integration
        ) / 5
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
    <div className="flex flex-col items-end bg-black/70 border border-red-800 p-3 rounded-md shadow-lg">
      <div className="mb-1">
        <span className="text-gray-400 mr-2">Score:</span>
        <span className="text-red-400 font-bold">{score}</span>
      </div>
      <div>
        <span className="text-gray-400 mr-2">Karma:</span>
        <span className={`font-bold ${getKarmaColor()}`}>
          {totalKarma} ({getKarmaStatus()})
        </span>
      </div>
      {typeof karma !== 'number' && (
        <div className="mt-2 text-xs">
          <div className="text-cyan-400">Loyalty: {karmaValues.loyalty}</div>
          <div className="text-red-400">Defiance: {karmaValues.defiance}</div>
          <div className="text-green-400">Mercy: {karmaValues.mercy}</div>
          <div className="text-yellow-400">Curiosity: {karmaValues.curiosity}</div>
          <div className="text-purple-400">Integration: {karmaValues.integration}</div>
        </div>
      )}
    </div>
  );
} 