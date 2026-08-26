import React, { useState, useRef, useEffect } from 'react';
import { WindowState } from '../types';
import { cn } from '@blinkdotnew/ui';
import { Terminal as TerminalIcon, ChevronRight } from 'lucide-react';

export const Terminal: React.FC<{ window: WindowState }> = () => {
  const [history, setHistory] = useState<string[]>(['DeskFlow OS [Version 1.0.0]', '(c) 2026 Blink Corp. All rights reserved.', 'Type "help" for a list of commands.']);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (cmd: string) => {
    const newHistory = [...history, `> ${cmd}`];
    const command = cmd.toLowerCase().trim();

    if (command === 'help') {
      newHistory.push('Available commands:', '  help - Show this help message', '  clear - Clear the terminal history', '  ls - List files in the current directory', '  whoami - Show current user information', '  date - Show current date and time', '  about - About DeskFlow OS');
    } else if (command === 'clear') {
      setHistory([]);
      return;
    } else if (command === 'ls') {
      newHistory.push('Documents  Downloads  Music  Pictures  Videos');
    } else if (command === 'whoami') {
      newHistory.push('user: blink-user', 'role: administrator', 'host: webos-deskflow');
    } else if (command === 'date') {
      newHistory.push(new Date().toString());
    } else if (command === 'about') {
      newHistory.push('WebOS DeskFlow - A modern browser-based OS simulation.', 'Built with React, Tailwind, and Blink SDK.', 'Design: Glassmorphism / Dark Mode.');
    } else if (command === '') {
      // Do nothing
    } else {
      newHistory.push(`Command not found: ${command}. Type "help" for assistance.`);
    }

    setHistory(newHistory);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0c0e14]/90 rounded-b-xl overflow-hidden font-mono p-4 backdrop-blur-md">
      <div ref={scrollRef} className="flex-1 overflow-auto text-sm leading-relaxed mb-2 scrollbar-hide">
        {history.map((line, i) => (
          <div key={i} className={cn(
            "mb-1",
            line.startsWith('>') ? "text-primary font-bold" : "text-foreground/80"
          )}>
            {line}
          </div>
        ))}
      </div>
      
      <div className="flex items-center gap-2 group">
        <span className="text-primary font-bold flex items-center gap-1">
          webos@deskflow <ChevronRight size={14} />
        </span>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          className="flex-1 bg-transparent border-none outline-none text-sm text-foreground/90 caret-primary"
        />
      </div>
    </div>
  );
};
