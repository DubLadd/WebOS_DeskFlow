import React, { useState } from 'react';
import { WindowState } from '../types';
import { cn } from '@blinkdotnew/ui';
import { 
  PlayCircle, 
  PauseCircle, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Music, 
  Video, 
  List, 
  Repeat, 
  Shuffle,
  Monitor,
  Heart
} from 'lucide-react';

interface MediaItem {
  id: string;
  title: string;
  artist: string;
  cover: string;
  type: 'audio' | 'video';
  url: string;
}

const PLAYLIST: MediaItem[] = [
  { id: '1', title: 'Synthwave Dreams', artist: 'Cyber Boy', cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=300', type: 'audio', url: '' },
  { id: '2', title: 'Midnight Rain', artist: 'Lo-Fi Girl', cover: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&q=80&w=300', type: 'audio', url: '' },
  { id: '3', title: 'Abstract Flow', artist: 'Visual Artist', cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=300', type: 'video', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
];

export const MediaPlayer: React.FC<{ window: WindowState }> = () => {
  const [currentMedia, setCurrentMedia] = useState<MediaItem>(PLAYLIST[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [activeTab, setActiveTab] = useState('player');

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <div className="flex flex-col h-full bg-[#0c0e14]/95 rounded-b-xl overflow-hidden backdrop-blur-md">
      {/* Header Tabs */}
      <div className="h-12 flex items-center px-6 bg-white/5 border-b border-white/5 gap-6">
        <button 
          onClick={() => setActiveTab('player')}
          className={cn(
            "text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === 'player' ? "text-primary scale-110 drop-shadow-[0_0_8px_rgba(13,162,231,0.5)]" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Now Playing
        </button>
        <button 
          onClick={() => setActiveTab('playlist')}
          className={cn(
            "text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === 'playlist' ? "text-primary scale-110 drop-shadow-[0_0_8px_rgba(13,162,231,0.5)]" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Playlist
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {activeTab === 'player' && (
          <div className="flex-1 flex flex-col p-8 space-y-8 animate-fade-in">
             <div className="flex-1 flex flex-col items-center justify-center gap-8">
               {currentMedia.type === 'video' ? (
                 <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 relative group">
                    <video 
                      src={currentMedia.url} 
                      className="w-full h-full object-cover" 
                      controls={false}
                      autoPlay={isPlaying}
                      loop
                    />
                    {!isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                         <PlayCircle size={64} className="text-white opacity-80" />
                      </div>
                    )}
                 </div>
               ) : (
                 <div className="relative group">
                    <div className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl relative transition-transform duration-500 group-hover:scale-105">
                       <img src={currentMedia.cover} alt={currentMedia.title} className="w-full h-full object-cover" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>
                    {/* Spinning disk effect if playing */}
                    {isPlaying && (
                      <div className="absolute -inset-4 border-2 border-primary/20 rounded-full animate-[spin_10s_linear_infinite]" />
                    )}
                 </div>
               )}

               <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight">{currentMedia.title}</h2>
                  <p className="text-sm font-medium text-primary opacity-80 uppercase tracking-widest">{currentMedia.artist}</p>
               </div>
             </div>

             {/* Controls Area */}
             <div className="space-y-6">
                <div className="space-y-2">
                   <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-1/3 animate-pulse" />
                   </div>
                   <div className="flex items-center justify-between text-[10px] font-bold opacity-40">
                      <span>1:24</span>
                      <span>3:45</span>
                   </div>
                </div>

                <div className="flex items-center justify-center gap-10">
                   <button className="text-muted-foreground hover:text-primary transition-colors"><Shuffle size={20} /></button>
                   <div className="flex items-center gap-6">
                      <button className="text-foreground hover:text-primary transition-all active:scale-90"><SkipBack size={28} fill="currentColor" /></button>
                      <button 
                        onClick={togglePlay}
                        className="w-16 h-16 flex items-center justify-center rounded-full bg-primary text-primary-foreground hover:scale-110 active:scale-90 transition-all shadow-[0_8px_32px_rgba(13,162,231,0.4)]"
                      >
                        {isPlaying ? <PauseCircle size={48} fill="currentColor" /> : <PlayCircle size={48} fill="currentColor" />}
                      </button>
                      <button className="text-foreground hover:text-primary transition-all active:scale-90"><SkipForward size={28} fill="currentColor" /></button>
                   </div>
                   <button className="text-muted-foreground hover:text-primary transition-colors"><Repeat size={20} /></button>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'playlist' && (
          <div className="flex-1 flex flex-col p-6 space-y-4 animate-fade-in overflow-auto">
             {PLAYLIST.map((item) => (
               <button 
                key={item.id}
                onClick={() => { setCurrentMedia(item); setActiveTab('player'); setIsPlaying(true); }}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-2xl transition-all group",
                  currentMedia.id === item.id ? "bg-primary/20 border border-primary/20 shadow-lg" : "hover:bg-white/5"
                )}
               >
                 <div className="w-12 h-12 rounded-xl overflow-hidden relative">
                    <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                    {currentMedia.id === item.id && isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                         <div className="flex items-end gap-0.5 h-4">
                            {[1, 2, 3, 2].map((h, i) => (
                              <div key={i} className="w-1 bg-primary animate-pulse" style={{ height: `${h * 25}%` }} />
                            ))}
                         </div>
                      </div>
                    )}
                 </div>
                 
                 <div className="flex-1 text-left min-w-0">
                    <h4 className={cn("text-sm font-bold truncate", currentMedia.id === item.id ? "text-primary" : "")}>{item.title}</h4>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground opacity-50">{item.artist}</p>
                 </div>

                 <div className="flex items-center gap-4 text-xs font-mono opacity-40">
                    {item.type === 'audio' ? <Music size={14} /> : <Video size={14} />}
                    <span>3:45</span>
                    <Heart size={14} className="group-hover:text-red-500 transition-colors" />
                 </div>
               </button>
             ))}
          </div>
        )}
      </div>

      {/* Bottom Volume / Settings Bar */}
      <div className="h-14 flex items-center px-8 bg-black/40 border-t border-white/5 justify-between">
         <div className="flex items-center gap-3">
            <Volume2 size={16} className="text-primary" />
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-24 h-1 bg-white/10 rounded-full accent-primary cursor-pointer"
            />
         </div>
         
         <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">
            <span className="flex items-center gap-2 hover:text-foreground cursor-pointer transition-colors"><Monitor size={14} /> AirPlay</span>
            <span className="flex items-center gap-2 hover:text-foreground cursor-pointer transition-colors"><List size={14} /> Queue</span>
         </div>
      </div>
    </div>
  );
};
