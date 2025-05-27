'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getEnding } from '../../data/missions';
import MatrixBackground from '../components/MatrixBackground';
import AudioPlayer from '../components/AudioPlayer';
import EnhancedAudioPlayer from '../components/EnhancedAudioPlayer';
import { getSpecialAudioConfig } from '../../data/audioConfig';
import { useAudioManager } from '../hooks/useAudioManager';

export default function EndingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  // Audio management for ending
  const audioManager = useAudioManager();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check for debug mode first
        const debugUser = localStorage.getItem('debugUser');
        if (debugUser) {
          try {
            const userData = JSON.parse(debugUser);
            
            // Restore karma from localStorage if available
            const savedKarma = localStorage.getItem('userKarma');
            if (savedKarma) {
              try {
                const karmaData = JSON.parse(savedKarma);
                userData.karma = karmaData.karma;
              } catch (e) {
                console.error('Invalid karma data in localStorage');
              }
            }
            
            setUser(userData);
            setLoading(false);
            return;
          } catch (e) {
            console.error('Invalid debug user in localStorage');
          }
        }
        
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          
          // Restore karma from localStorage if available and more recent
          const savedKarma = localStorage.getItem('userKarma');
          if (savedKarma) {
            try {
              const karmaData = JSON.parse(savedKarma);
              // Use localStorage karma if it's available
              if (karmaData.karma !== undefined) {
                userData.karma = karmaData.karma;
              }
            } catch (e) {
              console.error('Invalid karma data in localStorage');
            }
          }
          
          setUser(userData);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);
  
  // Start ending audio when component mounts
  useEffect(() => {
    audioManager.playSpecialAudio('ending');
  }, [audioManager]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-300 font-mono">Loading your fate...</div>
      </div>
    );
  }

  const ending = user ? getEnding(user.karma) : "Unknown";
  
  const getEndingDescription = (ending: string, karma: number) => {
    const cooperationRange = `${karma - 2} to ${karma + 2}`;
    
    switch (ending) {
      case "Liberator of the Ghost Grid":
        return `You chose the path of light in the digital darkness. Your actions saved countless souls trapped in the Grid. The resistance remembers your name.

TEAM COOPERATION: Teams with karma in range ${cooperationRange} can work together to establish a new digital order. Your high karma makes you a natural leader for cooperative efforts.

COOPERATIVE ENDING: When teams with similar karma work together, they can create a more stable and just digital society, combining their knowledge and resources for maximum impact.`;
      case "The One Who Walked Through the Ash":
        return `You navigated the gray zones between right and wrong. Your journey was one of survival and pragmatism. The Grid neither embraces nor rejects you.

TEAM COOPERATION: Teams with karma in range ${cooperationRange} can collaborate on balanced solutions. Your moderate karma allows for flexible cooperation with various groups.

COOPERATIVE ENDING: Teams with balanced karma can create pragmatic solutions that consider multiple perspectives, leading to more sustainable outcomes.`;
      case "You Became What You Fought":
        return `The darkness consumed you. In fighting the system, you became the very thing you sought to destroy. The Grid claims another soul.

TEAM COOPERATION: Teams with karma in range ${cooperationRange} may find cooperation challenging but not impossible. Your choices have consequences, but redemption through teamwork remains possible.

COOPERATIVE ENDING: Even teams with negative karma can work together to find alternative paths, though their cooperation may lead to more complex and morally ambiguous outcomes.`;
      default:
        return "Your story ends in mystery.";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <MatrixBackground />
      {audioManager.audioConfig && (
        <EnhancedAudioPlayer 
          src={audioManager.audioConfig.src} 
          isPlaying={audioManager.isPlaying} 
          loop={audioManager.audioConfig.loop} 
          volume={audioManager.audioConfig.volume}
          onAudioLoaded={audioManager.handleAudioLoaded}
          onAudioError={audioManager.handleAudioError}
        />
      )}
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-mono text-cyan-300 mb-8 glitch-text">
            ShadowNet: Tehran 2077
          </h1>
          
          <div className="bg-black bg-opacity-80 border border-cyan-500 rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-mono text-cyan-300 mb-6">
              {ending}
            </h2>
            
            <p className="text-lg font-mono text-gray-300 leading-relaxed mb-6 whitespace-pre-line">
              {getEndingDescription(ending, user?.karma || 0)}
            </p>
            
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="bg-gray-900 p-4 rounded border border-gray-600">
                <div className="text-cyan-300 text-2xl font-mono">{user?.score || 0}</div>
                <div className="text-gray-400 text-sm font-mono">Final Score</div>
              </div>
              
              <div className="bg-gray-900 p-4 rounded border border-gray-600">
                <div className={`text-2xl font-mono ${
                  user?.karma > 4 ? 'text-green-400' : 
                  user?.karma >= 0 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {user?.karma || 0}
                </div>
                <div className="text-gray-400 text-sm font-mono">Final Karma</div>
              </div>
              
              <div className="bg-gray-900 p-4 rounded border border-gray-600">
                <div className="text-cyan-300 text-2xl font-mono">{user?.flagsCaptured?.length || 0}</div>
                <div className="text-gray-400 text-sm font-mono">Flags Captured</div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/scoreboard')}
              className="px-6 py-3 bg-gray-800 border border-cyan-500 text-cyan-300 rounded hover:bg-cyan-900 transition-colors font-mono"
            >
              View Scoreboard
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gray-800 border border-cyan-500 text-cyan-300 rounded hover:bg-cyan-900 transition-colors font-mono"
            >
              Return to Grid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}