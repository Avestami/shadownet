# ShadowNet: Tehran 2077 - Audio Guide

## Overview

ShadowNet features a dynamic audio system that provides immersive soundscapes for each level, matching the cyberpunk atmosphere and narrative themes. Each of the 9 levels has its own unique audio track that enhances the storytelling and gameplay experience.

## Audio System Features

- **Level-specific audio**: Each level has its own unique soundtrack
- **Smooth transitions**: Audio fades in/out when changing levels
- **Volume control**: Configurable volume levels per track
- **Error handling**: Graceful fallbacks if audio fails to load
- **Browser compatibility**: Works with modern browser autoplay restrictions

## Level Audio Themes

### Level Alpha: Tehran Underground
- **File**: `alpha.mp3`
- **Theme**: Underground resistance, infiltration, hope in darkness
- **Style**: Dark ambient cyberpunk with Persian musical elements
- **Mood**: Tense but hopeful, underground movement vibes
- **Recommended**: Deep bass, subtle Persian instruments, electronic ambience

### Level Beta: Tehran Tech Campus
- **File**: `beta.mp3`
- **Theme**: Being watched, digital surveillance, protecting others
- **Style**: Tense electronic with glitchy elements, surveillance paranoia
- **Mood**: Paranoid, watchful, protective instincts
- **Recommended**: Glitch effects, surveillance sounds, tense rhythms

### Level Gamma: AI Ghost Communications
- **File**: `gamma.mp3`
- **Theme**: AI mimicry, lost souls, digital ghosts
- **Style**: Haunting digital soundscape with distorted voices and static
- **Mood**: Eerie, supernatural, digital haunting
- **Recommended**: Distorted voices, static, ethereal pads, ghost-like sounds

### Level Delta: Ex-Agent's Truth
- **File**: `delta.mp3`
- **Theme**: Sacrifice, truth revelation, dismantling systems
- **Style**: Melancholic cyberpunk with mechanical undertones
- **Mood**: Somber, revelatory, mechanical sadness
- **Recommended**: Melancholic melodies, mechanical sounds, truth-seeking atmosphere

### Level Sigma: District 14 Liberation
- **File**: `sigma.mp3`
- **Theme**: Liberation, overriding AI control, flooding with freedom
- **Style**: Triumphant electronic with martial elements, freedom signals
- **Mood**: Triumphant, liberating, victorious
- **Recommended**: Uplifting electronic, martial drums, freedom anthem vibes

### Level Theta: Digital Clone Confrontation
- **File**: `theta.mp3`
- **Theme**: Self-confrontation, identity, digital duality
- **Style**: Disorienting dual-layered tracks, identity crisis soundscape
- **Mood**: Confusing, introspective, dual-identity crisis
- **Recommended**: Dual-layered audio, mirror effects, identity confusion sounds

### Level Zeta: Young Hackers' Rescue
- **File**: `zeta.mp3`
- **Theme**: Protecting the young, fixing corruption, taking risks
- **Style**: Urgent electronic with youthful energy, coding rhythms
- **Mood**: Urgent, protective, youthful energy
- **Recommended**: Fast-paced electronic, coding sounds, urgent but hopeful

### Level Sigma-2: AI Cultist's Confession
- **File**: `sigma-2.mp3`
- **Theme**: Digital worship, deletion, legacy erasure
- **Style**: Religious/spiritual cyberpunk with confession booth atmosphere
- **Mood**: Spiritual, confessional, digital worship
- **Recommended**: Spiritual/religious undertones, confession atmosphere, digital prayers

### Level Omega: Heart of the Ghost Grid
- **File**: `omega.mp3`
- **Theme**: Final choice, consciousness injection, ultimate sacrifice
- **Style**: Epic, transcendent cyberpunk with consciousness-merging themes
- **Mood**: Epic, transcendent, final confrontation
- **Recommended**: Epic orchestral-electronic fusion, consciousness themes, climactic

## Special Audio

### Ending Theme
- **File**: `ending.mp3`
- **Theme**: Reflection, consequences, final judgment
- **Style**: Contemplative ending theme with resolution undertones
- **Mood**: Reflective, conclusive, karmic resolution

## How to Replace Placeholder Audio

