import React, { useState, useRef, useEffect } from 'react';
import { WindowState } from '../types';
import { cn } from '@blinkdotnew/ui';
import { 
  Palette, 
  Square, 
  Circle, 
  Minus, 
  Eraser, 
  Trash2, 
  Download, 
  Undo, 
  MousePointer2,
  Pencil,
  Type
} from 'lucide-react';

const COLORS = [
  '#F8FAFC', '#0F1729', '#0DA2E7', '#CC66FF', '#10B981', '#F59E0B', '#EF4444', 
  '#6366F1', '#EC4899', '#8B5CF6', '#14B8A6', '#F97316'
];

const BRUSH_SIZES = [2, 4, 8, 12, 24];

export const PixelPaint: React.FC<{ window: WindowState }> = () => {
  const [color, setColor] = useState('#0DA2E7');
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        // Fill white background initially
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, []);

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    ctx.lineWidth = brushSize;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      if (canvas) {
        setHistory([...history, canvas.toDataURL()]);
      }
    }
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setHistory([]);
      }
    }
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'deskflow_art.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="flex h-full bg-[#1e293b] rounded-b-xl overflow-hidden backdrop-blur-md">
      {/* Sidebar Toolset */}
      <div className="w-16 flex flex-col items-center py-4 gap-4 bg-white/5 border-r border-white/5">
         <div className="flex flex-col gap-2">
            {[
              { id: 'brush', icon: Pencil },
              { id: 'eraser', icon: Eraser },
            ].map((t: any) => (
              <button 
                key={t.id}
                onClick={() => setTool(t.id)}
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-xl transition-all",
                  tool === t.id ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : "text-muted-foreground hover:bg-white/10"
                )}
              >
                <t.icon size={20} />
              </button>
            ))}
         </div>

         <div className="w-8 h-[1px] bg-white/10" />

         <div className="flex flex-col gap-2">
            {COLORS.map(c => (
              <button 
                key={c}
                onClick={() => { setColor(c); setTool('brush'); }}
                className={cn(
                  "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 active:scale-90",
                  color === c && tool === 'brush' ? "border-white" : "border-transparent"
                )}
                style={{ backgroundColor: c }}
              />
            ))}
         </div>

         <div className="flex-1" />

         <button 
          onClick={clearCanvas}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-400/10 transition-all"
         >
           <Trash2 size={20} />
         </button>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
         {/* Top bar */}
         <div className="h-12 flex items-center px-6 bg-white/5 border-b border-white/5 justify-between">
            <div className="flex items-center gap-6">
               <div className="flex items-center gap-3">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Brush Size</span>
                 <div className="flex items-center gap-2">
                   {BRUSH_SIZES.map(s => (
                     <button 
                      key={s}
                      onClick={() => setBrushSize(s)}
                      className={cn(
                        "rounded-full bg-white/10 hover:bg-white/20 transition-all",
                        brushSize === s ? "ring-2 ring-primary bg-white/20" : ""
                      )}
                      style={{ width: 8 + (s/2), height: 8 + (s/2) }}
                     />
                   ))}
                 </div>
               </div>
            </div>

            <div className="flex items-center gap-2">
               <button 
                onClick={downloadImage}
                className="flex items-center gap-2 px-4 py-1.5 bg-primary/20 text-primary hover:bg-primary/30 rounded-lg text-xs font-bold transition-all"
               >
                 <Download size={14} />
                 Export
               </button>
            </div>
         </div>

         {/* Canvas Area */}
         <div className="flex-1 bg-white/5 p-8 flex items-center justify-center overflow-auto">
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden cursor-crosshair">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="max-w-full h-auto"
              />
            </div>
         </div>
      </div>
    </div>
  );
};
