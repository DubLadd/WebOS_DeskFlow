import React, { useState, useEffect, useRef } from 'react';
import { WindowState } from '../types';
import { cn } from '@blinkdotnew/ui';
import { Code, Play, Layout, FileCode, RefreshCw, Eye, EyeOff, Save } from 'lucide-react';

export const CodeStudio: React.FC<{ window: WindowState }> = () => {
  const [code, setCode] = useState(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      background: #0F1729; 
      color: #F8FAFC; 
      font-family: system-ui, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
    }
    .card {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      text-align: center;
    }
    h1 { color: #0DA2E7; margin-bottom: 0.5rem; }
    p { opacity: 0.7; }
    .btn {
      background: #0DA2E7;
      color: white;
      border: none;
      padding: 0.5rem 1.5rem;
      border-radius: 0.5rem;
      cursor: pointer;
      margin-top: 1rem;
      transition: transform 0.2s;
    }
    .btn:active { transform: scale(0.95); }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello World!</h1>
    <p>Welcome to DeskFlow Code Studio.</p>
    <button class="btn" onclick="alert('Hello from Code Studio!')">Click Me</button>
  </div>
</body>
</html>`);
  
  const [preview, setPreview] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [activeTab, setActiveTab] = useState('html');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPreview(code);
    }, 500);
    return () => clearTimeout(timeout);
  }, [code]);

  useEffect(() => {
    if (iframeRef.current && showPreview) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        doc.write(preview);
        doc.close();
      }
    }
  }, [preview, showPreview]);

  return (
    <div className="flex flex-col h-full bg-secondary/30 rounded-b-xl overflow-hidden backdrop-blur-md">
      {/* Tool Bar */}
      <div className="h-12 flex items-center px-4 bg-white/5 border-b border-white/5 justify-between">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg text-primary text-xs font-semibold">
             <FileCode size={14} />
             index.html
           </div>
           
           <div className="h-4 w-[1px] bg-white/10" />
           
           <div className="flex bg-white/5 p-1 rounded-lg">
             <button 
              onClick={() => setShowPreview(true)}
              className={cn(
                "px-3 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all",
                showPreview ? "bg-white/10 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
             >
               Preview
             </button>
             <button 
              onClick={() => setShowPreview(false)}
              className={cn(
                "px-3 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold transition-all",
                !showPreview ? "bg-white/10 text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
             >
               Code Only
             </button>
           </div>
        </div>

        <div className="flex items-center gap-2">
           <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-white/5 rounded-lg text-xs font-medium transition-all">
             <Save size={14} className="opacity-70" />
             Save
           </button>
           <button 
            onClick={() => setPreview(code)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg text-xs font-bold transition-all"
           >
             <Play size={14} fill="currentColor" />
             Run
           </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor Pane */}
        <div className={cn(
          "flex flex-col border-r border-white/5 transition-all duration-300",
          showPreview ? "w-1/2" : "w-full"
        )}>
           <div className="h-8 flex items-center px-4 bg-black/20 text-[10px] text-muted-foreground font-mono">
             LINE 1: COL 1
           </div>
           <textarea
             value={code}
             onChange={(e) => setCode(e.target.value)}
             spellCheck={false}
             className="flex-1 p-6 bg-[#0c0e14]/50 text-foreground/80 font-mono text-sm resize-none outline-none leading-relaxed selection:bg-primary/30 scrollbar-hide"
             style={{ caretColor: 'var(--primary)' }}
           />
        </div>

        {/* Preview Pane */}
        {showPreview && (
          <div className="flex-1 flex flex-col bg-white">
            <div className="h-8 flex items-center px-4 bg-gray-100 border-b border-gray-200 text-[10px] text-gray-500 font-mono flex-row-reverse">
              <RefreshCw size={10} className="mr-2 cursor-pointer hover:rotate-180 transition-transform duration-500" />
              LIVE PREVIEW (127.0.0.1:8080)
            </div>
            <iframe
              ref={iframeRef}
              title="Code Preview"
              className="flex-1 w-full border-none"
              sandbox="allow-scripts allow-modals"
            />
          </div>
        )}
      </div>

      {/* Footer / Info */}
      <div className="h-6 flex items-center px-4 bg-white/5 text-[10px] font-medium opacity-50 justify-between">
         <div className="flex items-center gap-4">
           <span className="flex items-center gap-1"><Code size={10} /> HTML5</span>
           <span className="flex items-center gap-1"><Layout size={10} /> CSS Grid</span>
         </div>
         <span className="flex items-center gap-1"><Eye size={10} /> Live Server: Enabled</span>
      </div>
    </div>
  );
};
