/**
 * Update Keys Utility
 * 
 * This script scans the codebase for keys and updates the KEYS_README.md file
 * with the latest values.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Paths
const KEYS_README_PATH = path.join(__dirname, '..', 'KEYS_README.md');
const LEVELS_DIR = path.join(__dirname, '..', 'app', 'levels');
const COMPONENTS_DIR = path.join(__dirname, '..', 'app', 'components');
const DATA_DIR = path.join(__dirname, '..', 'data');

// Key patterns to search for
const KEY_PATTERNS = [
  { regex: /decryptionKey\s*=\s*["']([^"']+)["']/, type: 'Decryption Key' },
  { regex: /flagId\s*=\s*["']([^"']+)["']/, type: 'Terminal Flag' },
  { regex: /solution\s*:\s*["']([^"']+)["']/, type: 'Challenge Solution' },
  { regex: /key\s*=\s*["']([^"']+)["']/, type: 'Decryption Key' },
  { regex: /unlock_code\s*=\s*["']([^"']+)["']/, type: 'Unlock Code' },
];

// Level ID mappings
const LEVEL_MAP = {
  'alpha': 'Alpha Level (Initial Access)',
  'beta': 'Beta Level (Network Infiltration)',
  'gamma': 'Gamma Level (Data Extraction)',
  'delta': 'Delta Level (System Override)',
  'omega': 'Omega Level (Final Confrontation)'
};

// Detected keys will be stored here
const detectedKeys = {};

// Function to scan a file for keys
async function scanFileForKeys(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const fileName = path.basename(filePath);
  let levelId = null;
  
  // Try to determine level ID from the filename or path
  for (const id of Object.keys(LEVEL_MAP)) {
    if (fileName.includes(id) || filePath.includes(`/${id}/`)) {
      levelId = id;
      break;
    }
  }
  
  // Search for keys in the file
  KEY_PATTERNS.forEach(pattern => {
    const matches = fileContent.match(new RegExp(pattern.regex, 'g'));
    if (matches) {
      matches.forEach(match => {
        const keyValue = pattern.regex.exec(match)[1];
        const keyType = pattern.type;
        
        if (levelId) {
          if (!detectedKeys[levelId]) {
            detectedKeys[levelId] = [];
          }
          
          detectedKeys[levelId].push({
            type: keyType,
            value: keyValue,
            file: filePath
          });
        } else {
          // Global keys not associated with a specific level
          if (!detectedKeys.global) {
            detectedKeys.global = [];
          }
          
          detectedKeys.global.push({
            type: keyType,
            value: keyValue,
            file: filePath
          });
        }
      });
    }
  });
}

// Function to scan a directory recursively
async function scanDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      await scanDirectory(filePath);
    } else if (stat.isFile() && 
              (filePath.endsWith('.js') || 
               filePath.endsWith('.jsx') || 
               filePath.endsWith('.ts') || 
               filePath.endsWith('.tsx'))) {
      await scanFileForKeys(filePath);
    }
  }
}

// Function to update the README with new keys
function updateReadme() {
  if (!fs.existsSync(KEYS_README_PATH)) {
    console.error('KEYS_README.md file not found. Please create it first.');
    return;
  }
  
  const readmeContent = fs.readFileSync(KEYS_README_PATH, 'utf8');
  let updatedContent = readmeContent;
  
  // Update current date
  const today = new Date().toISOString().split('T')[0];
  
  // Update keys for each level
  for (const [levelId, keys] of Object.entries(detectedKeys)) {
    if (levelId === 'global') continue;
    
    const levelHeading = LEVEL_MAP[levelId];
    if (!levelHeading) continue;
    
    const levelSectionRegex = new RegExp(`### ${levelHeading}\\s*\\n\\s*\\|[^|]*\\|[^|]*\\|[^|]*\\|[^|]*\\|\\s*\\n\\s*\\|[-]*\\|[-]*\\|[-]*\\|[-]*\\|\\s*((\\n\\s*\\|[^|]*\\|[^|]*\\|[^|]*\\|[^|]*\\|)*)`);
    const levelSectionMatch = updatedContent.match(levelSectionRegex);
    
    if (levelSectionMatch) {
      let newSection = `### ${levelHeading}\n\n| Key Name | Value | Purpose | Last Updated |\n|----------|-------|---------|------------|\n`;
      
      // Add detected keys for this level
      keys.forEach(key => {
        // Try to find existing purpose info using regex
        const purposeRegex = new RegExp(`\\| ${key.type} \\| \`[^\\`]*\` \\| ([^|]*) \\|`);
        const purposeMatch = updatedContent.match(purposeRegex);
        const purpose = purposeMatch ? purposeMatch[1].trim() : 'Needs description';
        
        newSection += `| ${key.type} | \`${key.value}\` | ${purpose} | ${today} |\n`;
      });
      
      // Replace the old section with the new one
      updatedContent = updatedContent.replace(levelSectionRegex, newSection);
    }
  }
  
  // Update global keys
  if (detectedKeys.global && detectedKeys.global.length > 0) {
    const globalSectionRegex = /## Global System Keys\s*\n\s*\|[^|]*\|[^|]*\|[^|]*\|[^|]*\|\s*\n\s*\|[-]*\|[-]*\|[-]*\|[-]*\|\s*((\n\s*\|[^|]*\|[^|]*\|[^|]*\|[^|]*\|)*)/;
    const globalSectionMatch = updatedContent.match(globalSectionRegex);
    
    if (globalSectionMatch) {
      let newSection = `## Global System Keys\n\n| Key Name | Value | Purpose | Last Updated |\n|----------|-------|---------|------------|\n`;
      
      // Add detected global keys
      detectedKeys.global.forEach(key => {
        // Try to find existing purpose info
        const purposeRegex = new RegExp(`\\| \`[^\\`]*\` \\| \`[^\\`]*\` \\| ([^|]*) \\|`);
        const purposeMatch = updatedContent.match(purposeRegex);
        const purpose = purposeMatch ? purposeMatch[1].trim() : 'Needs description';
        
        newSection += `| \`${key.type}\` | \`${key.value}\` | ${purpose} | ${today} |\n`;
      });
      
      // Replace the old section with the new one
      updatedContent = updatedContent.replace(globalSectionRegex, newSection);
    }
  }
  
  // Write the updated content back to the README
  fs.writeFileSync(KEYS_README_PATH, updatedContent, 'utf8');
  console.log('Updated KEYS_README.md with the latest key values.');
}

// Main function
async function main() {
  console.log('Scanning for keys in the codebase...');
  
  try {
    // Scan relevant directories
    await scanDirectory(LEVELS_DIR);
    await scanDirectory(COMPONENTS_DIR);
    await scanDirectory(DATA_DIR);
    
    console.log('Found keys:', JSON.stringify(detectedKeys, null, 2));
    
    // Update the README
    updateReadme();
    
    console.log('Key update complete!');
  } catch (error) {
    console.error('Error updating keys:', error);
  }
}

// Run the script
main(); 