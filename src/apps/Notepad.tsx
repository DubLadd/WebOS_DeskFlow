import React, { useState, useEffect } from 'react';
import { WindowState } from '../types';
import { cn } from '@blinkdotnew/ui';
import { FileText, Save, Trash2, FolderOpen } from 'lucide-react';

export const Notepad: React.FC<{ window: WindowState }> = ({ window }) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load from localStorage?
    const saved = localStorage.getItem(`notepad_${window.id}`);
    if (saved) setContent(saved);
  }, [window.id]);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem(`notepad_${window.id}`, content);
    setTimeout(() => setIsSaving(false), 800);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear your note?')) {
      setContent('');
      localStorage.removeItem(`notepad_${window.id}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-secondary/30 rounded-b-xl overflow-hidden backdrop-blur-md">
      {/* Tool Bar */}
      <div className="h-10 flex items-center px-4 bg-white/5 border-b border-white/5 gap-4">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 text-xs font-medium hover:text-primary transition-colors disabled:opacity-50"
        >
          <Save size={14} className={cn(isSaving ? "animate-spin" : "")} />
          {isSaving ? "Saving..." : "Save"}
        </button>
        <button className="flex items-center gap-1.5 text-xs font-medium hover:text-primary transition-colors">
          <FolderOpen size={14} />
          Open
        </button>
        <div className="w-[1px] h-4 bg-white/10" />
        <button 
          onClick={handleClear}
          className="flex items-center gap-1.5 text-xs font-medium hover:text-destructive transition-colors ml-auto"
        >
          <Trash2 size={14} />
          Clear
        </button>
      </div>

      {/* Editor */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing your notes here..."
        spellCheck={false}
        className="flex-1 p-6 bg-transparent text-foreground/90 text-sm font-sans resize-none outline-none leading-relaxed placeholder:opacity-30"
        style={{ caretColor: 'var(--primary)' }}
      />
      
      {/* Status Bar */}
      <div className="h-6 flex items-center px-4 bg-white/5 text-[10px] font-medium opacity-50 justify-between">
        <div className="flex items-center gap-3">
          <span>Characters: {content.length}</span>
          <span>Words: {content.split(/\s+/).filter(Boolean).length}</span>
        </div>
        <span>UTF-8</span>
      </div>
    </div>
  );
};
