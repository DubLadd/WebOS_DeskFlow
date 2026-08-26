import React, { useState } from 'react';
import { useWindows } from './store';
import { APPS } from './apps';
import { cn } from '@blinkdotnew/ui';
import { Search, LogOut, Power, User, X, ChevronRight } from 'lucide-react';
import { AppConfig } from './types';

interface StartMenuProps {
  onClose: () => void;
  isOpen: boolean;
}

export const StartMenu: React.FC<StartMenuProps> = ({ onClose, isOpen }) => {
  const { openApp } = useWindows();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = APPS.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  const handleLaunch = (app: AppConfig) => {
    openApp(app);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className={cn(
        "relative w-[600px] h-[700px] glass-dark rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden transition-all duration-300",
        isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-10"
      )}>
        {/* Search Bar */}
        <div className="p-6 bg-white/5 border-b border-white/5">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search apps, files, and settings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
              className="h-12 w-full pl-12 pr-4 bg-white/5 hover:bg-white/10 focus:bg-white/10 focus:ring-1 focus:ring-primary/30 rounded-xl text-sm transition-all outline-none"
            />
          </div>
        </div>

        {/* Apps Grid */}
        <div className="flex-1 overflow-auto p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground opacity-50">Pinned Apps</h3>
            <button className="text-xs text-primary hover:underline flex items-center gap-1 group">
              All apps <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-8">
            {filteredApps.map((app) => (
              <button
                key={app.id}
                onClick={() => handleLaunch(app)}
                className="flex flex-col items-center gap-2 group transition-transform active:scale-95"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/5 group-hover:bg-primary/20 group-hover:text-primary group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(13,162,231,0.3)] transition-all duration-300 relative">
                  {React.cloneElement(app.icon as React.ReactElement, { size: 28 })}
                  
                  {/* Subtle dot if running? */}
                </div>
                <span className="text-[11px] font-medium text-center truncate w-full opacity-70 group-hover:opacity-100 transition-opacity">
                  {app.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Recommended / Recent */}
        <div className="p-8 bg-white/5 border-t border-white/5">
           <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground opacity-50 mb-4">Recommended</h3>
           <div className="grid grid-cols-2 gap-4">
             <div className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-xl cursor-pointer transition-colors group">
               <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
                 <User size={20} />
               </div>
               <div className="flex flex-col">
                 <span className="text-xs font-semibold">Get Started</span>
                 <span className="text-[10px] opacity-60">Learn how to use DeskFlow</span>
               </div>
             </div>
             <div className="flex items-center gap-3 p-2 hover:bg-white/10 rounded-xl cursor-pointer transition-colors group">
               <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-accent/10 text-accent">
                 <Power size={20} />
               </div>
               <div className="flex flex-col">
                 <span className="text-xs font-semibold">Settings</span>
                 <span className="text-[10px] opacity-60">Personalize your desktop</span>
               </div>
             </div>
           </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-black/40 flex items-center justify-between">
          <div className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-xl transition-colors cursor-pointer group">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary text-primary group-hover:text-primary-foreground transition-all">
              <User size={18} />
            </div>
            <span className="text-sm font-medium">Blink User</span>
          </div>
          
          <div className="flex items-center gap-2">
             <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors">
               <LogOut size={18} className="opacity-70" />
             </button>
             <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-destructive">
               <Power size={18} className="opacity-70" />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
