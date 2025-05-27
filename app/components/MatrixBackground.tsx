'use client';

import { useEffect, useRef } from 'react';

interface MatrixBackgroundProps {
  colorCode?: 'red' | 'green' | 'blue' | 'purple';
  density?: 'low' | 'medium' | 'high';
}

export const MatrixBackground = ({ 
  colorCode = 'red',
  density = 'medium' 
}: MatrixBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Set up resize handler
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    // Matrix rain characters - Persian, Latin, and hacker symbols
    const characters = 'اشبکهیز۱۲۳۴۵۶۷۸۹۰0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz#$%^&*()+~><|{}/\\[]!@=$_-:.;?';
    
    // Special hacker code snippets to randomly insert
    const hackerSnippets = [
      '#!/bin/bash', 'sudo rm -rf /', 'chmod +x', 'ssh -p 22', 
      'curl -s', 'ping -c 4', 'nc -lvp 4444', 'ls -la', 
      '<script>', '</script>', '{password}', '[SQL]', 
      'SYN-ACK', 'GET /', 'POST /', '200 OK', '404 Not Found',
      'CTF{flag}', 'base64', 'md5sum', 'overflow', 'XSS',
      'SELECT * FROM', 'DROP TABLE', 'chmod 777', 'tar -xzf'
    ];
    
    // Determine column spacing based on density
    let columnSpacing = 20; // default for medium
    if (density === 'low') columnSpacing = 30;
    if (density === 'high') columnSpacing = 12;
    
    // Number of falling streams
    const columns = Math.floor(canvas.width / columnSpacing);
    
    // Array to track the y position of each falling character stream
    const drops: number[] = [];
    
    // Array to track the speed of each stream
    const speeds: number[] = [];
    
    // Array to track if a drop contains a hacker snippet
    const hasHackerSnippet: boolean[] = [];
    
    // Array to store the hacker snippet for each column
    const snippets: string[] = [];
    
    // Array to track the color brightness for each drop (for random highlighting)
    const brightness: number[] = [];
    
    // Initialize all drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -canvas.height;
      speeds[i] = Math.random() * 3 + 1; // Random speed between 1-4
      hasHackerSnippet[i] = Math.random() > 0.85; // 15% chance of having a snippet
      snippets[i] = hackerSnippets[Math.floor(Math.random() * hackerSnippets.length)];
      brightness[i] = Math.random() > 0.9 ? 1.5 : 1; // 10% chance of being bright
    }
    
    // Get color based on prop (force red if not specified)
    const getColor = (bright = false) => {
      // For this request, we'll force red regardless of the colorCode prop
      const baseColor = '#ff0000';
      
      if (bright) {
        return '#ff3333'; // Brighter red for highlights
      }
      return baseColor;
    };
    
    // Function to draw the matrix rain
    const drawMatrix = () => {
      // Semi-transparent black background to create trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // For each column
      for (let i = 0; i < drops.length; i++) {
        // Set text color based on brightness
        ctx.fillStyle = getColor(brightness[i] > 1);
        
        // Calculate x position for the current column
        const x = i * columnSpacing;
        
        // Calculate y position for the current drop
        const y = drops[i];
        
        if (hasHackerSnippet[i] && Math.random() > 0.7) {
          // Draw hacker snippet occasionally
          ctx.font = '10px monospace';
          for (let j = 0; j < snippets[i].length; j++) {
            ctx.fillText(snippets[i][j], x, y + j * 12);
          }
        } else {
          // Choose a random character
          const char = characters[Math.floor(Math.random() * characters.length)];
          
          // Set font size (add some variation)
          ctx.font = `${Math.floor(13 + Math.random() * 4)}px monospace`;
          
          // Draw the character
          ctx.fillText(char, x, y);
        }
        
        // Move the drop down based on its speed
        drops[i] += speeds[i];
        
        // Randomly reset drops to top
        if (drops[i] > canvas.height && Math.random() > 0.975) {
          drops[i] = Math.random() * -100;
          speeds[i] = Math.random() * 3 + 1; // Randomize speed again
          hasHackerSnippet[i] = Math.random() > 0.85; // Recalculate snippet chance
          snippets[i] = hackerSnippets[Math.floor(Math.random() * hackerSnippets.length)];
          brightness[i] = Math.random() > 0.9 ? 1.5 : 1; // Recalculate brightness
        }
      }
    };
    
    // Animation loop - run at higher frequency for smoother animation
    const matrixInterval = setInterval(drawMatrix, 40);
    
    // Clean up
    return () => {
      clearInterval(matrixInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, [colorCode, density]);
  
  return <canvas ref={canvasRef} className="matrix-bg fixed top-0 left-0 w-full h-full -z-10" />;
};

export default MatrixBackground; 