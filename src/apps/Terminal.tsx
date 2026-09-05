import React, { useEffect, useRef, useState } from 'react';
import { WindowState } from '../os/types';
import { cn } from '@blinkdotnew/ui';
import { ChevronRight } from 'lucide-react';
import { INITIAL_FILES, normalizePath, parentPath, VirtualFile } from '../os/cli';

type TerminalLine = { text: string; tone?: 'command' | 'error' | 'muted' };

export const Terminal: React.FC<{ window: WindowState }> = () => {
  const [files, setFiles] = useState<Record<string, VirtualFile>>(INITIAL_FILES);
  const [cwd, setCwd] = useState('/home/user');
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'DeskFlow OS [Version 1.0.0]', tone: 'muted' },
    { text: 'Built-in shell · safe virtual workspace · type "help" for commands.', tone: 'muted' },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [history]);

  const run = (raw: string) => {
    const command = raw.trim();
    const [name, ...args] = command.split(/\s+/);
    const output: TerminalLine[] = [{ text: `${cwd} $ ${command}`, tone: 'command' }];
    const target = args[0] ? normalizePath(args[0], cwd) : cwd;

    if (!command) return;
    if (name === 'clear') { setHistory([]); return; }
    if (name === 'help') output.push({ text: 'cd · ls · pwd · mkdir · touch · cat · rm · echo · npm · node · curl · wget · nvim · git · gh · python3 · gemini' });
    else if (name === 'pwd') output.push({ text: cwd });
    else if (name === 'ls') output.push({ text: Object.keys(files).filter((path) => path !== '/' && parentPath(path) === cwd).map((path) => path.split('/').pop()).join('  ') || '(empty)' });
    else if (name === 'cd') {
      const destination = normalizePath(args[0] || '/home/user', cwd);
      if (files[destination]?.type === 'directory') setCwd(destination);
      else output.push({ text: `cd: no such directory: ${args[0] || ''}`, tone: 'error' });
    } else if (name === 'mkdir') {
      if (!args[0]) output.push({ text: 'mkdir: missing operand', tone: 'error' });
      else if (files[target]) output.push({ text: `mkdir: ${args[0]} already exists`, tone: 'error' });
      else setFiles((current) => ({ ...current, [target]: { type: 'directory' } }));
    } else if (name === 'touch') {
      if (!args[0]) output.push({ text: 'touch: missing file operand', tone: 'error' });
      else setFiles((current) => ({ ...current, [target]: { type: 'file', content: '' } }));
    } else if (name === 'cat') {
      const file = files[target];
      if (file?.type === 'file') output.push({ text: file.content || '' });
      else output.push({ text: `cat: ${args[0] || ''}: no such file`, tone: 'error' });
    } else if (name === 'echo') output.push({ text: args.join(' ') });
    else if (['npm', 'node', 'curl', 'wget', 'nvim', 'git', 'gh', 'python3', 'gemini'].includes(name)) output.push({ text: `${name}: virtual command acknowledged${args.length ? ` · ${args.join(' ')}` : ''}`, tone: 'muted' });
    else output.push({ text: `${name}: command not found · type "help"`, tone: 'error' });
    setHistory((current) => [...current, ...output]);
  };

  return <div className="flex h-full flex-col overflow-hidden rounded-b-xl bg-[#0c0e14]/95 p-4 font-mono">
    <div ref={scrollRef} className="flex-1 overflow-auto text-sm leading-relaxed">
      {history.map((line, index) => <div key={`${index}-${line.text}`} className={cn('mb-1 whitespace-pre-wrap', line.tone === 'command' && 'font-bold text-primary', line.tone === 'error' && 'text-red-300', line.tone === 'muted' && 'text-muted-foreground')}>{line.text}</div>)}
    </div>
    <div className="flex items-center gap-2 pt-3"><span className="flex items-center gap-1 text-primary"><span>webos@deskflow</span><ChevronRight size={14} /></span><input autoFocus value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { run(input); setInput(''); } }} spellCheck={false} className="flex-1 bg-transparent outline-none" /></div>
  </div>;
};
