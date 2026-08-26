import React, { useState, useEffect } from 'react';
import { WindowState } from '../types';
import { cn } from '@blinkdotnew/ui';
import { 
  Activity, 
  Cpu, 
  MemoryStick, 
  Globe, 
  HardDrive, 
  ArrowUp, 
  ArrowDown, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const generateData = (prevData: any[]) => {
  const newPoint = {
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    cpu: Math.floor(Math.random() * 30) + 10,
    ram: Math.floor(Math.random() * 20) + 40,
    net: Math.floor(Math.random() * 100),
  };
  return [...prevData.slice(-19), newPoint];
};

export const SystemMonitor: React.FC<{ window: WindowState }> = () => {
  const [data, setData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => generateData(prev));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const latest = data[data.length - 1] || { cpu: 0, ram: 0, net: 0 };

  const MetricCard = ({ icon: Icon, label, value, color, unit }: any) => (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3">
       <div className="flex items-center justify-between">
          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-opacity-20", color.replace('text-', 'bg-'))}>
             <Icon size={18} className={color} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-50">Live</span>
       </div>
       <div>
          <span className="block text-xs font-medium text-muted-foreground">{label}</span>
          <span className="text-2xl font-bold tracking-tight">{value}<span className="text-xs ml-1 opacity-40 uppercase">{unit}</span></span>
       </div>
       <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className={cn("h-full rounded-full transition-all duration-1000", color.replace('text-', 'bg-'))} style={{ width: `${value}%` }} />
       </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#0c0e14]/90 rounded-b-xl overflow-hidden backdrop-blur-md">
      {/* Header Tabs */}
      <div className="h-12 flex items-center px-6 bg-white/5 border-b border-white/5 gap-6">
        <button 
          onClick={() => setActiveTab('overview')}
          className={cn(
            "text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === 'overview' ? "text-primary border-b-2 border-primary py-4 mt-1" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Performance
        </button>
        <button 
          onClick={() => setActiveTab('processes')}
          className={cn(
            "text-xs font-bold uppercase tracking-widest transition-all",
            activeTab === 'processes' ? "text-primary border-b-2 border-primary py-4 mt-1" : "text-muted-foreground hover:text-foreground"
          )}
        >
          Processes
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 scrollbar-hide">
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <MetricCard icon={Cpu} label="Processor" value={latest.cpu} color="text-primary" unit="%" />
               <MetricCard icon={MemoryStick} label="Memory" value={latest.ram} color="text-accent" unit="%" />
               <MetricCard icon={Globe} label="Network" value={latest.net} color="text-green-400" unit="Mb/s" />
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 gap-6">
               <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-sm font-bold flex items-center gap-2 italic">
                        <Activity size={16} className="text-primary" />
                        CPU UTILIZATION HISTORY
                     </h3>
                     <div className="flex items-center gap-4 text-[10px] font-bold opacity-40 uppercase tracking-widest">
                        <span>60 Seconds</span>
                        <RefreshCw size={12} className="animate-spin-slow" />
                     </div>
                  </div>
                  
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data}>
                        <defs>
                          <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0DA2E7" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#0DA2E7" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="time" hide />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(12, 14, 20, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                          itemStyle={{ color: '#0DA2E7' }}
                        />
                        <Area type="monotone" dataKey="cpu" stroke="#0DA2E7" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" animationDuration={1000} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                     <h3 className="text-xs font-bold flex items-center gap-2 opacity-60">
                        <Globe size={14} className="text-green-400" />
                        NETWORK THROUGHPUT
                     </h3>
                     <div className="flex items-center justify-around py-4">
                        <div className="flex flex-col items-center gap-1">
                           <ArrowUp size={24} className="text-green-400" />
                           <span className="text-lg font-bold tracking-tight">{Math.floor(latest.net / 4)} <span className="text-[10px] opacity-40">KB/s</span></span>
                           <span className="text-[8px] font-bold uppercase text-muted-foreground">Upload</span>
                        </div>
                        <div className="w-[1px] h-12 bg-white/5" />
                        <div className="flex flex-col items-center gap-1">
                           <ArrowDown size={24} className="text-blue-400" />
                           <span className="text-lg font-bold tracking-tight">{latest.net} <span className="text-[10px] opacity-40">MB/s</span></span>
                           <span className="text-[8px] font-bold uppercase text-muted-foreground">Download</span>
                        </div>
                     </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                     <h3 className="text-xs font-bold flex items-center gap-2 opacity-60">
                        <HardDrive size={14} className="text-accent" />
                        DISK OPERATIONS
                     </h3>
                     <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                           <span>Read Speed</span>
                           <span className="text-foreground">420 MB/s</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-accent w-1/2" />
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                           <span>Write Speed</span>
                           <span className="text-foreground">185 MB/s</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                           <div className="h-full bg-accent w-1/4" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'processes' && (
          <div className="space-y-4 animate-fade-in">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-widest opacity-50 px-2">Active OS Threads</h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[10px] font-bold uppercase">
                   <AlertCircle size={12} className="text-primary" />
                   14 Threads Running
                </div>
             </div>
             
             <div className="space-y-1">
                {[
                  { name: 'System Idle Process', cpu: '88%', ram: '4 KB', status: 'Running' },
                  { name: 'DeskFlow Kernel', cpu: '4.2%', ram: '142 MB', status: 'Healthy' },
                  { name: 'Window Compositor', cpu: '2.8%', ram: '85 MB', status: 'Running' },
                  { name: 'Blink SDK Bridge', cpu: '1.5%', ram: '24 MB', status: 'Standby' },
                  { name: 'Audio Engine', cpu: '0.4%', ram: '12 MB', status: 'Running' },
                  { name: 'Network Daemon', cpu: '0.2%', ram: '8 MB', status: 'Connected' },
                ].map((p, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors group border border-transparent hover:border-white/5">
                     <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-all">
                        <Activity size={14} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <span className="block text-xs font-bold truncate">{p.name}</span>
                        <span className="block text-[10px] text-muted-foreground opacity-50 uppercase tracking-widest font-bold">PID: {1000 + i}</span>
                     </div>
                     <div className="flex items-center gap-8 text-[10px] font-mono">
                        <div className="w-12 text-right">
                           <span className="block opacity-40 uppercase font-sans font-bold">CPU</span>
                           <span className="text-primary">{p.cpu}</span>
                        </div>
                        <div className="w-16 text-right">
                           <span className="block opacity-40 uppercase font-sans font-bold">RAM</span>
                           <span>{p.ram}</span>
                        </div>
                        <div className="w-20 text-right hidden sm:block">
                           <span className="block opacity-40 uppercase font-sans font-bold text-[8px]">State</span>
                           <span className="text-green-400">{p.status}</span>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
