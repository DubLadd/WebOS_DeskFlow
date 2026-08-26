import React, { useState, useRef } from 'react';
import { WindowState } from '../types';
import { cn } from '@blinkdotnew/ui';
import { 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Search, 
  Star, 
  Shield, 
  Lock, 
  MoreVertical,
  ArrowUpRight
} from 'lucide-react';

export const WebBrowser: React.FC<{ window: WindowState }> = () => {
  const [url, setUrl] = useState('https://www.wikipedia.org');
  const [inputUrl, setInputUrl] = useState('https://www.wikipedia.org');
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleNavigate = (e?: React.FormEvent) => {
    e?.preventDefault();
    let targetUrl = inputUrl;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = `https://${targetUrl}`;
    }
    setUrl(targetUrl);
    setInputUrl(targetUrl);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleRefresh = () => {
    const currentUrl = url;
    setUrl('');
    setTimeout(() => {
      setUrl(currentUrl);
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 1000);
    }, 10);
  };

  const openInNewTab = () => {
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-b-xl overflow-hidden backdrop-blur-md">
      {/* Browser Controls */}
      <div className="h-14 flex items-center px-4 bg-[#f1f3f4] border-b border-gray-300 gap-3">
        <div className="flex items-center gap-1 text-gray-600">
           <button className="p-2 hover:bg-gray-200 rounded-full transition-colors opacity-30 cursor-not-allowed">
             <ChevronLeft size={18} />
           </button>
           <button className="p-2 hover:bg-gray-200 rounded-full transition-colors opacity-30 cursor-not-allowed">
             <ChevronRight size={18} />
           </button>
           <button 
            onClick={handleRefresh}
            className={cn("p-2 hover:bg-gray-200 rounded-full transition-colors", isLoading ? "animate-spin text-primary" : "")}
           >
             <RotateCcw size={18} />
           </button>
        </div>

        {/* URL Bar */}
        <form onSubmit={handleNavigate} className="flex-1 flex items-center h-9 px-4 bg-white border border-gray-300 rounded-full shadow-sm group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
           <Lock size={12} className="text-green-600 mr-2" />
           <input 
            type="text" 
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="flex-1 text-sm bg-transparent outline-none text-gray-800 font-medium"
            placeholder="Search or enter URL"
           />
           <div className="flex items-center gap-2 text-gray-400">
              <Star size={14} className="hover:text-yellow-400 cursor-pointer transition-colors" />
           </div>
        </form>

        <div className="flex items-center gap-1 text-gray-600">
           <button 
            onClick={openInNewTab}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-primary flex items-center gap-1.5"
           >
             <ArrowUpRight size={16} />
             <span className="text-[10px] font-bold uppercase hidden sm:inline">Open Live</span>
           </button>
           <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
             <MoreVertical size={18} />
           </button>
        </div>
      </div>

      {/* Bookmarks Bar */}
      <div className="h-9 flex items-center px-4 bg-[#f1f3f4] border-b border-gray-300 gap-4 overflow-x-auto scrollbar-hide">
         {[
           { name: 'Google', url: 'https://www.google.com/search?q=blink' },
           { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
           { name: 'GitHub', url: 'https://github.com' },
           { name: 'Dribbble', url: 'https://dribbble.com' },
         ].map((site) => (
           <button 
            key={site.name}
            onClick={() => { setInputUrl(site.url); setUrl(site.url); }}
            className="flex items-center gap-2 px-2 py-1 hover:bg-gray-200 rounded text-[10px] font-bold text-gray-600 transition-colors flex-shrink-0"
           >
             <Globe size={12} className="text-primary" />
             {site.name}
           </button>
         ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 animate-fade-in">
             <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary/10 text-primary animate-bounce">
                <Globe size={32} />
             </div>
             <div className="flex flex-col items-center gap-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Loading Secure Page</span>
                <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-primary animate-[loading_1.5s_ease-in-out_infinite]" />
                </div>
             </div>
          </div>
        )}
        
        {url ? (
          <iframe
            ref={iframeRef}
            src={url}
            title="Browser Content"
            className="w-full h-full border-none bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-4">
             <Search size={48} className="opacity-20" />
             <p className="text-sm font-medium">Ready for your next search</p>
          </div>
        )}

        {/* Security Warning Overlay (simulated for CORS) */}
        <div className="absolute bottom-4 left-4 right-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-4 shadow-xl animate-fade-in">
           <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 flex-shrink-0">
              <Shield size={24} />
           </div>
           <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-yellow-800">CORS Restrictions Active</h4>
              <p className="text-[10px] text-yellow-700 leading-tight">Some websites prevent embedding in iFrames. If a page doesn't load, use the "Open Live" button to view it directly.</p>
           </div>
           <button 
            onClick={openInNewTab}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg text-[10px] font-bold hover:bg-yellow-700 transition-colors flex-shrink-0"
           >
             VIEW DIRECTLY
           </button>
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="h-6 flex items-center px-4 bg-[#f1f3f4] border-t border-gray-300 text-[9px] font-bold text-gray-500 uppercase tracking-widest justify-between">
         <span className="flex items-center gap-1.5"><Shield size={10} className="text-green-600" /> Connection is Secure</span>
         <span>DeskFlow Browser Engine v1.0</span>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