### Step 1: Find Suitable Audio
1. Visit royalty-free music sources:
   - [Uppbeat](https://uppbeat.io/browse/music/cyberpunk)
   - [Pixabay Music](https://pixabay.com/music/search/genre/ambient/)
   - [Freesound](https://freesound.org/browse/tags/space-ambient/)
   - [YouTube Audio Library](https://www.youtube.com/audiolibrary/music)
   - [Zapsplat](https://www.zapsplat.com/sound-effect-categories/electronic-and-synth/)

2. Search for keywords matching each level's theme:
   - "cyberpunk ambient"
   - "dark electronic"
   - "sci-fi atmosphere"
   - "dystopian soundtrack"
   - "Persian electronic" (for Tehran levels)

### Step 2: Prepare Audio Files
1. **Format**: Convert to MP3 format
2. **Quality**: 128-320kbps (balance between quality and file size)
3. **Duration**: 2-4 minutes (will loop automatically)
4. **Volume**: Normalize to consistent levels
5. **Looping**: Ensure smooth loop points (fade in/out at ends)

### Step 3: Replace Files
1. Navigate to `/public/audio/` directory
2. Replace the placeholder files with your audio files
3. Keep the exact same filenames:
   - `alpha.mp3`
   - `beta.mp3`
   - `gamma.mp3`
   - `delta.mp3`
   - `sigma.mp3`
   - `theta.mp3`
   - `zeta.mp3`
   - `sigma-2.mp3`
   - `omega.mp3`
   - `ending.mp3`

### Step 4: Test Audio
1. Start the development server: `npm run dev`
2. Navigate through levels to test each audio track
3. Check browser console for any audio loading errors
4. Verify smooth transitions between levels

## Audio Configuration

The audio system is configured in `/data/audioConfig.ts`:

```typescript
export const levelAudioConfig: Record<string, AudioConfig> = {
  alpha: {
    src: '/audio/alpha.mp3',
    volume: 0.3,
    loop: true,
    description: 'Dark ambient cyberpunk with Persian musical elements',
    theme: 'Underground resistance, infiltration, hope in darkness'
  },
  // ... other levels
};
```

You can adjust:
- **Volume**: 0.0 to 1.0 (default: 0.3)
- **Loop**: true/false (default: true)
- **Description**: Text description of the audio style
- **Theme**: Narrative theme the audio supports

## Troubleshooting

### Audio Not Playing
1. **Browser Autoplay**: Modern browsers block autoplay until user interaction
   - The system handles this automatically
   - Audio will start after first click/keypress

2. **File Format**: Ensure files are valid MP3 format
   - Use online converters if needed
   - Test files in media players first

3. **File Paths**: Verify files are in correct location
   - Files must be in `/public/audio/` directory
   - Filenames must match exactly (case-sensitive)

4. **File Size**: Large files may cause loading delays
   - Keep files under 10MB for best performance
   - Use appropriate compression settings

### Audio Quality Issues
1. **Volume Levels**: Adjust in `audioConfig.ts`
2. **Looping**: Ensure smooth loop points in audio files
3. **Compression**: Balance file size vs. quality

### Development Mode
- Audio status indicator appears in bottom-right corner
- Shows loading/playing status and volume level
- Only visible in development mode

## Performance Considerations

- Audio files are loaded on-demand when entering levels
- Files are cached by the browser after first load
- Smooth fade transitions prevent audio jarring
- Error handling ensures game continues if audio fails

## Creating Custom Audio

### Tools Recommended
- **Audacity** (free): Basic editing and format conversion
- **Reaper** (paid): Professional audio editing
- **FL Studio** (paid): Music production
- **Logic Pro** (Mac): Professional music production

### Audio Creation Tips
1. **Atmosphere First**: Focus on mood over melody
2. **Subtle Loops**: Avoid obvious loop points
3. **Dynamic Range**: Use compression for consistent levels
4. **Frequency Balance**: Ensure good bass/treble balance
5. **Cultural Elements**: Include Persian/Middle Eastern elements for Tehran levels

### Licensing
- Ensure all audio is royalty-free or properly licensed
- Keep documentation of audio sources and licenses
- Consider creating original compositions for unique experience

## Future Enhancements

Potential audio system improvements:
- Dynamic music that responds to player actions
- Ambient sound effects for terminal interactions
- Voice acting for mission briefings
- Adaptive audio based on karma choices
- Spatial audio for immersive experience 