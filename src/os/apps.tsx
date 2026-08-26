import { AppConfig } from './types';
import { 
  FolderOpen, 
  StickyNote, 
  Bot, 
  Code, 
  Calculator as CalculatorIcon, 
  Palette, 
  Terminal as TerminalIcon, 
  Lock, 
  Activity, 
  Settings as SettingsIcon, 
  Globe, 
  PlayCircle 
} from 'lucide-react';
import React from 'react';
import { Notepad } from '../apps/Notepad';
import { AIAssistant } from '../apps/AIAssistant';
import { Calculator } from '../apps/Calculator';
import { Terminal } from '../apps/Terminal';
import { Settings } from '../apps/Settings';
import { Explorer } from '../apps/Explorer';
import { DevVault } from '../apps/DevVault';
import { TaskManager } from '../apps/TaskManager';
import { WebBrowser } from '../apps/WebBrowser';
import { PixelPaint } from '../apps/PixelPaint';
import { MediaPlayer } from '../apps/MediaPlayer';
import { CodeStudio } from '../apps/CodeStudio';

export const APPS: AppConfig[] = [
  { id: 'explorer', name: 'File Explorer', icon: <FolderOpen />, component: Explorer },
  { id: 'notepad', name: 'Notepad', icon: <StickyNote />, component: Notepad },
  { id: 'ai', name: 'AI Assistant', icon: <Bot />, component: AIAssistant },
  { id: 'code', name: 'Code Studio', icon: <Code />, component: CodeStudio, width: 1000, height: 700 },
  { id: 'calculator', name: 'Calculator', icon: <CalculatorIcon />, component: Calculator, width: 320, height: 480, singleton: true },
  { id: 'paint', name: 'PixelPaint', icon: <Palette />, component: PixelPaint },
  { id: 'terminal', name: 'Terminal', icon: <TerminalIcon />, component: Terminal, width: 700, height: 500 },
  { id: 'devvault', name: 'DevVault', icon: <Lock />, component: DevVault, width: 600, height: 450, singleton: true },
  { id: 'tasks', name: 'Task Manager', icon: <Activity />, component: TaskManager, width: 500, height: 400, singleton: true },
  { id: 'settings', name: 'Settings', icon: <SettingsIcon />, component: Settings, width: 800, height: 600, singleton: true },
  { id: 'browser', name: 'Web Browser', icon: <Globe />, component: WebBrowser, width: 1000, height: 750 },
  { id: 'media', name: 'Media Player', icon: <PlayCircle />, component: MediaPlayer, width: 500, height: 400 },
];
