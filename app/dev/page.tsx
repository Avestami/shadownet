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
<<<<<<< HEAD
              <p className="mb-2 text-yellow-500">// TODO: Complete final ending sequence</p>
              <p className="mb-2 text-green-400">// Audio files for level 3 need to be remixed</p>
              <p className="mb-2 text-blue-400">// Update Mars background for level 4</p>
              <p className="mb-2 text-purple-400">// Fix terminal animation glitch when typing too fast</p>
              <p className="mb-2 text-red-400">// Add more encryption challenges for advanced difficulty</p>
=======
              <p className="mb-6 mt-2 text-gray-300">
                Dr. Draconis&apos;s experimental development console for ShadowNet access.
              </p>
              
              {/* Options for the user */}
              <div className="space-y-4">
                {/* Option 1: Unlock All Levels */}
                <button className="w-full p-2 bg-blue-800 hover:bg-blue-700 rounded">
                  Unlock All Levels
                </button>
                
                {/* Option 2: Reset Progress */}
                <button className="w-full p-2 bg-red-800 hover:bg-red-700 rounded">
                  Reset Progress
                </button>
                
                {/* Option 3: Test Audio */}
                <button className="w-full p-2 bg-green-800 hover:bg-green-700 rounded">
                  Test Audio Features
                </button>
                
                {/* Option 4: System Diagnostics */}
                <button className="w-full p-2 bg-purple-800 hover:bg-purple-700 rounded">
                  Run System Diagnostics
                </button>
              </div>
>>>>>>> ed333d272b88f582e19676792eab9a4825d3277f
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