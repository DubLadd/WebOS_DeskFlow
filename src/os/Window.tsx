import React, { useState, useRef, useEffect, ReactNode, useCallback } from 'react';
import { WindowState } from './types';
import { useWindows } from './store';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { cn } from '@blinkdotnew/ui';

interface WindowProps {
  window: WindowState;
  children: ReactNode;
}

export const Window: React.FC<WindowProps> = ({ window, children }) => {
  const { closeWindow, focusWindow, updateWindow, toggleMinimize, toggleMaximize } = useWindows();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const windowStartPos = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (window.isMaximized) return;
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    windowStartPos.current = { x: window.x, y: window.y };
    focusWindow(window.id);
  }, [window.isMaximized, window.x, window.y, window.id, focusWindow]);

  const handleResizeStart = useCallback((e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    if (window.isMaximized) return;
    setIsResizing(direction);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    windowStartPos.current = { x: window.x, y: window.y, width: window.width, height: window.height };
    focusWindow(window.id);
  }, [window.isMaximized, window.x, window.y, window.width, window.height, window.id, focusWindow]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStartPos.current.x;
        const dy = e.clientY - dragStartPos.current.y;
        updateWindow(window.id, {
          x: windowStartPos.current.x + dx,
          y: windowStartPos.current.y + dy,
        });
      } else if (isResizing) {
        const dx = e.clientX - dragStartPos.current.x;
        const dy = e.clientY - dragStartPos.current.y;
        const updates: Partial<WindowState> = {};

        if (isResizing.includes('e')) updates.width = Math.max(200, windowStartPos.current.width + dx);
        if (isResizing.includes('w')) {
          const newWidth = Math.max(200, windowStartPos.current.width - dx);
          if (newWidth > 200) {
            updates.width = newWidth;
            updates.x = windowStartPos.current.x + dx;
          }
        }
        if (isResizing.includes('s')) updates.height = Math.max(150, windowStartPos.current.height + dy);
        if (isResizing.includes('n')) {
          const newHeight = Math.max(150, windowStartPos.current.height - dy);
          if (newHeight > 150) {
            updates.height = newHeight;
            updates.y = windowStartPos.current.y + dy;
          }
        }

        updateWindow(window.id, updates);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(null);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, window.id, updateWindow]);

  if (window.isMinimized) return null;

  const style: React.CSSProperties = window.isMaximized 
    ? { top: 0, left: 0, right: 0, bottom: '64px', zIndex: window.zIndex }
    : { 
        top: window.y, 
        left: window.x, 
        width: window.width, 
        height: window.height, 
        zIndex: window.zIndex 
      };

  return (
    <div
      ref={windowRef}
      className={cn(
        "absolute flex flex-col glass window-shadow rounded-xl overflow-hidden animate-window-open",
        window.isMaximized ? "rounded-none" : "",
        isDragging ? "transition-none opacity-80" : "transition-all duration-200",
        isResizing ? "transition-none" : ""
      )}
      style={style}
      onMouseDown={() => focusWindow(window.id)}
    >
      {/* Title Bar */}
      <div
        className="h-10 flex items-center justify-between px-4 bg-secondary/80 cursor-default select-none border-b border-white/5"
        onMouseDown={handleMouseDown}
        onDoubleClick={() => toggleMaximize(window.id)}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium opacity-90">{window.title}</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <button 
            onClick={(e) => { e.stopPropagation(); toggleMinimize(window.id); }}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <Minus size={14} className="opacity-70" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); toggleMaximize(window.id); }}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            {window.isMaximized ? <Square size={12} className="opacity-70" /> : <Maximize2 size={12} className="opacity-70" />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); closeWindow(window.id); }}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-destructive/80 transition-colors group"
          >
            <X size={14} className="opacity-70 group-hover:opacity-100" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-background/40">
        {children}
      </div>

      {/* Resize Handles */}
      {!window.isMaximized && (
        <>
          <div className="absolute top-0 left-0 w-1 h-full cursor-w-resize" onMouseDown={(e) => handleResizeStart(e, 'w')} />
          <div className="absolute top-0 right-0 w-1 h-full cursor-e-resize" onMouseDown={(e) => handleResizeStart(e, 'e')} />
          <div className="absolute top-0 left-0 w-full h-1 cursor-n-resize" onMouseDown={(e) => handleResizeStart(e, 'n')} />
          <div className="absolute bottom-0 left-0 w-full h-1 cursor-s-resize" onMouseDown={(e) => handleResizeStart(e, 's')} />
          <div className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
          <div className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
          <div className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
          <div className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize" onMouseDown={(e) => handleResizeStart(e, 'se')} />
        </>
      )}
    </div>
  );
};
