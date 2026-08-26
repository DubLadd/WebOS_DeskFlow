import React, { useState } from 'react';
import { WindowState } from '../types';
import { cn } from '@blinkdotnew/ui';
import { 
  FolderOpen, 
  ChevronLeft, 
  ChevronRight, 
  ChevronUp, 
  Search, 
  Grid, 
  List, 
  File, 
  Image as ImageIcon, 
  Music, 
  Video, 
  FileText,
  Star,
  Clock,
  HardDrive
} from 'lucide-react';

interface FileItem {
  id: string;
  name: string;
  type: 'folder' | 'file' | 'image' | 'audio' | 'video';
  size?: string;
}

const INITIAL_FILES: Record<string, FileItem[]> = {
  'Documents': [
    { id: '1', name: 'Project_DeskFlow.pdf', type: 'file', size: '2.4 MB' },
    { id: '2', name: 'Notes_Meeting.txt', type: 'file', size: '12 KB' },
    { id: '3', name: 'Resume_2026.docx', type: 'file', size: '45 KB' },
  ],
  'Pictures': [
    { id: '4', name: 'Summer_Vibe.jpg', type: 'image', size: '1.2 MB' },
    { id: '5', name: 'Logo_Draft.png', type: 'image', size: '850 KB' },
    { id: '6', name: 'Screenshot_01.webp', type: 'image', size: '320 KB' },
  ],
  'Music': [
    { id: '7', name: 'Synthwave_Dreams.mp3', type: 'audio', size: '8.4 MB' },
    { id: '8', name: 'Dark_Oscillator.wav', type: 'audio', size: '42 MB' },
  ],
  'Videos': [
    { id: '9', name: 'Promo_Video.mp4', type: 'video', size: '120 MB' },
  ],
  'Home': [
    { id: '101', name: 'Documents', type: 'folder' },
    { id: '102', name: 'Pictures', type: 'folder' },
    { id: '103', name: 'Music', type: 'folder' },
    { id: '104', name: 'Videos', type: 'folder' },
    { id: '105', name: 'Downloads', type: 'folder' },
  ]
};

export const Explorer: React.FC<{ window: WindowState }> = () => {
  const [currentPath, setCurrentPath] = useState(['Home']);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentFolder = currentPath[currentPath.length - 1];
  const files = INITIAL_FILES[currentFolder] || [];

  const navigateTo = (folderName: string) => {
    setCurrentPath([...currentPath, folderName]);
  };

  const goBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'folder': return <FolderOpen className="text-primary" />;
      case 'image': return <ImageIcon className="text-accent" />;
      case 'audio': return <Music className="text-green-400" />;
      case 'video': return <Video className="text-red-400" />;
      default: return <FileText className="text-gray-400" />;
    }
  };

  return (
    <div className="flex h-full bg-secondary/30 rounded-b-xl overflow-hidden backdrop-blur-md">
      {/* Sidebar */}
      <div className="w-56 border-r border-white/5 bg-white/5 p-4 flex flex-col gap-6">
        <div className="space-y-1">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 mb-2">Favorites</h3>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors text-primary font-medium">
             <Star size={16} /> Favorites
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors">
             <Clock size={16} /> Recent
          </button>
        </div>

        <div className="space-y-1">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 mb-2">PC Locations</h3>
          {['Documents', 'Pictures', 'Music', 'Videos'].map(name => (
            <button 
              key={name}
              onClick={() => setCurrentPath(['Home', name])}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                currentFolder === name ? "bg-primary/20 text-primary font-medium" : "hover:bg-white/5"
              )}
            >
               {getIcon(INITIAL_FILES['Home'].find(f => f.name === name)?.type || 'folder')}
               {name}
            </button>
          ))}
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors opacity-50">
             <HardDrive size={16} /> Local Disk (C:)
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navigation Bar */}
        <div className="h-12 flex items-center px-4 bg-white/5 border-b border-white/5 gap-4">
          <div className="flex items-center gap-1">
            <button 
              onClick={goBack}
              disabled={currentPath.length <= 1}
              className="p-1.5 hover:bg-white/10 rounded-lg disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button className="p-1.5 hover:bg-white/10 rounded-lg opacity-30 transition-colors">
              <ChevronRight size={18} />
            </button>
            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <ChevronUp size={18} />
            </button>
          </div>

          <div className="flex-1 flex items-center px-3 h-8 bg-white/5 rounded-lg border border-white/5 text-xs font-medium text-foreground/70 truncate">
             {currentPath.join(' / ')}
          </div>

          <div className="relative group w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search Current" 
              className="w-full h-8 pl-8 pr-3 bg-white/5 hover:bg-white/10 focus:bg-white/10 focus:ring-1 focus:ring-primary/30 rounded-lg text-xs outline-none transition-all"
            />
          </div>

          <div className="flex bg-white/5 p-1 rounded-lg">
             <button 
              onClick={() => setViewMode('grid')}
              className={cn("p-1 rounded transition-colors", viewMode === 'grid' ? "bg-white/10 text-primary" : "text-muted-foreground")}
             >
               <Grid size={14} />
             </button>
             <button 
              onClick={() => setViewMode('list')}
              className={cn("p-1 rounded transition-colors", viewMode === 'list' ? "bg-white/10 text-primary" : "text-muted-foreground")}
             >
               <List size={14} />
             </button>
          </div>
        </div>

        {/* File Grid/List */}
        <div className="flex-1 overflow-auto p-6">
           <div className={cn(
             viewMode === 'grid' 
              ? "grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-6" 
              : "flex flex-col gap-1"
           )}>
             {files.map((file) => (
               <div
                 key={file.id}
                 onDoubleClick={() => file.type === 'folder' ? navigateTo(file.name) : null}
                 className={cn(
                   "group cursor-default transition-all duration-200 rounded-xl",
                   viewMode === 'grid' 
                    ? "flex flex-col items-center p-4 hover:bg-primary/10 hover:shadow-lg border border-transparent hover:border-primary/20" 
                    : "flex items-center gap-4 px-4 py-2 hover:bg-white/5"
                 )}
               >
                 <div className={cn(
                   "transition-transform group-hover:scale-110",
                   viewMode === 'grid' ? "w-16 h-16 flex items-center justify-center mb-3" : "w-8 h-8 flex items-center justify-center"
                 )}>
                   {React.cloneElement(getIcon(file.type) as React.ReactElement, { size: viewMode === 'grid' ? 48 : 20 })}
                 </div>
                 
                 <div className={cn(
                   "min-w-0",
                   viewMode === 'grid' ? "text-center" : "flex-1 flex items-center justify-between"
                 )}>
                   <span className="block text-xs font-medium truncate w-full group-hover:text-primary transition-colors">
                     {file.name}
                   </span>
                   {viewMode === 'list' && file.size && (
                     <span className="text-[10px] opacity-40">{file.size}</span>
                   )}
                 </div>
               </div>
             ))}

             {files.length === 0 && (
               <div className="col-span-full h-full flex flex-col items-center justify-center opacity-30 mt-12">
                  <FolderOpen size={64} className="mb-4" />
                  <p className="text-sm font-medium">This folder is empty</p>
               </div>
             )}
           </div>
        </div>

        {/* Status Bar */}
        <div className="h-6 flex items-center px-4 bg-white/5 border-t border-white/5 text-[10px] font-medium opacity-50">
          {files.length} items
        </div>
      </div>
    </div>
  );
};
