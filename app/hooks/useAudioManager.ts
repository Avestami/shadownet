'use client';

import { useState, useEffect, useCallback } from 'react';
import { getAudioConfig, getSpecialAudioConfig, AudioConfig } from '../../data/audioConfig';

interface AudioManagerState {
  isPlaying: boolean;
  currentLevel: string | null;
  audioConfig: AudioConfig | null;
  isLoading: boolean;
  error: string | null;
}

export const useAudioManager = (initialLevel?: string) => {
  const [state, setState] = useState<AudioManagerState>({
    isPlaying: false,
    currentLevel: initialLevel || null,
    audioConfig: initialLevel ? getAudioConfig(initialLevel) : null,
    isLoading: false,
    error: null
  });

  // Play audio for a specific level
  const playLevelAudio = useCallback((levelId: string) => {
    const config = getAudioConfig(levelId);
    setState(prev => ({
      ...prev,
      currentLevel: levelId,
      audioConfig: config,
      isPlaying: true,
      error: null
    }));
  }, []);

  // Play special audio (ending, menu, etc.)
  const playSpecialAudio = useCallback((type: string) => {
    const config = getSpecialAudioConfig(type);
    setState(prev => ({
      ...prev,
      currentLevel: `special:${type}`,
      audioConfig: config,
      isPlaying: true,
      error: null
    }));
  }, []);

  // Stop audio
  const stopAudio = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: false
    }));
  }, []);

  // Pause audio
  const pauseAudio = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: false
    }));
  }, []);

  // Resume audio
  const resumeAudio = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPlaying: true
    }));
  }, []);

  // Set volume for current audio
  const setVolume = useCallback((volume: number) => {
    setState(prev => ({
      ...prev,
      audioConfig: prev.audioConfig ? {
        ...prev.audioConfig,
        volume: Math.max(0, Math.min(1, volume))
      } : null
    }));
  }, []);

  // Handle audio loading
  const handleAudioLoaded = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: null
    }));
  }, []);

  // Handle audio error
  const handleAudioError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      error
    }));
  }, []);

  // Auto-start audio when level changes
  useEffect(() => {
    if (initialLevel && initialLevel !== state.currentLevel) {
      playLevelAudio(initialLevel);
    }
  }, [initialLevel, state.currentLevel, playLevelAudio]);

  return {
    // State
    isPlaying: state.isPlaying,
    currentLevel: state.currentLevel,
    audioConfig: state.audioConfig,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    playLevelAudio,
    playSpecialAudio,
    stopAudio,
    pauseAudio,
    resumeAudio,
    setVolume,
    handleAudioLoaded,
    handleAudioError
  };
}; 