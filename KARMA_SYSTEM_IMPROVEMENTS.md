# Karma System Improvements Summary

## Changes Made

### 1. ✅ Karma Persistence System
**Problem**: Karma was not persisting when levels were proceeded to or page was refreshed.

**Solution**: 
- Added `localStorage` persistence for karma values
- Karma is now saved to `localStorage` with timestamp on every karma change
- Karma is restored from `localStorage` when user data is loaded
- Both debug mode and regular API mode now persist karma properly

**Implementation**:
```typescript
// Save karma to localStorage
localStorage.setItem('userKarma', JSON.stringify({
  karma: updatedUser.karma,
  lastUpdated: Date.now()
}));

// Restore karma from localStorage
const savedKarma = localStorage.getItem('userKarma');
if (savedKarma) {
  const karmaData = JSON.parse(savedKarma);
  userData.karma = karmaData.karma;
}
```

### 2. ✅ Enhanced User-Friendly Hints
**Problem**: Hints were too brief and not user-friendly enough.

**Solution**: 
- Completely rewrote all level hints with detailed explanations
- Added step-by-step instructions for each level
- Included story context and decryption keys
- Added specific commands and objectives for each level

**Example Enhanced Hint**:
```
LEVEL ALPHA - TEHRAN UNDERGROUND:
This is your first infiltration mission. You're breaking into the perimeter security of ShadowNet.

WHAT TO DO:
1. Use 'ls' to see what files are available
2. Use 'cat <filename>' to read file contents
3. Use 'unlock' to access the encryption challenge
4. Look for the decryption key: "shadowkey"
5. Use 'decrypt <file> shadowkey' to decrypt files
6. Use 'capture' to capture the flag after successful decryption

STORY: You're accessing the resistance network under Azadi Tower. Your choices here will determine if you help or hinder the underground movement.
```

### 3. ✅ Default Karma Changed from 50 to 0
**Problem**: Default karma was 50, which didn't make sense for starting players.

**Solution**:
- Changed default karma from 50 to 0 in all relevant places
- Updated emergency debug user creation
- Updated karma calculations to use 0 as baseline
- All new players now start with 0 karma

**Files Updated**:
- `app/levels/[id]/page.tsx` - Multiple karma references
- Emergency debug user creation
- Karma calculation fallbacks

### 4. ✅ Team Cooperation Mechanics for Omega Level
**Problem**: No team cooperation system for the final level.

**Solution**:
- Added team cooperation mechanics for omega level
- Teams with karma within 2 points of each other can cooperate
- Added `team-status` command to check cooperation eligibility
- Enhanced mission briefing for omega level to show cooperation status
- Updated endings to show cooperation information

**Implementation**:
```typescript
// Team cooperation check
const currentKarma = user?.karma || 0;
const minCoopKarma = currentKarma - 2;
const maxCoopKarma = currentKarma + 2;

// Teams within this range can cooperate
if (otherTeamKarma >= minCoopKarma && otherTeamKarma <= maxCoopKarma) {
  // Cooperation possible
}
```

**New Commands Added**:
- `team-status` - Shows cooperation eligibility and karma range
- Enhanced `mission` command for omega level with cooperation info

### 5. ✅ Improved Decrypt Success Message
**Problem**: Decrypt message didn't clearly tell users what to do next.

**Solution**:
- Updated decrypt success message to explicitly tell users to use `capture` command
- Added clear instructions for proceeding to next level

**Updated Message**:
```
Decryption successful!

SENSITIVE DATA DECRYPTED

This file contains critical information about ShadowNet's [level] level.
Use the "capture" command to claim the flag for this level.
```

## New Features Added

### Team Cooperation System
- **Cooperation Range**: Teams with karma within ±2 points can cooperate
- **Cooperation Benefits**: 
  - Shared knowledge and resources
  - Enhanced ending narratives
  - Collective impact on the Ghost Grid
- **Cooperation Display**: Shows in endings page with detailed cooperation information

### Enhanced Endings
- All endings now show team cooperation information
- Cooperation ranges displayed based on final karma
- Different cooperation outcomes based on karma levels:
  - **High Karma (>4)**: Natural leaders for cooperative efforts
  - **Medium Karma (0-4)**: Flexible cooperation with various groups
  - **Low Karma (<0)**: Challenging but possible cooperation

### Improved Terminal Commands
- `hint` command now provides comprehensive level guides
- `team-status` command for omega level cooperation checking
- Enhanced `mission` command with cooperation status for omega level

## Technical Implementation Details

### Karma Persistence
- Uses `localStorage` with key `userKarma`
- Stores karma value and timestamp
- Automatically restores on page load/refresh
- Works in both debug mode and production mode

### Team Cooperation Logic
```typescript
// Cooperation eligibility check
const isCooperationPossible = (team1Karma: number, team2Karma: number): boolean => {
  return Math.abs(team1Karma - team2Karma) <= 2;
};

// Cooperation quality based on karma similarity
const getCooperationQuality = (team1Karma: number, team2Karma: number): string => {
  const difference = Math.abs(team1Karma - team2Karma);
  if (difference === 0) return "Perfect";
  if (difference === 1) return "Excellent";
  if (difference === 2) return "Good";
  return "Incompatible";
};
```

### Enhanced User Experience
- Step-by-step instructions in hints
- Clear command explanations
- Story context for each level
- Explicit next-step guidance

## Testing Recommendations

### Karma Persistence Testing
1. Make karma decisions in any level
2. Refresh the page or navigate to another level
3. Verify karma value is maintained
4. Test both debug mode and regular mode

### Team Cooperation Testing
1. Complete the game with different karma scores
2. Check omega level `team-status` command
3. Verify cooperation ranges are calculated correctly
4. Test endings page cooperation information

### Hint System Testing
1. Use `hint` command in each level
2. Verify detailed instructions are provided
3. Check that decryption keys are mentioned
4. Confirm story context is included

## Future Enhancements

### Potential Improvements
- Real-time team cooperation matching
- Karma-based difficulty adjustments
- Cooperative puzzle solving
- Team chat system for omega level
- Karma history tracking
- Achievement system based on cooperation

### Multiplayer Features
- Team formation based on karma compatibility
- Shared objectives for cooperating teams
- Collective endings based on team performance
- Cross-team communication systems

## Files Modified

### Core Game Files
- `app/levels/[id]/page.tsx` - Main level logic and karma system
- `app/endings/page.tsx` - Enhanced endings with cooperation info
- `app/components/Terminal.tsx` - Improved decrypt messages (already done)

### Data Files
- `data/missions.ts` - Mission data (no changes needed)
- `data/audioConfig.ts` - Audio configuration (no changes needed)

### New Files Created
- `KARMA_SYSTEM_IMPROVEMENTS.md` - This documentation file

## Summary

The karma system has been significantly improved with:
- ✅ **Persistent karma** that survives page refreshes and level transitions
- ✅ **User-friendly hints** with detailed step-by-step instructions
- ✅ **Default karma of 0** for new players
- ✅ **Team cooperation mechanics** for the final level
- ✅ **Clear decrypt instructions** telling users to use capture command

These improvements make the game more user-friendly, provide better guidance for players, and add strategic team cooperation elements that enhance the multiplayer experience. 