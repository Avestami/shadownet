# Audio Files for ShadowNet: Tehran 2077

This directory contains audio files for the game's cyberpunk atmosphere. Each level has its own unique audio track that matches the mission's theme and setting.

## Audio Requirements

### Level Alpha: Tehran Underground
- **Filename**: `alpha.mp3`
- **Style**: Dark ambient cyberpunk with Persian musical elements, underground resistance vibes
- **Duration**: 2-3 minutes (will be looped)
- **Theme**: Infiltration, resistance, hope in darkness
- **Volume**: Moderate, should not interfere with gameplay

### Level Beta: Tehran Tech Campus
- **Filename**: `beta.mp3`
- **Style**: Tense electronic with glitchy elements, surveillance paranoia
- **Duration**: 2-3 minutes (will be looped)
- **Theme**: Being watched, digital surveillance, protecting others
- **Volume**: Moderate, should not interfere with gameplay

### Level Gamma: AI Ghost Communications
- **Filename**: `gamma.mp3`
- **Style**: Haunting digital soundscape with distorted voices and static
- **Duration**: 2-3 minutes (will be looped)
- **Theme**: AI mimicry, lost souls, digital ghosts
- **Volume**: Moderate, should not interfere with gameplay

### Level Delta: Ex-Agent's Truth
- **Filename**: `delta.mp3`
- **Style**: Melancholic cyberpunk with mechanical undertones
- **Duration**: 2-3 minutes (will be looped)
- **Theme**: Sacrifice, truth revelation, dismantling systems
- **Volume**: Moderate, should not interfere with gameplay

### Level Sigma: District 14 Liberation
- **Filename**: `sigma.mp3`
- **Style**: Triumphant electronic with martial elements, freedom signals
- **Duration**: 2-3 minutes (will be looped)
- **Theme**: Liberation, overriding AI control, flooding with freedom
- **Volume**: Moderate, should not interfere with gameplay

### Level Theta: Digital Clone Confrontation
- **Filename**: `theta.mp3`
- **Style**: Disorienting dual-layered tracks, identity crisis soundscape
- **Duration**: 2-3 minutes (will be looped)
- **Theme**: Self-confrontation, identity, digital duality
- **Volume**: Moderate, should not interfere with gameplay

### Level Zeta: Young Hackers' Rescue
- **Filename**: `zeta.mp3`
- **Style**: Urgent electronic with youthful energy, coding rhythms
- **Duration**: 2-3 minutes (will be looped)
- **Theme**: Protecting the young, fixing corruption, taking risks
- **Volume**: Moderate, should not interfere with gameplay

### Level Sigma-2: AI Cultist's Confession
- **Filename**: `sigma-2.mp3`
- **Style**: Religious/spiritual cyberpunk with confession booth atmosphere
- **Duration**: 2-3 minutes (will be looped)
- **Theme**: Digital worship, deletion, legacy erasure
- **Volume**: Moderate, should not interfere with gameplay

### Level Omega: Heart of the Ghost Grid
- **Filename**: `omega.mp3`
- **Style**: Epic, transcendent cyberpunk with consciousness-merging themes
- **Duration**: 3-4 minutes (will be looped)
- **Theme**: Final choice, consciousness injection, ultimate sacrifice
- **Volume**: Moderate, should not interfere with gameplay

## Recommended Sources for Royalty-Free Music

- [Uppbeat](https://uppbeat.io/browse/music/cyberpunk)
- [Pixabay Music](https://pixabay.com/music/search/genre/ambient/)
- [Freesound](https://freesound.org/browse/tags/space-ambient/)
- [Premium Beat](https://www.premiumbeat.com/royalty-free/sci-fi-music)
- [YouTube Audio Library](https://www.youtube.com/audiolibrary/music)
- [Zapsplat](https://www.zapsplat.com/sound-effect-categories/electronic-and-synth/)

## How to Add Real Audio Files

1. Find suitable audio files from royalty-free sources
2. Convert them to MP3 format if needed
3. Ensure they're optimized for web (128-320kbps is sufficient)
4. Replace the placeholder files in this directory with the real MP3 files
5. Keep the filenames exactly the same

## Audio Implementation Notes

The audio files are loaded and controlled by the `AudioPlayer.tsx` component, which handles:
- Autoplay restrictions (requires user interaction)
- Volume control
- Looping behavior
- Level-specific audio switching

The application plays level-specific music when entering each level, creating an immersive atmosphere that matches the mission's theme and narrative.

## Troubleshooting

If audio doesn't play:
1. Ensure browser autoplay restrictions aren't blocking playback
2. Check that the audio files are valid MP3 format
3. Verify the file permissions and paths
4. Check browser console for audio loading errors 