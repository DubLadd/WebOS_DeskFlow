import React, { useState } from 'react';
import { useWindows } from './store';
import { Window } from './Window';
import { Taskbar } from './Taskbar';
import { StartMenu } from './StartMenu';
import { APPS } from './apps';
import { cn } from '@blinkdotnew/ui';

export const Desktop: React.FC = () => {
  const { windows, openApp } = useWindows();
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0a0b] text-foreground select-none">
      {/* Background/Wallpaper */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 blur-[2px] scale-105"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop)',
          opacity: 0.6
        }}
      />
      
      {/* Overlay Gradients */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />
      <div className="absolute inset-0 z-1 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)] pointer-events-none" />

      {/* Desktop Icons Layer */}
      <div className="absolute inset-0 z-10 grid grid-flow-col grid-rows-[repeat(auto-fill,minmax(100px,1fr))] gap-4 p-8 w-fit pointer-events-none">
        {APPS.slice(0, 8).map((app) => (
          <button
            key={app.id}
            onDoubleClick={() => openApp(app)}
            className="w-24 h-24 flex flex-col items-center justify-center gap-2 group hover:bg-white/5 rounded-2xl transition-all duration-300 pointer-events-auto active:scale-95 active:bg-white/10"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 border border-white/5 group-hover:bg-primary/20 group-hover:border-primary/30 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(13,162,231,0.3)]">
              {React.cloneElement(app.icon as React.ReactElement, { size: 28, className: "group-hover:text-primary transition-colors duration-300" })}
            </div>
            <span className="text-[11px] font-medium opacity-70 group-hover:opacity-100 transition-opacity text-center px-1 line-clamp-2 drop-shadow-lg drop-shadow-black/50">
              {app.name}
            </span>
          </button>
        ))}
      </div>

      {/* Window Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {windows.map((window) => {
          const app = APPS.find(a => a.id === window.appId);
          if (!app) return null;
          const AppContent = app.component;
          
          return (
            <div key={window.id} className="pointer-events-auto">
              <Window window={window}>
                <AppContent window={window} />
              </Window>
            </div>
          );
        })}
      </div>

      {/* UI Elements Layer */}
      <Taskbar onStartMenuToggle={() => setIsStartMenuOpen(!isStartMenuOpen)} />
      <StartMenu isOpen={isStartMenuOpen} onClose={() => setIsStartMenuOpen(false)} />
    </div>
  );
};
