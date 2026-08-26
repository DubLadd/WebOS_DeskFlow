import React, { useState } from 'react';
import { WindowState } from '../types';
import { cn } from '@blinkdotnew/ui';
import { Lock, Plus, Key, Eye, EyeOff, ShieldCheck, Search, Trash2, Copy, AlertTriangle } from 'lucide-react';

interface PasswordEntry {
  id: string;
  site: string;
  username: string;
  password: string;
  strength: 'weak' | 'medium' | 'strong';
}

const INITIAL_PASSWORDS: PasswordEntry[] = [
  { id: '1', site: 'github.com', username: 'blink_dev', password: '••••••••', strength: 'strong' },
  { id: '2', site: 'google.com', username: 'blink.ai', password: '••••••••', strength: 'medium' },
  { id: '3', site: 'vercel.com', username: 'admin@blink.new', password: '••••••••', strength: 'strong' },
  { id: '4', site: 'netflix.com', username: 'user_test', password: '••••••••', strength: 'weak' },
];

export const DevVault: React.FC<{ window: WindowState }> = () => {
  const [passwords, setPasswords] = useState<PasswordEntry[]>(INITIAL_PASSWORDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassId, setShowPassId] = useState<string | null>(null);

  const filtered = passwords.filter(p => 
    p.site.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0e14]/90 rounded-b-xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="h-20 flex items-center px-8 bg-white/5 border-b border-white/5 justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary/20 text-primary shadow-[0_0_20px_rgba(13,162,231,0.2)]">
             <ShieldCheck size={28} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">DevVault</h2>
            <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-muted-foreground opacity-50">Secure Password Manager</p>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-bold hover:scale-105 active:scale-95 transition-all shadow-[0_4px_12px_rgba(13,162,231,0.3)]">
          <Plus size={16} />
          New Entry
        </button>
      </div>

      {/* Control Bar */}
      <div className="h-14 flex items-center px-8 bg-white/5 border-b border-white/5 gap-6">
        <div className="relative group flex-1 max-w-sm">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
           <input 
            type="text" 
            placeholder="Search Vault..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-10 pr-4 bg-white/5 border border-white/10 hover:border-white/20 focus:border-primary/50 rounded-lg text-xs outline-none transition-all"
           />
        </div>

        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <div className="flex items-center gap-1.5 text-primary">
            <div className="w-2 h-2 bg-primary rounded-full" />
            {passwords.length} Active
          </div>
          <div className="flex items-center gap-1.5 text-red-500">
            <AlertTriangle size={12} />
            1 Vulnerable
          </div>
        </div>
      </div>

      {/* Password List */}
      <div className="flex-1 overflow-auto p-8 space-y-3 scrollbar-hide">
        {filtered.map((p) => (
          <div 
            key={p.id}
            className="group flex items-center gap-6 p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all hover:translate-x-1"
          >
             <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 group-hover:bg-primary/20 text-muted-foreground group-hover:text-primary transition-all">
                <Key size={20} />
             </div>

             <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{p.site}</h4>
                <p className="text-xs opacity-50 truncate">{p.username}</p>
             </div>

             <div className="flex items-center gap-4">
                <div className={cn(
                  "px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest",
                  p.strength === 'strong' ? "bg-green-500/20 text-green-400" : 
                  p.strength === 'medium' ? "bg-yellow-500/20 text-yellow-400" : 
                  "bg-red-500/20 text-red-400"
                )}>
                  {p.strength}
                </div>

                <div className="flex items-center gap-1">
                   <button 
                    onClick={() => setShowPassId(showPassId === p.id ? null : p.id)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                   >
                     {showPassId === p.id ? <EyeOff size={16} /> : <Eye size={16} />}
                   </button>
                   <button 
                    onClick={() => copyToClipboard('mypassword123')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                   >
                     <Copy size={16} />
                   </button>
                   <button className="p-2 hover:bg-destructive/20 rounded-lg transition-colors text-muted-foreground hover:text-destructive">
                     <Trash2 size={16} />
                   </button>
                </div>
             </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-30 mt-12 text-center">
             <Lock size={64} className="mb-4" />
             <p className="text-sm font-medium">No results found in DevVault</p>
             <p className="text-xs mt-1">Try a different search term or add a new entry.</p>
          </div>
        )}
      </div>

      {/* Info Bar */}
      <div className="h-10 flex items-center px-8 bg-black/40 text-[10px] font-medium opacity-50 gap-4">
         <span className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-green-500" /> AES-256 Encryption</span>
         <span className="flex items-center gap-1.5"><Key size={12} className="text-primary" /> Auto-Lock: 5m</span>
      </div>
    </div>
  );
};
