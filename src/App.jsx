import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import {
    LayoutDashboard, Activity, RefreshCw, ShieldCheck,
    History, Settings, Bell, Search, TrendingUp, TrendingDown,
    Zap, CheckCircle, Flame, DollarSign,
    Layers, Terminal, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// --- Mock Data Generators ---
const generateTimeSeries = (points, range = [0, 1]) =>
    Array.from({ length: points }, (_, i) => ({
        time: i.toString(),
        value: range[0] + Math.random() * (range[1] - range[0]),
        baseline: range[0] + Math.random() * (range[1] - range[0]) * 0.8
    }));

// --- Sub-Components ---

const Sidebar = ({ activeTab, setActiveTab }) => {
    const links = [
        { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
        { id: 'drift', icon: Activity, label: 'Drift Monitoring' },
        { id: 'updates', icon: RefreshCw, label: 'Model Updates' },
        { id: 'verification', icon: ShieldCheck, label: 'Equivalence' },
        { id: 'costs', icon: DollarSign, label: 'Cost Analytics' },
        { id: 'versions', icon: History, label: 'Model Versions' },
        { id: 'logs', icon: Terminal, label: 'System Logs' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="w-64 border-r border-white/5 bg-surface flex flex-col h-full flex-shrink-0 relative z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black text-white text-lg shadow-[0_0_20px_rgba(59,130,246,0.5)]">∆</div>
                <span className="text-xl font-bold tracking-tight text-white italic">∆Train</span>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
                {links.map((link) => {
                    const isActive = activeTab === link.id;
                    return (
                        <button
                            key={link.id}
                            onClick={() => setActiveTab(link.id)}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <link.icon size={18} className={cn("transition-transform group-hover:scale-110", isActive ? "text-white" : "text-primary/60")} />
                            <span>{link.label}</span>
                        </button>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                <div className="bg-success/5 border border-success/20 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        <span className="text-[11px] font-black text-success uppercase tracking-widest">System Secure</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">Stability: 99.98%</p>
                </div>
            </div>
        </div>
    );
};

const TopNav = ({ pipelineStatus }) => (
    <header className="h-20 border-b border-white/5 bg-surface/50 backdrop-blur-xl flex items-center justify-between px-10 flex-shrink-0 z-40">
        <div className="flex items-center gap-12">
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Global Pipeline</span>
                <div className={cn(
                    "px-3 py-1 rounded-lg text-[11px] font-bold uppercase flex items-center gap-2 border shadow-sm",
                    pipelineStatus === 'Running' ? "bg-success/10 border-success/30 text-success" : "bg-warning/10 border-warning/30 text-warning"
                )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full", pipelineStatus === 'Running' ? "bg-success animate-pulse" : "bg-warning animate-bounce")} />
                    {pipelineStatus} Mode
                </div>
            </div>
            <div className="h-8 w-px bg-white/5" />
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">System Version</span>
                <span className="text-xs font-bold text-white">v2.4.1 (Stable)</span>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                    type="text"
                    placeholder="Explore metrics..."
                    className="bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-80 transition-all font-medium placeholder:text-slate-600"
                />
            </div>
            <div className="flex gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                    <Bell size={20} />
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                    <Settings size={20} />
                </button>
            </div>
            <div className="w-px h-8 bg-white/5" />
            <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-white leading-none">Arnav Paniya</span>
                    <span className="text-[10px] text-primary font-bold">Admin</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-secondary p-[1px]">
                    <div className="w-full h-full rounded-xl bg-background flex items-center justify-center overflow-hidden">
                        <User size={20} className="text-white" />
                    </div>
                </div>
            </div>
        </div>
    </header>
);

const MetricCard = ({ label, value, trend, icon: Icon, color = "primary" }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-white/[0.03] backdrop-blur-md border border-white/5 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group shadow-lg"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
        <div className="flex items-center justify-between relative z-10">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
            <div className={cn("p-2 rounded-xl bg-white/5", color === 'primary' ? 'text-primary' : color === 'success' ? 'text-success' : color === 'warning' ? 'text-warning' : 'text-alert')}>
                <Icon size={20} />
            </div>
        </div>
        <div className="relative z-10 space-y-1">
            <h3 className="text-3xl font-black text-white tracking-tighter tabular-nums">{value}</h3>
            {trend && (
                <div className={cn(
                    "flex items-center gap-1.5 text-xs font-bold",
                    trend > 0 ? "text-success" : "text-alert"
                )}>
                    <div className={cn("px-1.5 py-0.5 rounded-lg bg-current/10 flex items-center gap-1")}>
                        {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {Math.abs(trend)}%
                    </div>
                    <span className="text-slate-500 font-medium">vs last period</span>
                </div>
            )}
        </div>
    </motion.div>
);

const Overview = () => (
    <div className="p-10 space-y-10 max-w-7xl mx-auto w-full overflow-y-auto h-full">
        <div className="flex items-end justify-between">
            <div>
                <h2 className="text-4xl font-black text-white tracking-tighter">Overview</h2>
                <p className="text-slate-500 font-medium mt-1">Global monitoring workspace for ∆Train infrastructure.</p>
            </div>
            <button className="bg-primary hover:bg-primary/80 transition-all text-white px-6 py-3 rounded-xl text-sm font-black flex items-center gap-2 shadow-2xl shadow-primary/40 uppercase tracking-widest">
                <Zap size={18} fill="white" /> Deploy Model
            </button>
        </div>

        <div className="grid grid-cols-4 gap-6">
            <MetricCard label="Drift Scale" value="0.042" trend={-2.4} icon={Activity} />
            <MetricCard label="Accuracy" value="98.12%" trend={0.5} icon={CheckCircle} color="success" />
            <MetricCard label="Resources Saved" value="84.2%" trend={1.2} icon={Flame} color="warning" />
            <MetricCard label="Active Clusters" value="1,240" icon={Layers} />
        </div>

        <div className="grid grid-cols-12 gap-8 items-start">
            <div className="col-span-8 bg-white/[0.02] border border-white/5 rounded-3xl p-8 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-xl font-black text-white tracking-tight">System Convergence</h3>
                        <p className="text-sm text-slate-500">Stability metrics for model v2.4.1 delta updates.</p>
                    </div>
                </div>
                <div className="h-[340px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={generateTimeSeries(20)}>
                            <defs>
                                <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="5 5" stroke="#ffffff03" vertical={false} />
                            <XAxis dataKey="time" hide />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#04070F', border: '1px solid #ffffff10', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={4} fill="url(#glowGrad)" fillOpacity={1} strokeLinecap="round" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="col-span-4 bg-white/[0.02] border border-white/5 rounded-3xl p-8 shadow-xl">
                <h3 className="text-xl font-black text-white tracking-tight mb-8">Infrastructure</h3>
                <div className="space-y-8">
                    {[
                        { label: 'EWC Processor', val: 94, status: 'Active', color: 'bg-primary' },
                        { label: 'MMD Worker', val: 78, status: 'Active', color: 'bg-secondary' },
                        { label: 'Data Sink', val: 100, status: 'Ideal', color: 'bg-success' }
                    ].map((item, i) => (
                        <div key={i} className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-black text-slate-500 uppercase tracking-widest">{item.label}</span>
                                <span className="text-white font-black">{item.val}%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.val}%` }}
                                    className={cn("h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)]", item.color)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default function App() {
    const [activeTab, setActiveTab] = useState('overview');
    const [pipelineStatus] = useState('Running');

    return (
        <div className="flex h-screen w-full bg-background font-sans text-slate-300 selection:bg-primary/30 antialiased overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[100px]" />
            </div>

            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1 flex flex-col relative overflow-hidden h-full">
                <TopNav pipelineStatus={pipelineStatus} />

                <main className="flex-1 overflow-hidden relative h-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.02, y: -10 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full w-full"
                        >
                            {activeTab === 'overview' && <Overview />}
                            {activeTab !== 'overview' && <div className="p-20 text-center"><h2 className="text-2xl font-black text-white uppercase italic opacity-20">{activeTab} system pending...</h2></div>}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
