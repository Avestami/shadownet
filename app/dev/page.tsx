import LevelUnlocker from '../components/LevelUnlocker';
import { MatrixBackground } from '../components/MatrixBackground';

export default function DevToolsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <MatrixBackground colorCode="red" />
      
      <div className="container mx-auto py-12 px-4 relative z-10">
        <h1 className="text-3xl font-mono text-red-500 mb-8 text-center">
          AVESTA DEVELOPMENT TOOLS
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-mono text-red-400 mb-4">Level Unlock Tool</h2>
            <p className="mb-4 text-gray-400">
              Use this tool to unlock specific levels directly without playing through the game.
              Here are the unlock codes for each level:
            </p>
            
            <ul className="mb-6 text-sm text-gray-400 font-mono">
              <li className="mb-2">
                <strong>Level 1:</strong> AVES2100_KHUZESTAN_ACCESS (Base64 decoded value)
              </li>
              <li className="mb-2">
                <strong>Level 2:</strong> 3721 (Audio code)
              </li>
              <li className="mb-2">
                <strong>Level 3:</strong> STARGATE47 (Image key)
              </li>
              <li className="mb-2">
                <strong>Level 4:</strong> ZOROASTER (Avesta's identity)
              </li>
            </ul>
            
            <LevelUnlocker />
          </div>
          
          <div>
            <h2 className="text-2xl font-mono text-red-400 mb-4">Development Notes</h2>
            <div className="bg-black/80 border border-red-600 rounded-lg shadow-lg p-4 font-mono text-sm">
              <p className="mb-2 text-yellow-500">// TODO: Complete final ending sequence</p>
              <p className="mb-2 text-green-400">// Audio files for level 3 need to be remixed</p>
              <p className="mb-2 text-blue-400">// Update Mars background for level 4</p>
              <p className="mb-2 text-purple-400">// Fix terminal animation glitch when typing too fast</p>
              <p className="mb-2 text-red-400">// Add more encryption challenges for advanced difficulty</p>
            </div>
            
            <div className="mt-8">
              <h3 className="text-xl font-mono text-red-400 mb-4">Quick Links</h3>
              <div className="flex flex-col space-y-2">
                <a href="/" className="py-2 px-4 bg-red-900 hover:bg-red-800 text-white font-mono rounded text-center">
                  Return to Main Game
                </a>
                <a href="/api/score" className="py-2 px-4 bg-blue-900 hover:bg-blue-800 text-white font-mono rounded text-center">
                  Check Current Score
                </a>
                <a href="/api/unlock" className="py-2 px-4 bg-green-900 hover:bg-green-800 text-white font-mono rounded text-center">
                  Check Unlocked Levels
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 