import { useState, useEffect } from 'react';

interface ScoreboardUser {
  username: string;
  score: number;
  karma: number | any;
  expandedView?: boolean;
}

interface ScoreboardProps {
  currentUser?: {
    username: string;
    score: number;
    karma: number | any;
  };
}

const Scoreboard: React.FC<ScoreboardProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<ScoreboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Helper function to normalize karma value
  const normalizeKarma = (karma: any): number => {
    // Handle number directly
    if (typeof karma === 'number') return karma;
    
    // Handle object type with karma values
    if (typeof karma === 'object' && karma !== null) {
      try {
        const values = [
          karma.loyalty || 0,
          karma.defiance || 0,
          karma.mercy || 0,
          karma.curiosity || 0,
          karma.integration || 0
        ];
        return Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
      } catch (e) {
        console.error('Error parsing karma object:', e);
        return 0;
      }
    }
    
    // Handle string (JSON) type
    if (typeof karma === 'string') {
      try {
        const parsed = JSON.parse(karma);
        return normalizeKarma(parsed);
      } catch (e) {
        console.error('Error parsing karma JSON:', e);
        return 0;
      }
    }
    
    return 0;
  };

  // Helper function to extract karma values
  const getKarmaValues = (karma: any) => {
    // Default empty karma object
    const defaultKarma = {
      loyalty: 0,
      defiance: 0,
      mercy: 0,
      curiosity: 0,
      integration: 0
    };
    
    // Handle number directly (legacy format)
    if (typeof karma === 'number') {
      // If it's just a number, distribute evenly
      const value = Math.round(karma / 5);
      return defaultKarma;
    }
    
    // Handle object type
    if (typeof karma === 'object' && karma !== null) {
      return {
        loyalty: karma.loyalty || 0,
        defiance: karma.defiance || 0,
        mercy: karma.mercy || 0,
        curiosity: karma.curiosity || 0,
        integration: karma.integration || 0
      };
    }
    
    // Handle string (JSON) type
    if (typeof karma === 'string') {
      try {
        const parsed = JSON.parse(karma);
        return getKarmaValues(parsed);
      } catch (e) {
        console.error('Error parsing karma JSON:', e);
        return defaultKarma;
      }
    }
    
    return defaultKarma;
  };
  
  useEffect(() => {
    // Function to fetch scoreboard data
    const fetchScoreboard = async () => {
      try {
        const res = await fetch('/api/scoreboard');
        if (res.ok) {
          const data = await res.json();
          setUsers((data.users || []).map(user => ({
            ...user,
            expandedView: false
          })));
        }
      } catch (error) {
        console.error('Error fetching scoreboard:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Initial fetch
    fetchScoreboard();
    
    // Set up interval to refresh the scoreboard every 10 seconds
    const intervalId = setInterval(fetchScoreboard, 10000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Add current user to top of list if not already included
  useEffect(() => {
    if (currentUser && currentUser.username) {
      // Check if current user exists in the list
      const existingUserIndex = users.findIndex(u => u.username === currentUser.username);
      
      const normalizedKarma = normalizeKarma(currentUser.karma);
      
      if (existingUserIndex === -1) {
        // Add the current user if not found
        setUsers(prev => [
          { 
            username: currentUser.username, 
            score: currentUser.score || 0, 
            karma: currentUser.karma,
            expandedView: false
          },
          ...prev
        ]);
      } else {
        // Update the current user's score/karma if already in list
        setUsers(prev => {
          const updated = [...prev];
          updated[existingUserIndex] = {
            ...updated[existingUserIndex],
            score: currentUser.score || 0,
            karma: currentUser.karma
          };
          return updated;
        });
      }
    }
  }, [currentUser, users]);

  // Toggle expanded view for a user
  const toggleUserExpand = (index: number) => {
    setUsers(prev => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        expandedView: !updated[index].expandedView
      };
      return updated;
    });
  };
  
  // Sort users by score (highest first)
  const sortedUsers = [...users].sort((a, b) => b.score - a.score);
  
  // Get karma color based on value
  const getKarmaColor = (karma: number) => {
    const karmaValue = karma || 0;
    if (karmaValue >= 70) return 'text-green-400';
    if (karmaValue <= 30) return 'text-red-400';
    return 'text-purple-400';
  };

  // Get specific karma type color
  const getKarmaTypeColor = (type: string) => {
    switch (type) {
      case 'loyalty': return 'text-cyan-400';
      case 'defiance': return 'text-red-400';
      case 'mercy': return 'text-green-400';
      case 'curiosity': return 'text-yellow-400';
      case 'integration': return 'text-purple-400';
      default: return 'text-white';
    }
  };
  
  return (
    <div className="h-full border border-red-800 bg-black/80 rounded-md p-3">
      <div className="text-red-400 font-mono mb-3 text-center border-b border-red-900 pb-2">
        LIVE SCOREBOARD
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-pulse text-red-500">Loading data...</div>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedUsers.map((user, index) => (
            <div 
              key={`${user.username}-${index}`}
              className={`flex flex-col p-2 border-b border-red-900/50 ${
                currentUser && user.username === currentUser.username 
                  ? 'bg-red-900/30 border border-red-700' 
                  : ''
              }`}
            >
              <div 
                className="flex justify-between items-center cursor-pointer" 
                onClick={() => toggleUserExpand(index)}
              >
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">{index + 1}.</span>
                  <span className={
                    currentUser && user.username === currentUser.username 
                      ? 'text-red-300 font-bold' 
                      : 'text-red-500'
                  }>
                    {user.username}
                  </span>
                  <span className="text-gray-500 ml-2 text-xs">
                    {user.expandedView ? '▼' : '▶'}
                  </span>
                </div>
                <div className="flex space-x-4 text-sm">
                  <div>
                    <span className="text-gray-500 mr-1">Score:</span>
                    <span className="text-red-400">{user.score || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 mr-1">Karma:</span>
                    <span className={getKarmaColor(normalizeKarma(user.karma))}>
                      {normalizeKarma(user.karma) || 0}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Expanded karma details */}
              {user.expandedView && (
                <div className="mt-2 pl-6 grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
                  {Object.entries(getKarmaValues(user.karma)).map(([type, value]) => (
                    <div key={type} className="flex justify-between">
                      <span className={`${getKarmaTypeColor(type)} capitalize`}>
                        {type}:
                      </span>
                      <span className="text-white">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {users.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No users have scored points yet
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Scoreboard; 