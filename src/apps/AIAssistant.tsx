import React, { useState, useRef, useEffect } from 'react';
import { WindowState } from '../types';
import { cn } from '@blinkdotnew/ui';
import { Send, Bot, User, Loader2, Sparkles, Globe } from 'lucide-react';
import { blink } from '../blink/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistant: React.FC<{ window: WindowState }> = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your DeskFlow AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        content: m.content
      }));
      chatHistory.push({ role: 'user', content: input });

      const SYSTEM_PROMPT = `You are the core AI Assistant for DeskFlow OS, a cutting-edge browser-based operating system. 
      Your personality is professional, intelligent, and helpful. 
      You help users manage their virtual desktop, answer questions about computing, and assist with general tasks. 
      Be concise but informative. Use markdown for formatting when appropriate.`;

      await blink.ai.streamText(
        {
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...chatHistory
          ],
          search: true, // Enable web search for real-time info
        },
        (chunk) => {
          setStreamingContent(prev => prev + chunk);
        }
      );

      // After streaming is done, add to messages
      setStreamingContent(prev => {
        if (prev) {
          setMessages(msgs => [...msgs, { role: 'assistant', content: prev }]);
        }
        return '';
      });
    } catch (error: any) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error. Please make sure you are logged in to use the AI features." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-secondary/30 rounded-b-xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="h-12 flex items-center px-6 bg-white/5 border-b border-white/5 justify-between">
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-primary" />
          <span className="text-sm font-semibold">DeskFlow AI</span>
        </div>
        <div className="flex items-center gap-2 opacity-50 text-[10px] uppercase tracking-widest font-bold">
          <Sparkles size={12} />
          Blink Powered
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-auto p-6 space-y-6 scrollbar-hide">
        {messages.map((msg, i) => (
          <div key={i} className={cn(
            "flex gap-4 max-w-[85%]",
            msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
          )}>
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
              msg.role === 'assistant' ? "bg-primary/20 text-primary" : "bg-white/10 text-white/70"
            )}>
              {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed",
              msg.role === 'assistant' ? "bg-white/5 text-foreground/90 rounded-tl-none" : "bg-primary text-primary-foreground rounded-tr-none"
            )}>
              {msg.content}
            </div>
          </div>
        ))}

        {streamingContent && (
          <div className="flex gap-4 max-w-[85%]">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/20 text-primary">
              <Bot size={18} />
            </div>
            <div className="p-4 rounded-2xl text-sm leading-relaxed bg-white/5 text-foreground/90 rounded-tl-none">
              {streamingContent}
              <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
            </div>
          </div>
        )}

        {isLoading && !streamingContent && (
          <div className="flex gap-4 max-w-[85%]">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/20 text-primary animate-pulse">
              <Bot size={18} />
            </div>
            <div className="p-4 rounded-2xl bg-white/5 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-primary" />
              <span className="text-xs opacity-50 italic">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white/5 border-t border-white/5">
        <div className="relative group">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask me anything..."
            className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/10 focus:border-primary/50 rounded-2xl p-4 pr-14 text-sm resize-none outline-none transition-all scrollbar-hide min-h-[56px] max-h-32"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 bottom-3 w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-[0_4px_12px_rgba(13,162,231,0.3)]"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-4 px-1">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Globe size={10} />
            Web Search Enabled
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Sparkles size={10} />
            GPT-4o
          </div>
        </div>
      </div>
    </div>
  );
};
