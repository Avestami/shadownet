import { generateBetaChallenge } from '../lib/audio/beta';
import { generateGammaChallenge } from '../lib/images/gamma';
import { initializeLevels } from '../lib/levels';
import * as fs from 'fs';
import * as path from 'path';

async function generateChallenges() {
  try {
    console.log('Generating challenge files...');

    // Create challenge directories
    const challengeDirs = ['alpha', 'beta', 'gamma'];
    for (const dir of challengeDirs) {
      const dirPath = path.join(process.cwd(), 'public/challenges', dir);
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Generate Level Alpha files
    console.log('Generating Alpha challenge...');
    const alphaFile = path.join(process.cwd(), 'public/challenges/alpha/file6.txt');
    if (!fs.existsSync(alphaFile)) {
      fs.copyFileSync(
        path.join(process.cwd(), 'public/challenges/alpha/file6.txt'),
        alphaFile
      );
    }

    // Generate Level Beta audio
    console.log('Generating Beta challenge...');
    await generateBetaChallenge();

    // Generate Level Gamma image
    console.log('Generating Gamma challenge...');
    await generateGammaChallenge();

    // Initialize levels in the database
    console.log('Initializing levels...');
    await initializeLevels();

    console.log('All challenges generated successfully!');
  } catch (error) {
    console.error('Error generating challenges:', error);
    process.exit(1);
  }
}

// Run the generator
generateChallenges(); 