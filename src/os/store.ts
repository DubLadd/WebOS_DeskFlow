import { useState, useCallback, useRef, useEffect } from 'react';
import { WindowState, AppId, AppConfig } from './types';
import { nanoid } from 'nanoid';

// Simple pub/sub or event-based store to avoid prop-drilling
type Listener = (state: WindowState[]) => void;
let listeners: Listener[] = [];
let windowsState: WindowState[] = [];

const notify = () => {
  listeners.forEach((l) => l([...windowsState]));
};

export const useWindows = () => {
  const [windows, setWindows] = useState<WindowState[]>(windowsState);

  useEffect(() => {
    const listener = (newWindows: WindowState[]) => setWindows(newWindows);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  const openApp = useCallback((app: AppConfig) => {
    // Check if singleton and already open
    if (app.singleton) {
      const existing = windowsState.find((w) => w.appId === app.id);
      if (existing) {
        focusWindow(existing.id);
        return;
      }
    }

    const maxZ = windowsState.length > 0 
      ? Math.max(...windowsState.map(w => w.zIndex)) 
      : 0;

    const newWindow: WindowState = {
      id: nanoid(),
      appId: app.id,
      title: app.name,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: maxZ + 1,
      x: 100 + (windowsState.length * 20),
      y: 100 + (windowsState.length * 20),
      width: app.width || 800,
      height: app.height || 600,
    };

    windowsState = [...windowsState, newWindow];
    notify();
  }, []);

  const closeWindow = useCallback((id: string) => {
    windowsState = windowsState.filter((w) => w.id !== id);
    notify();
  }, []);

  const focusWindow = useCallback((id: string) => {
    const maxZ = windowsState.length > 0 
      ? Math.max(...windowsState.map(w => w.zIndex)) 
      : 0;

    windowsState = windowsState.map((w) => {
      if (w.id === id) {
        return { ...w, zIndex: maxZ + 1, isMinimized: false };
      }
      return w;
    });
    notify();
  }, []);

  const updateWindow = useCallback((id: string, updates: Partial<WindowState>) => {
    windowsState = windowsState.map((w) => {
      if (w.id === id) {
        return { ...w, ...updates };
      }
      return w;
    });
    notify();
  }, []);

  const toggleMinimize = useCallback((id: string) => {
    windowsState = windowsState.map((w) => {
      if (w.id === id) {
        return { ...w, isMinimized: !w.isMinimized };
      }
      return w;
    });
    notify();
  }, []);

  const toggleMaximize = useCallback((id: string) => {
    windowsState = windowsState.map((w) => {
      if (w.id === id) {
        if (!w.isMaximized) {
          // Save current state before maximize
          return { 
            ...w, 
            isMaximized: true, 
            prevX: w.x, 
            prevY: w.y, 
            prevWidth: w.width, 
            prevHeight: w.height 
          };
        } else {
          // Restore state
          return { 
            ...w, 
            isMaximized: false, 
            x: w.prevX || w.x, 
            y: w.prevY || w.y, 
            width: w.prevWidth || w.width, 
            height: w.prevHeight || w.height 
          };
        }
      }
      return w;
    });
    notify();
  }, []);

  return {
    windows,
    openApp,
    closeWindow,
    focusWindow,
    updateWindow,
    toggleMinimize,
    toggleMaximize,
  };
};
