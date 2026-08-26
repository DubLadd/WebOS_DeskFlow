import React, { useState, useEffect } from 'react';
import { useWindows } from './store';
import { APPS } from './apps';
import { cn } from '@blinkdotnew/ui';
import { Monitor, LayoutGrid, Clock, Wifi, Battery, Volume2, Search } from 'lucide-react';
import { format } from 'date-fns';

export const Taskbar: React.FC<{ onToggleStart: () => void; isStartOpen: boolean }> = ({ onToggleStart, isStartOpen }) => {
  const { windows, focusWindow, openApp } = useWindows();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 glass-dark border-t border-white/5 flex items-center justify-between px-4 z-[9999] backdrop-blur-3xl">
      {/* Left Section: Start Button & Search */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleStart}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300",
            isStartOpen ? "bg-primary/20 scale-95" : "hover:bg-white/10 active:scale-90"
          )}
        >
          <LayoutGrid className="text-primary w-6 h-6 drop-shadow-[0_0_8px_rgba(13,162,231,0.5)]" />
        </button>

        <div className="relative group hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search apps..."
            className="h-10 w-48 pl-10 pr-4 bg-white/5 hover:bg-white/10 focus:bg-white/10 focus:w-64 focus:ring-1 focus:ring-primary/30 rounded-lg text-sm transition-all duration-300 outline-none"
          />
        </div>
      </div>

      {/* Center Section: Running & Pinned Apps */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1 bg-white/5 rounded-xl border border-white/5 backdrop-blur-md">
        {APPS.slice(0, 6).map((app) => {
          const isOpen = windows.some((w) => w.appId === app.id);
          const activeWindow = windows.find((w) => w.appId === app.id && !w.isMinimized);

          return (
            <button
              key={app.id}
              onClick={() => isOpen ? (activeWindow ? focusWindow(activeWindow.id) : focusWindow(windows.find(w => w.appId === app.id)!.id)) : openApp(app)}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 group relative",
                activeWindow ? "bg-white/10" : "hover:bg-white/5"
              )}
            >
              <div className={cn(
                "text-2xl transition-transform group-hover:scale-110",
                isOpen ? "text-primary" : "text-foreground/70"
              )}>
                {React.cloneElement(app.icon as React.ReactElement, { size: 22 })}
              </div>
              
              {/* Active Indicator */}
              {isOpen && (
                <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(13,162,231,0.8)]" />
              )}
            </button>
          );
        })}
        
        {/* Divider if there are more running apps */}
        {windows.length > 0 && <div className="w-[1px] h-6 bg-white/10 mx-1" />}

        {/* Dynamic Running Apps (not pinned) */}
        {windows.map((win) => {
          const app = APPS.find(a => a.id === win.appId);
          const isPinned = APPS.slice(0, 6).some(a => a.id === win.appId);
          if (isPinned) return null;

          return (
            <button
              key={win.id}
              onClick={() => focusWindow(win.id)}
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-300 group relative",
                !win.isMinimized ? "bg-white/10" : "hover:bg-white/5"
              )}
            >
              <div className="text-2xl transition-transform group-hover:scale-110 text-primary">
                {app ? React.cloneElement(app.icon as React.ReactElement, { size: 22 }) : <Monitor size={22} />}
              </div>
              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
            </button>
          );
        })}
      </div>

      {/* Right Section: System Tray & Clock */}
      <div className="flex items-center gap-4 text-xs font-medium text-foreground/80">
        <div className="hidden md:flex items-center gap-3 pr-2 border-r border-white/10">
          <Volume2 size={16} className="hover:text-primary cursor-pointer transition-colors" />
          <Wifi size={16} className="hover:text-primary cursor-pointer transition-colors" />
          <Battery size={16} className="hover:text-primary cursor-pointer transition-colors" />
        </div>
        
        <div className="flex flex-col items-end cursor-pointer hover:bg-white/5 px-2 py-1 rounded transition-colors group">
          <span>{format(time, 'HH:mm')}</span>
          <span className="opacity-60 text-[10px] group-hover:opacity-100">{format(time, 'dd/MM/yyyy')}</span>
        </div>
      </div>
    </div>
  );
};
