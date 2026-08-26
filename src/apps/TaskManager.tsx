import React from 'react';
import { WindowState } from '../types';
import { useWindows } from '../os/store';
import { APPS } from '../os/apps';
import { cn } from '@blinkdotnew/ui';
import { Activity, X, Monitor, Cpu, MemoryStick, HardDrive } from 'lucide-react';

export const TaskManager: React.FC<{ window: WindowState }> = () => {
  const { windows, closeWindow, focusWindow } = useWindows();

  return (
    <div className="flex flex-col h-full bg-[#0c0e14]/90 rounded-b-xl overflow-hidden backdrop-blur-md">
      {/* Performance Stats Overlay */}
      <div className="p-6 bg-white/5 border-b border-white/5 grid grid-cols-3 gap-4">
        <div className="p-3 bg-white/5 rounded-xl flex items-center gap-3">
          <Cpu className="text-primary" size={20} />
          <div>
            <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-widest">CPU</span>
            <span className="text-sm font-bold">12%</span>
          </div>
        </div>
        <div className="p-3 bg-white/5 rounded-xl flex items-center gap-3">
          <MemoryStick className="text-accent" size={20} />
          <div>
            <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Memory</span>
            <span className="text-sm font-bold">1.4 GB</span>
          </div>
        </div>
        <div className="p-3 bg-white/5 rounded-xl flex items-center gap-3">
          <Activity className="text-green-500" size={20} />
          <div>
            <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Uptime</span>
            <span className="text-sm font-bold">01:42:05</span>
          </div>
        </div>
      </div>

      {/* Processes Table Header */}
      <div className="h-10 flex items-center px-6 bg-black/40 text-[10px] text-muted-foreground uppercase font-bold tracking-widest border-b border-white/5">
        <div className="flex-1">Process Name</div>
        <div className="w-24 text-center">Status</div>
        <div className="w-24 text-center">Z-Index</div>
        <div className="w-12"></div>
      </div>

      {/* Processes List */}
      <div className="flex-1 overflow-auto p-2 space-y-1">
        {windows.map((win) => {
          const app = APPS.find(a => a.id === win.appId);
          return (
            <div 
              key={win.id}
              onClick={() => focusWindow(win.id)}
              className="flex items-center px-4 py-2 hover:bg-white/5 rounded-lg group cursor-default transition-colors"
            >
              <div className="flex-1 flex items-center gap-3 min-w-0">
                 <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-primary">
                    {app ? React.cloneElement(app.icon as React.ReactElement, { size: 16 }) : <Monitor size={16} />}
                 </div>
                 <div className="min-w-0">
                    <span className="block text-xs font-bold truncate">{win.title}</span>
                    <span className="block text-[10px] text-muted-foreground opacity-50 truncate">{win.id}</span>
                 </div>
              </div>
              
              <div className="w-24 flex items-center justify-center">
                 <div className={cn(
                   "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                   win.isMinimized ? "bg-yellow-500/20 text-yellow-500" : "bg-green-500/20 text-green-500"
                 )}>
                   {win.isMinimized ? "Paused" : "Active"}
                 </div>
              </div>

              <div className="w-24 text-center text-xs opacity-50 font-mono">
                {win.zIndex}
              </div>

              <div className="w-12 flex justify-end">
                <button 
                  onClick={(e) => { e.stopPropagation(); closeWindow(win.id); }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-all opacity-0 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {windows.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30 mt-12 text-center">
             <Activity size={48} className="mb-4" />
             <p className="text-sm font-medium">No active processes</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="h-8 flex items-center px-6 bg-white/5 border-t border-white/5 text-[9px] font-bold uppercase tracking-[0.2em] opacity-40">
        Total Processes: {windows.length}
      </div>
    </div>
  );
};
