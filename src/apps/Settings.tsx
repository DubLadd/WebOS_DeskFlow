import React, { useState } from 'react';
import { WindowState } from '../types';
import { cn } from '@blinkdotnew/ui';
import { Settings as SettingsIcon, Monitor, Palette, User, Bell, Shield, Info, Image as ImageIcon } from 'lucide-react';

const WALLPAPERS = [
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=2560',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=2560',
  'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?auto=format&fit=crop&q=80&w=2560',
  'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=2560',
  'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=2560',
];

export const Settings: React.FC<{ window: WindowState }> = () => {
  const [activeTab, setActiveTab] = useState('display');
  
  const handleWallpaperChange = (url: string) => {
    // This is just a simulation, in a real app we'd use a global state or context
    const desktopBg = document.querySelector('.bg-cover') as HTMLElement;
    if (desktopBg) {
      desktopBg.style.backgroundImage = `url('${url}')`;
    }
  };

  const SidebarItem = ({ id, icon: Icon, label }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={cn(
        "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
        activeTab === id ? "bg-primary/20 text-primary shadow-sm" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
      )}
    >
      <Icon size={18} />
      {label}
    </button>
  );

  return (
    <div className="flex h-full bg-secondary/30 rounded-b-xl overflow-hidden backdrop-blur-md">
      {/* Sidebar */}
      <div className="w-64 border-r border-white/5 bg-white/5 p-4 flex flex-col gap-1">
        <SidebarItem id="display" icon={Monitor} label="Display" />
        <SidebarItem id="personalization" icon={Palette} label="Personalization" />
        <SidebarItem id="account" icon={User} label="Accounts" />
        <SidebarItem id="notifications" icon={Bell} label="Notifications" />
        <SidebarItem id="security" icon={Shield} label="Security" />
        <div className="flex-1" />
        <SidebarItem id="about" icon={Info} label="About OS" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-8">
        {activeTab === 'display' && (
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Monitor className="text-primary" />
              Display Settings
            </h2>

            <div className="space-y-4">
               <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Background Wallpaper</h3>
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                 {WALLPAPERS.map((wp, i) => (
                   <button 
                    key={i}
                    onClick={() => handleWallpaperChange(wp)}
                    className="group relative h-24 rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all hover:scale-105"
                   >
                     <img src={wp} alt={`Wallpaper ${i}`} className="w-full h-full object-cover" />
                     <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <ImageIcon size={24} className="text-white" />
                     </div>
                   </button>
                 ))}
               </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
               <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <span className="block font-semibold">Night Light</span>
                    <span className="block text-xs text-muted-foreground">Reduce blue light to help you sleep better</span>
                 </div>
                 <div className="w-12 h-6 bg-white/10 rounded-full relative p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-primary rounded-full translate-x-6" />
                 </div>
               </div>
               <div className="flex items-center justify-between opacity-50">
                 <div className="space-y-1">
                    <span className="block font-semibold">Scale and Layout</span>
                    <span className="block text-xs text-muted-foreground">Adjust display scaling percentage</span>
                 </div>
                 <span className="text-sm font-bold">125%</span>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="space-y-8 animate-fade-in text-center flex flex-col items-center justify-center h-full max-w-sm mx-auto">
             <div className="w-24 h-24 bg-primary/20 rounded-3xl flex items-center justify-center text-primary mb-4 animate-pulse">
               <SettingsIcon size={48} />
             </div>
             <h2 className="text-3xl font-bold tracking-tight">DeskFlow OS</h2>
             <p className="text-sm text-muted-foreground leading-relaxed">
               DeskFlow OS delivers a cutting-edge desktop operating system simulation entirely in your browser.
             </p>
             <div className="w-full h-[1px] bg-white/10 my-6" />
             <div className="grid grid-cols-2 gap-8 w-full text-left">
                <div className="space-y-1">
                   <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Version</span>
                   <span className="block text-sm font-medium">1.0.0 (Release)</span>
                </div>
                <div className="space-y-1">
                   <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Kernel</span>
                   <span className="block text-sm font-medium">Blink Engine v2</span>
                </div>
             </div>
             <p className="mt-12 text-[10px] opacity-30">
               © 2026 Blink AI. All rights reserved.
             </p>
          </div>
        )}

        {activeTab !== 'display' && activeTab !== 'about' && (
          <div className="flex flex-col items-center justify-center h-full text-center opacity-50">
             <h2 className="text-xl font-bold mb-2">Section Under Construction</h2>
             <p className="text-sm">We're working hard to bring this feature to DeskFlow OS.</p>
          </div>
        )}
      </div>
    </div>
  );
};
