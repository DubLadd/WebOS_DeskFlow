import React, { useState } from 'react';
import { Taskbar } from './os/Taskbar';
import { WindowManager } from './os/WindowManager';
import { StartMenu } from './os/StartMenu';
import { DesktopIcons } from './os/DesktopIcons';
import { cn } from '@blinkdotnew/ui';

export default function App() {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background select-none font-sans text-foreground">
      {/* Background / Wallpaper */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2560')`,
          filter: 'brightness(0.6)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/60" />
      </div>

      {/* Desktop Layer */}
      <div className="relative z-10 h-full w-full flex flex-col p-8 pb-24">
        <DesktopIcons />
      </div>

      {/* Window Management Layer */}
      <WindowManager />

      {/* Overlays / System UI */}
      <StartMenu isOpen={isStartMenuOpen} onClose={() => setIsStartMenuOpen(false)} />
      
      {/* Taskbar */}
      <Taskbar isStartOpen={isStartMenuOpen} onToggleStart={() => setIsStartMenuOpen(!isStartMenuOpen)} />

      {/* Global Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[150px] pointer-events-none rounded-full" />
    </div>
  );
}
