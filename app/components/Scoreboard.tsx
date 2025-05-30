import { useState, useEffect } from 'react';

interface ScoreboardUser {
  username: string;
  score: number;
  karma: number;
}

interface ScoreboardProps {
  currentUser?: {
    username: string;
    score: number;
    karma: number;
  };
}

const Scoreboard: React.FC<ScoreboardProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<ScoreboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Function to fetch scoreboard data
    const fetchScoreboard = async () => {
      try {
        const res = await fetch('/api/scoreboard');
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users || []);
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
      
      if (existingUserIndex === -1) {
        // Add the current user if not found
        setUsers(prev => [
          { 
            username: currentUser.username, 
            score: currentUser.score || 0, 
            karma: currentUser.karma || 0 
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
            karma: currentUser.karma || 0
          };
          return updated;
        });
      }
    }
  }, [currentUser, users]);
  
  // Sort users by score (highest first)
  const sortedUsers = [...users].sort((a, b) => b.score - a.score);
  
  // Get karma color based on value
  const getKarmaColor = (karma: number) => {
    const karmaValue = karma || 0;
    if (karmaValue >= 70) return 'text-green-400';
    if (karmaValue <= 30) return 'text-red-400';
    return 'text-purple-400';
  };
  
  return (
    <div className="h-full border border-red-800 bg-black/80 rounded-md p-3 overflow-auto">
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
              key={user.username} 
              className={`flex justify-between items-center p-2 border-b border-red-900/50 ${
                currentUser && user.username === currentUser.username 
                  ? 'bg-red-900/30 border border-red-700' 
                  : ''
              }`}
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
              </div>
              <div className="flex space-x-4 text-sm">
                <div>
                  <span className="text-gray-500 mr-1">Score:</span>
                  <span className="text-green-400">{user.score || 0}</span>
                </div>
                <div>
                  <span className="text-gray-500 mr-1">Karma:</span>
                  <span className={getKarmaColor(user.karma)}>{user.karma || 0}</span>
                </div>
              </div>
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