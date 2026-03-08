import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie, Radar, RadarChart, PolarGrid, PolarAngleAxis, ScatterChart, Scatter
} from 'recharts';
import {
    LayoutDashboard, Activity, RefreshCw, ShieldCheck,
    History, Settings, Bell, Search, TrendingUp, TrendingDown,
    Zap, CheckCircle, Flame, DollarSign,
    Layers, Terminal, User, Cpu, Database, Clock, Rocket
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

const generateComparisonData = () => [
    { name: 'Baseline (v2.3)', acc: 96.5, latency: 120, cost: 450 },
    { name: 'Full Retrain', acc: 98.4, latency: 115, cost: 890 },
    { name: '∆Train (v2.4)', acc: 98.2, latency: 108, cost: 112 },
];

const generateHeatmapData = () =>
    Array.from({ length: 6 }, (_, i) => ({
        feature: `Feature ${i}`,
        drift: Math.random() * 0.8,
        importance: Math.random() * 100
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
            <div className="p-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-black text-white text-xl shadow-[0_0_30px_rgba(59,130,246,0.3)] border border-white/10">∆</div>
                <span className="text-2xl font-black tracking-tighter text-white italic">∆Train</span>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const isActive = activeTab === link.id;
                    return (
                        <button
                            key={link.id}
                            onClick={() => setActiveTab(link.id)}
                            className={cn(
                                "w-full flex items-center justify-start gap-4 px-5 py-4 rounded-[20px] text-sm font-bold transition-all duration-300 group relative",
                                isActive
                                    ? "bg-primary text-white shadow-xl shadow-primary/30"
                                    : "text-slate-500 hover:text-white hover:bg-white/[0.03]"
                            )}
                        >
                            <link.icon size={20} className={cn("transition-transform group-hover:scale-110", isActive ? "text-white" : "text-primary/60")} />
                            <span>{link.label}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabIndicator"
                                    className="absolute left-[-16px] w-1.5 h-6 bg-primary rounded-r-full shadow-[0_0_20px_#3B82F6]"
                                />
                            )}
                        </button>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-white/5 bg-white/[0.01]">
                <div className="bg-success/5 border border-success/20 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_10px_#10B981]" />
                            <span className="text-[10px] font-black text-success uppercase tracking-widest">Global Live</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 tabular-nums">98.12%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className="w-[98%] h-full bg-success opacity-50" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const TopNav = ({ pipelineStatus }) => (
    <header className="h-24 border-b border-white/5 bg-surface/50 backdrop-blur-3xl flex items-center justify-between px-12 flex-shrink-0 z-40">
        <div className="flex items-center gap-16">
            <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.25em] mb-1.5 opacity-60">Control Plane</span>
                <div className={cn(
                    "px-3 py-1.5 rounded-xl text-[11px] font-black uppercase flex items-center gap-2.5 border shadow-xl",
                    pipelineStatus === 'Running' ? "bg-success/10 border-success/30 text-success" : "bg-warning/10 border-warning/30 text-warning"
                )}>
                    <div className={cn("w-2 h-2 rounded-full", pipelineStatus === 'Running' ? "bg-success animate-pulse" : "bg-warning animate-bounce")} />
                    System: {pipelineStatus}
                </div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="flex items-center gap-4">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.25em] mb-1.5 opacity-60">Active Model</span>
                    <span className="text-sm font-black text-white flex items-center gap-2">
                        v2.4.1-delta <ShieldCheck size={14} className="text-primary" />
                    </span>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-8">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
                <input
                    type="text"
                    placeholder="Search clusters, logs..."
                    className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 w-[400px] transition-all font-semibold placeholder:text-slate-600 focus:bg-white/[0.08]"
                />
            </div>
            <div className="flex gap-3">
                <button className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all border border-white/5 active:scale-95 relative">
                    <Bell size={22} />
                    <div className="absolute top-3 right-3 w-2 h-2 bg-alert rounded-full border-2 border-surface" />
                </button>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex items-center gap-4 group cursor-pointer">
                <div className="flex flex-col items-end">
                    <span className="text-xs font-black text-white group-hover:text-primary transition-colors">Arnav Paniya</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Product Architect</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-[1.5px] shadow-lg shadow-black/50">
                    <div className="w-full h-full rounded-[14px] bg-background flex items-center justify-center overflow-hidden">
                        <User size={24} className="text-white" />
                    </div>
                </div>
            </div>
        </div>
    </header>
);

