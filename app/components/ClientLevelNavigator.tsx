'use client';

import dynamic from 'next/dynamic';

const LevelNavigator = dynamic(() => import('./LevelNavigator'), {
  ssr: false,
});

export default function ClientLevelNavigator() {
  return <LevelNavigator />;
} 