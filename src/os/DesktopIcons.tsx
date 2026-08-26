import React from 'react';
import { useWindows } from './store';
import { APPS } from './apps';
import { cn } from '@blinkdotnew/ui';

export const DesktopIcons: React.FC = () => {
  const { openApp, focusWindow, windows } = useWindows();

  const handleLaunch = (app: typeof APPS[0]) => {
    const existing = windows.find(w => w.appId === app.id);
    if (existing && app.singleton) {
      focusWindow(existing.id);
    } else {
      openApp(app);
    }
  };

  return (
    <div className="absolute top-8 left-8 bottom-24 right-8 grid grid-flow-col grid-rows-[repeat(auto-fill,100px)] gap-4 auto-cols-[100px] pointer-events-none">
      {APPS.map((app) => (
        <button
          key={app.id}
          onDoubleClick={() => handleLaunch(app)}
          className={cn(
            "w-24 h-24 flex flex-col items-center justify-center gap-2 group pointer-events-auto rounded-xl transition-all duration-300 active:scale-95 hover:bg-white/5 hover:backdrop-blur-sm",
            "group-focus:bg-white/10 group-focus:backdrop-blur-md"
          )}
        >
          <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 group-hover:bg-primary/20 group-hover:text-primary group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(13,162,231,0.3)] transition-all duration-300">
             {React.cloneElement(app.icon as React.ReactElement, { size: 28 })}
          </div>
          <span className="text-[11px] font-medium text-center truncate w-full text-white/80 group-hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] px-1">
            {app.name}
          </span>
        </button>
      ))}
    </div>
  );
};