const MetricCard = ({ label, value, trend, icon: Icon, color = "primary" }) => (
    <motion.div
        whileHover={{ y: -5, rotateX: 2, rotateY: 2 }}
        className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[28px] p-8 flex flex-col gap-6 relative overflow-hidden group shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border-t-white/20"
    >
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-colors" />
        <div className="flex items-center justify-between relative z-10">
            <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</span>
            <div className={cn(
                "p-3 rounded-2xl bg-white/5 border border-white/5",
                color === 'primary' ? 'text-primary shadow-[0_0_20px_#3B82F620]' :
                    color === 'success' ? 'text-success shadow-[0_0_20px_#10B98120]' :
                        color === 'warning' ? 'text-warning shadow-[0_0_20px_#F59E0B20]' :
                            'text-alert shadow-[0_0_20px_#EF444420]'
            )}>
                <Icon size={22} />
            </div>
        </div>
        <div className="relative z-10 space-y-2">
            <h3 className="text-4xl font-black text-white tracking-tighter tabular-nums leading-none">{value}</h3>
            {trend && (
                <div className={cn(
                    "flex items-center gap-2 text-xs font-black",
                    trend > 0 ? "text-success" : "text-alert"
                )}>
                    <div className={cn("px-2 py-1 rounded-xl bg-current/10 border border-current/20 flex items-center gap-1.5")}>
                        {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {Math.abs(trend)}%
                    </div>
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">vs previous batch</span>
                </div>
            )}
        </div>
    </motion.div>
);

// --- Sections ---

const Overview = ({ data }) => (
    <div className="p-12 space-y-12 max-w-[1600px] mx-auto w-full overflow-y-auto h-full scroll-smooth pb-32">
        <div className="flex items-end justify-between">
            <div className="space-y-2">
                <h2 className="text-5xl font-black text-white tracking-tighter">Overview</h2>
                <p className="text-slate-500 font-bold text-lg tracking-tight">Enterprise Machine Learning Monitoring Hub</p>
            </div>
            <div className="flex gap-4">
                <button className="bg-white/5 hover:bg-white/10 transition-all text-white px-8 py-4 rounded-2xl text-sm font-black border border-white/10 uppercase tracking-widest active:scale-95 shadow-xl">
                    View Logs
                </button>
                <button className="bg-primary hover:bg-primary/80 transition-all text-white px-8 py-4 rounded-2xl text-sm font-black flex items-center gap-3 shadow-[0_0_40px_rgba(59,130,246,0.5)] border border-primary/20 uppercase tracking-widest active:scale-95">
                    <Zap size={20} fill="white" /> Deploy Sync
                </button>
            </div>
        </div>

        <div className="grid grid-cols-4 gap-8">
            <MetricCard label="MMD Score" value="0.042" trend={-2.4} icon={Activity} />
            <MetricCard label="Model Accuracy" value="98.12%" trend={0.5} icon={CheckCircle} color="success" />
            <MetricCard label="Compute Saved" value="84.2%" trend={1.2} icon={Flame} color="warning" />
            <MetricCard label="Active Clusters" value="1,240" icon={Layers} />
        </div>

        <div className="grid grid-cols-12 gap-10 items-start">
            <div className="col-span-8 bg-white/[0.02] border border-white/10 rounded-[40px] p-10 relative overflow-hidden shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tight italic">Performance Velocity</h3>
                        <p className="text-sm text-slate-500 font-bold">Accuracy trends across distributed delta training nodes.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-primary" />
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Baseline</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-700" />
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Realtime</span>
                        </div>
                    </div>
                </div>
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.4} />
                                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="10 10" stroke="#ffffff05" vertical={false} />
                            <XAxis dataKey="time" hide />
                            <YAxis domain={['auto', 'auto']} hide />
                            <Tooltip
                                cursor={{ stroke: '#3B82F6', strokeWidth: 2 }}
                                contentStyle={{ backgroundColor: '#04070F', border: '1px solid #ffffff15', borderRadius: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.8)', padding: '20px' }}
                                itemStyle={{ fontWeight: 'black', textTransform: 'uppercase', fontSize: '10px' }}
                            />
                            <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={5} fill="url(#glowGrad)" strokeLinecap="round" />
                            <Area type="monotone" dataKey="baseline" stroke="#ffffff10" strokeWidth={2} fill="transparent" strokeDasharray="10 5" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="col-span-4 bg-white/[0.02] border border-white/10 rounded-[40px] p-10 shadow-2xl backdrop-blur-md">
                <h3 className="text-2xl font-black text-white tracking-tight italic mb-10">Infrastructure</h3>
                <div className="space-y-10">
                    {[
                        { label: 'EWC Core', val: 94, status: 'Active', color: 'bg-primary' },
                        { label: 'Drift Worker', val: 78, status: 'Warning', color: 'bg-secondary' },
                        { label: 'Verification Node', val: 100, status: 'Ready', color: 'bg-success' }
                    ].map((item, i) => (
                        <div key={i} className="space-y-4">
                            <div className="flex justify-between items-center text-[10px]">
                                <span className="font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</span>
                                <span className={cn("font-black px-2 py-1 rounded-md bg-white/5", item.status === 'Warning' ? 'text-warning' : 'text-success')}>{item.status}</span>
                            </div>
                            <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${item.val}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className={cn("h-full rounded-full shadow-[0_0_20px_rgba(255,255,255,0.15)]", item.color)}
                                />
                            </div>
                            <div className="flex justify-between text-[11px] font-bold text-slate-500 tabular-nums">
                                <span>Utilization</span>
                                <span>{item.val}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const DriftMonitor = () => {
    const heatmap = generateHeatmapData();
    const radialData = [{ name: 'Drift', value: 85, fill: '#3B82F6' }, { name: 'Stable', value: 15, fill: 'transparent' }];

    return (
        <div className="p-12 space-y-12 max-w-[1600px] mx-auto w-full overflow-y-auto h-full scroll-smooth pb-32">
            <h2 className="text-5xl font-black text-white tracking-tighter italic">Drift Monitoring</h2>

            <div className="grid grid-cols-12 gap-10">
                <div className="col-span-4 bg-white/[0.02] border border-white/10 rounded-[40px] p-10 flex flex-col items-center justify-center min-h-[500px] text-center shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                    <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.25em] mb-12 relative z-10">Maximum Mean Discrepancy (MMD)</h3>
                    <div className="relative w-72 h-72 group relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={radialData} innerRadius={100} outerRadius={130} startAngle={180} endAngle={0} dataKey="value" stroke="none">
                                    {radialData.map((entry, index) => <Cell key={index} fill={entry.fill} />)}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-x-0 bottom-12 flex flex-col items-center justify-center">
                            <span className="text-6xl font-black text-white tabular-nums tracking-tighter">0.852</span>
                            <span className="text-xs font-black text-alert bg-alert/10 px-4 py-2 rounded-full border border-alert/20 mt-4 shadow-[0_0_30px_#EF444420] tracking-widest uppercase">Critical Drift</span>
                        </div>
                    </div>
                </div>

                <div className="col-span-8 bg-white/[0.02] border border-white/10 rounded-[40px] p-10 shadow-2xl backdrop-blur-md">
                    <h3 className="text-2xl font-black text-white tracking-tight italic mb-10">Feature Drift Heatmap</h3>
                    <div className="grid grid-cols-6 gap-6 h-[340px]">
                        {heatmap.map((item, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="flex flex-col gap-4"
                            >
                                <div className="flex-1 rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative flex items-end">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${item.drift * 100}%` }}
                                        className={cn(
                                            "w-full transition-colors duration-500 shadow-lg",
                                            item.drift > 0.6 ? "bg-alert shadow-[#EF444450]" : "bg-primary shadow-[#3B82F650]"
                                        )}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center flex-col p-2 text-center">
                                        <span className="text-[10px] font-black text-white mix-blend-difference uppercase">{Math.round(item.drift * 100)}%</span>
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center truncate">{item.feature}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ModelUpdates = () => {
    const comparison = generateComparisonData();
    return (
        <div className="p-12 space-y-12 max-w-[1600px] mx-auto w-full overflow-y-auto h-full scroll-smooth pb-32">
            <h2 className="text-5xl font-black text-white tracking-tighter italic">Optimization Comparison</h2>
            <div className="grid grid-cols-2 gap-10">
                <div className="bg-white/[0.02] border border-white/10 rounded-[40px] p-10 shadow-2xl backdrop-blur-md">
                    <h3 className="text-2xl font-black text-white tracking-tight italic mb-8">Accuracy Efficiency</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={comparison}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 'black', textTransform: 'uppercase' }} />
                                <Tooltip cursor={{ fill: 'white', opacity: 0.03 }} contentStyle={{ backgroundColor: '#04070F', border: '1px solid #ffffff10', borderRadius: '16px' }} />
                                <Bar dataKey="acc" radius={[12, 12, 0, 0]} barSize={60}>
                                    {comparison.map((entry, index) => (
                                        <Cell key={index} fill={entry.name.includes('∆') ? '#3B82F6' : '#ffffff10'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white/[0.02] border border-white/10 rounded-[40px] p-10 shadow-2xl backdrop-blur-md">
                    <h3 className="text-2xl font-black text-white tracking-tight italic mb-8">Resource Cost ($/cycle)</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={comparison}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 'black', textTransform: 'uppercase' }} />
                                <Bar dataKey="cost" radius={[12, 12, 0, 0]} barSize={60}>
                                    {comparison.map((entry, index) => (
                                        <Cell key={index} fill={entry.name.includes('∆') ? '#10B981' : '#ffffff10'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Equivalence = () => (
    <div className="p-12 space-y-12 max-w-[1600px] mx-auto w-full h-full flex flex-col items-center justify-center scroll-smooth pb-32">
        <div className="max-w-4xl w-full bg-white/[0.02] border border-white/10 rounded-[50px] p-20 text-center shadow-2xl backdrop-blur-3xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-transparent via-success to-transparent animate-pulse" />
            <div className="w-32 h-32 bg-success/10 rounded-full flex items-center justify-center text-success mb-12 mx-auto ring-[16px] ring-success/5 shadow-[0_0_60px_rgba(16,185,129,0.3)]">
                <CheckCircle size={64} />
            </div>
            <h3 className="text-6xl font-black text-white tracking-tighter italic mb-6">Models Equivalent</h3>
            <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                The ∆Train delta update engine v2.4 has passed statistical equivalence tests against the ground-truth baseline with <span className="text-success font-black">99.99% confidence</span>.
            </p>
            <div className="mt-16 flex justify-center gap-8">
                {[
                    { label: 'Variance Delta', val: '0.0001', icon: Activity },
                    { label: 'Log Likelihood', val: '0.992', icon: ShieldCheck },
                    { label: 'EWC Penalty', val: 'λ=400', icon: Zap },
                ].map((item, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-[30px] p-8 min-w-[200px] space-y-3">
                        <div className="flex items-center gap-2 justify-center opacity-40">
                            <item.icon size={14} className="text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                        </div>
                        <div className="text-2xl font-black text-white font-mono">{item.val}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const CostAnalytics = () => (
    <div className="p-12 space-y-12 max-w-[1600px] mx-auto w-full overflow-y-auto h-full scroll-smooth pb-32">
        <h2 className="text-5xl font-black text-white tracking-tighter italic">Value Metrics</h2>
        <div className="grid grid-cols-3 gap-10">
            <div className="bg-white/[0.02] border border-success/30 rounded-[40px] p-10 shadow-2xl backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-success/20 group-hover:scale-125 transition-transform"><DollarSign size={80} /></div>
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Total Cloud Savings</h3>
                <div className="text-6xl font-black text-success tabular-nums tracking-tighter">$142,842</div>
                <div className="mt-8 flex items-center gap-3">
                    <div className="px-3 py-1 bg-success/10 text-success text-[10px] font-black uppercase rounded-lg border border-success/20 animate-pulse">ROI: 840%</div>
                    <span className="text-slate-500 font-bold text-xs uppercase tracking-widest leading-none">Global Aggregate</span>
                </div>
            </div>
            <div className="bg-white/[0.02] border border-primary/30 rounded-[40px] p-10 shadow-2xl backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-primary/20 group-hover:scale-125 transition-transform"><Cpu size={80} /></div>
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Efficiency Multiplier</h3>
                <div className="text-6xl font-black text-primary tabular-nums tracking-tighter">12.4x</div>
                <p className="mt-8 text-slate-500 font-bold text-xs uppercase tracking-tight">vs Baseline retrain cycle at cluster-scale</p>
            </div>
            <div className="bg-white/[0.02] border border-warning/30 rounded-[40px] p-10 shadow-2xl backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 text-warning/20 group-hover:scale-125 transition-transform"><Flame size={80} /></div>
                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Emissions Saved</h3>
                <div className="text-6xl font-black text-warning tabular-nums tracking-tighter">4.2 T</div>
                <p className="mt-8 text-slate-500 font-bold text-xs uppercase tracking-tight">Reduction in compute energy footprint</p>
            </div>
        </div>
    </div>
);

const ModelVersions = () => {
    const versions = [
        { v: 'v2.4.1', type: 'Delta', acc: '98.12%', date: '2026-03-09', cluster: 'AWS-OS-1' },
        { v: 'v2.4.0', type: 'Full', acc: '97.45%', date: '2026-03-05', cluster: 'GCP-US-4' },
        { v: 'v2.3.9', type: 'Delta', acc: '97.20%', date: '2026-03-02', cluster: 'AWS-OS-1' },
        { v: 'v2.3.8', type: 'Delta', acc: '96.90%', date: '2026-02-28', cluster: 'LOCAL-2' },
    ];
    return (
        <div className="p-12 space-y-12 max-w-[1600px] mx-auto w-full overflow-y-auto h-full scroll-smooth pb-32">
            <h2 className="text-5xl font-black text-white tracking-tighter italic">Version History</h2>
            <div className="bg-white/[0.02] border border-white/10 rounded-[50px] overflow-hidden shadow-2xl backdrop-blur-3xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Version Cluster</th>
                            <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Strategy</th>
                            <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Accuracy Index</th>
                            <th className="p-8 text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {versions.map((v, i) => (
                            <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.05] transition-all cursor-pointer group active:bg-white/10">
                                <td className="p-8">
                                    <div className="flex flex-col">
                                        <span className="text-xl font-black text-white group-hover:text-primary transition-colors tracking-tighter">{v.v}</span>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{v.cluster}</span>
                                    </div>
                                </td>
                                <td className="p-8">
                                    <span className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-widest",
                                        v.type === 'Full' ? "border-secondary/30 text-secondary bg-secondary/5" : "border-primary/30 text-primary bg-primary/5 shadow-[0_0_15px_#3B82F620]"
                                    )}>{v.type} Update</span>
                                </td>
                                <td className="p-8 text-2xl font-black text-white font-mono tabular-nums tracking-tighter">{v.acc}</td>
                                <td className="p-8 text-right">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/5 border border-success/30 rounded-2xl text-[11px] font-black text-success tracking-widest uppercase">
                                        <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                        Deployed
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ActivityLog = () => {
    const events = [
        { time: '22:10:45', event: 'Drift Detected on Feature Vector [PX-30]', src: 'MMD_WORKER', color: 'text-alert' },
        { time: '22:11:02', event: 'EWC Weight Consolidation Step Initialized', src: 'TRAINER_DELTA', color: 'text-primary' },
        { time: '22:11:15', event: 'Model Equivalency Test Passed (σ=0.99)', src: 'VERIFIER', color: 'text-success' },
        { time: '22:11:20', event: 'Hot-Swap Deploy Successful v2.4.1.2', src: 'ROUTING_GRID', color: 'text-accent' },
    ];
    return (
        <div className="p-12 space-y-12 max-w-[1600px] mx-auto w-full h-full flex flex-col scroll-smooth pb-32">
            <h2 className="text-5xl font-black text-white tracking-tighter italic">System Runtime Log</h2>
            <div className="flex-1 bg-black border border-white/10 rounded-[40px] shadow-2xl relative overflow-hidden group">
                <div className="p-6 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
                    <div className="flex gap-2.5">
                        <div className="w-3 h-3 rounded-full bg-alert/50" />
                        <div className="w-3 h-3 rounded-full bg-warning/50" />
                        <div className="w-3 h-3 rounded-full bg-success/50" />
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Runtime: ∆TRAIN_CORE v2.4</span>
                        <div className="w-px h-4 bg-white/10" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary animate-pulse rounded-full" />
                            Encrypted Stream
                        </span>
                    </div>
                </div>
                <div className="p-10 font-mono text-sm leading-relaxed space-y-6 overflow-y-auto max-h-[600px] custom-scrollbar">
                    {events.map((log, i) => (
                        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} key={i} className="flex gap-8 group">
                            <span className="text-slate-700 font-bold tabular-nums">[{log.time}]</span>
                            <span className={cn("font-black tracking-widest italic shrink-0", log.color)}>{log.src}:</span>
                            <span className="text-slate-300 group-hover:text-white transition-colors">{log.event}</span>
                        </motion.div>
                    ))}
                    <div className="flex gap-4 animate-pulse">
                        <span className="text-primary font-black">{'>'}</span>
                        <div className="w-3 h-6 bg-primary/40 rounded shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main App ---

export default function App() {
    const [activeTab, setActiveTab] = useState('overview');
    const [pipelineStatus] = useState('Running');
    const [data, setData] = useState(generateTimeSeries(20, [0.85, 0.99]));

    useEffect(() => {
        const timer = setInterval(() => {
            setData(prev => {
                const newData = [...prev.slice(1), {
                    time: Date.now().toString(),
                    value: 0.94 + Math.random() * 0.05,
                    baseline: 0.96 + Math.random() * 0.02
                }];
                return newData;
            });
        }, 1500);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex h-screen w-full bg-background font-sans text-slate-300 selection:bg-primary/30 antialiased overflow-hidden">
            {/* Background Radiance Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[160px] opacity-40 animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[140px] opacity-30" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
            </div>

            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1 flex flex-col relative overflow-hidden h-full">
                <TopNav pipelineStatus={pipelineStatus} />

                <main className="flex-1 overflow-hidden relative h-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.96, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.04, y: -30 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full w-full"
                        >
                            {activeTab === 'overview' && <Overview data={data} />}
                            {activeTab === 'drift' && <DriftMonitor />}
                            {activeTab === 'updates' && <ModelUpdates />}
                            {activeTab === 'verification' && <Equivalence />}
                            {activeTab === 'costs' && <CostAnalytics />}
                            {activeTab === 'versions' && <ModelVersions />}
                            {activeTab === 'logs' && <ActivityLog />}
                            {activeTab === 'settings' && (
                                <div className="p-20 text-center flex flex-col items-center justify-center h-full">
                                    <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-slate-500 mb-6 border border-white/10 animate-spin-slow">
                                        <Settings size={40} />
                                    </div>
                                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Configuration Secure</h2>
                                    <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-[10px]">Access Level: Administrator</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
