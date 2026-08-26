import { ReactNode } from 'react';

export type AppId = 
  | 'explorer' 
  | 'notepad' 
  | 'ai' 
  | 'code' 
  | 'calculator' 
  | 'paint' 
  | 'terminal' 
  | 'devvault' 
  | 'tasks' 
  | 'settings' 
  | 'browser' 
  | 'media';

export interface AppConfig {
  id: AppId;
  name: string;
  icon: ReactNode;
  component: React.ComponentType<{ window: WindowState }>;
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  singleton?: boolean;
}

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  prevX?: number;
  prevY?: number;
  prevWidth?: number;
  prevHeight?: number;
}

export interface OSState {
  windows: WindowState[];
  activeWindowId: string | null;
  isStartMenuOpen: boolean;
  wallpaper: string;
  theme: 'dark' | 'light' | 'glass';
}
