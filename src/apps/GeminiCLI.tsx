import React, { useState } from 'react';
import { WindowState } from '../os/types';
import { blink } from '../blink/client';
import { Bot, Send, TerminalSquare, Loader2 } from 'lucide-react';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export const GeminiCLI: React.FC<{ window: WindowState }> = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Gemini CLI ready. Ask me to explain code, draft a command, or inspect a file.' },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);

  const runPrompt = async () => {
    const prompt = input.trim();
    if (!prompt || busy) return;
    setInput('');
    setMessages((current) => [...current, { role: 'user', content: prompt }]);
    setBusy(true);
    try {
      const result = await blink.ai.generateText({
        messages: [
          {
            role: 'system',
            content: 'You are Gemini CLI inside DeskFlow OS. Be concise, practical, and format shell commands in code blocks. Never claim to have executed a command; explain what the user should run.',
          },
          ...messages,
          { role: 'user', content: prompt },
        ],
      });
      setMessages((current) => [...current, { role: 'assistant', content: result.text }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'The AI request failed.';
      setMessages((current) => [...current, { role: 'assistant', content: `Gemini CLI error: ${message}` }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-[#0c0e14]/95 font-mono text-sm">
      <div className="flex items-center gap-3 border-b border-white/10 bg-white/5 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary"><Bot size={17} /></div>
        <div><div className="font-semibold text-foreground">Gemini CLI</div><div className="text-[10px] text-muted-foreground">deskflow://ai · Blink powered</div></div>
        <TerminalSquare className="ml-auto text-muted-foreground" size={17} />
      </div>
      <div className="flex-1 space-y-4 overflow-auto p-4">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className="space-y-1">
            <div className={message.role === 'user' ? 'text-primary' : 'text-accent'}>{message.role === 'user' ? '$ you' : 'gemini'}:</div>
            <div className="whitespace-pre-wrap pl-3 leading-relaxed text-foreground/85">{message.content}</div>
          </div>
        ))}
        {busy && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 size={14} className="animate-spin" /> thinking…</div>}
      </div>
      <div className="border-t border-white/10 p-3">
        <div className="flex items-end gap-2 rounded-lg border border-white/10 bg-white/5 p-2 focus-within:border-primary/50">
          <span className="pb-2 text-primary">$</span>
          <textarea value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void runPrompt(); } }} placeholder="Ask Gemini…" rows={2} className="min-h-10 flex-1 resize-none bg-transparent px-1 py-1 outline-none" />
          <button onClick={() => void runPrompt()} disabled={busy || !input.trim()} className="rounded-md bg-primary p-2 text-primary-foreground transition hover:scale-105 disabled:opacity-40"><Send size={15} /></button>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">Enter to send · Shift+Enter for a new line</p>
      </div>
    </div>
  );
};
