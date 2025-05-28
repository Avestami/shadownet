# Video Files for ShadowNet

This directory contains placeholder files for the game's videos. For the full experience, you should replace these files with actual MP4 video files before deployment.

## Video Requirements

### Level 1: Tehran (Intro)
- **Filename**: `level1.mp4`
- **Content**: Futuristic dystopian Tehran cityscape with Matrix-style digital rain and Persian elements
- **Duration**: 15-30 seconds
- **Resolution**: 1920x1080 (minimum 720p recommended)

### Level 2: Khuzestan
- **Filename**: `level2.mp4`
- **Content**: Dark industrial setting with energy facility visuals, possibly with Persian architectural elements in a futuristic context
- **Duration**: 15-30 seconds
- **Resolution**: 1920x1080 (minimum 720p recommended)

### Level 3: Orbital Station
- **Filename**: `level3.mp4`
- **Content**: Space station, orbital views of Earth, with futuristic HUD elements and network visualizations
- **Duration**: 15-30 seconds
- **Resolution**: 1920x1080 (minimum 720p recommended)

### Level 4: Mars Command
- **Filename**: `level4.mp4`
- **Content**: Mars surface, futuristic facility/command center, with glitchy digital transitions and Persian/alien hybrid symbols
- **Duration**: 15-30 seconds
- **Resolution**: 1920x1080 (minimum 720p recommended)

## Recommended Sources for Royalty-Free Videos

- [Pexels](https://www.pexels.com/videos/)
- [Pixabay](https://pixabay.com/videos/)
- [Videvo](https://www.videvo.net/)
- [StoryBlocks](https://www.storyblocks.com/video/)
- [Motion Elements](https://www.motionelements.com/)
- [Pond5](https://www.pond5.com/)

## How to Add Real Video Files

1. Find suitable video files from royalty-free sources
2. Convert them to MP4 format if needed (h.264 codec recommended)
3. Optimize for web streaming (target file size below 10MB if possible)
4. Add any necessary visual effects to match the hacker/cyberpunk theme
5. Replace the placeholder files in this directory with the real MP4 files
6. Keep the filenames exactly the same

## Video Implementation Notes

The video files are loaded and controlled by the `VideoPlayer.tsx` component, which handles:
- Delayed loading until the "Continue to this level" button is clicked
- Full-screen display
- Event handling for when videos end (transitions to terminal interface)

## Troubleshooting

If videos don't play:
1. Check browser compatibility (MP4 with h.264 is widely supported)
2. Verify the video files aren't too large (compression may be needed)
3. Ensure the correct file paths are used
4. Consider adding multiple formats (WebM as fallback) if needed 