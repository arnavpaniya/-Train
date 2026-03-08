import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, BarChart, Bar, Cell, ReferenceLine, PieChart, Pie
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

// --- Styles ---
const styles = {
    glassCard: "bg-white/[0.03] backdrop-blur-xl border border-white/[0.05] rounded-xl shadow-2xl overflow-hidden",
    glassCardHover: "hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300",
    navLink: "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-slate-400 hover:text-white hover:bg-white/[0.05]",
    navLinkActive: "text-white bg-primary/20 border border-primary/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]",
    metricLabel: "text-[11px] font-bold uppercase tracking-wider text-slate-500",
    sectionTitle: "text-xl font-bold text-white tracking-tight"
};

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
        <div className="w-64 border-r border-white/5 bg-surface/50 backdrop-blur-2xl flex flex-col h-full z-50">
            <div className="p-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-black text-white text-lg ring-4 ring-primary/10">∆</div>
                <span className="text-xl font-bold tracking-tight text-white">∆Train</span>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {links.map((link) => (
                    <button
                        key={link.id}
                        onClick={() => setActiveTab(link.id)}
                        className={cn(
                            styles.navLink,
                            activeTab === link.id ? styles.navLinkActive : ""
                        )}
                    >
                        <link.icon size={18} />
                        {link.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5">
                <div className="bg-white/5 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                        <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Pipeline Secure</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Model v2.4.1 is stable and monitoring for drift.</p>
                </div>
            </div>
        </div>
    );
};

const TopNav = ({ pipelineStatus }) => (
    <header className="h-16 border-b border-white/5 bg-surface/30 backdrop-blur-md flex items-center justify-between px-8 z-40">
        <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
                <div className={cn(
                    "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 border",
                    pipelineStatus === 'Running' ? "bg-success/10 border-success/30 text-success" :
                        pipelineStatus === 'Updating' ? "bg-warning/10 border-warning/30 text-warning" : "bg-slate-800 border-slate-700 text-slate-500"
                )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full", pipelineStatus === 'Running' ? "bg-success animate-pulse" : pipelineStatus === 'Updating' ? "bg-warning animate-bounce" : "bg-slate-500")} />
                    Status: {pipelineStatus}
                </div>
            </div>
            <div className="text-xs font-medium text-slate-500">
                Last update: <span className="text-slate-300 ml-1">Today, 14:22:10</span>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                <input
                    type="text"
                    placeholder="Search..."
                    className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 w-64 transition-all"
                />
            </div>
            <button className="p-2 text-slate-400 hover:text-white transition-colors relative">
                <Bell size={18} />
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-alert rounded-full border-2 border-surface" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary p-[1px]">
                <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
                    <User size={16} className="text-slate-400" />
                </div>
            </div>
        </div>
    </header>
);

const MetricCard = ({ label, value, trend, icon: Icon, color = "primary" }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className={cn(styles.glassCard, styles.glassCardHover, "p-6 flex flex-col gap-2")}
    >
        <div className="flex items-center justify-between">
            <span className={styles.metricLabel}>{label}</span>
            <div className={cn("p-2 rounded-lg bg-white/5", color === 'primary' ? 'text-primary' : color === 'success' ? 'text-success' : color === 'warning' ? 'text-warning' : 'text-alert')}>
                <Icon size={18} />
            </div>
        </div>
        <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
            {trend && (
                <span className={cn(
                    "text-xs font-bold flex items-center gap-0.5",
                    trend > 0 ? "text-success" : "text-alert"
                )}>
                    {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(trend)}%
                </span>
            )}
        </div>
    </motion.div>
);

const Overview = () => {
    const chartData = generateTimeSeries(15);
    return (
        <div className="p-8 space-y-8 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
                <h2 className={styles.sectionTitle}>Overview</h2>
                <button className="bg-primary hover:bg-primary/80 transition-all text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-lg shadow-primary/20">
                    <Zap size={16} /> Deploy New Version
                </button>
            </div>

            <div className="grid grid-cols-4 gap-6">
                <MetricCard label="Drift Score (MMD)" value="0.042" trend={-2.4} icon={Activity} />
                <MetricCard label="System Accuracy" value="98.12%" trend={0.5} icon={CheckCircle} color="success" />
                <MetricCard label="Compute Saved" value="84.2%" trend={1.2} icon={Flame} color="warning" />
                <MetricCard label="Models Active" value="1,240" icon={Layers} />
            </div>

            <div className="grid grid-cols-12 gap-6 pb-20">
                <div className={cn(styles.glassCard, "col-span-8 p-6")}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-white">Accuracy Over Time</h3>
                            <p className="text-xs text-slate-500 mt-1">Real-time performance metrics tracking baseline vs active models.</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="primaryGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="time" hide />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0B1120', border: '1px solid #ffffff10', borderRadius: '12px' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} fill="url(#primaryGrad)" />
                                <Area type="monotone" dataKey="baseline" stroke="#ffffff20" strokeWidth={1} fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={cn(styles.glassCard, "col-span-4 p-6")}>
                    <h3 className="text-lg font-bold text-white mb-6">System Health</h3>
                    <div className="space-y-6">
                        {[
                            { label: 'API Gateway', status: 'Healthy', val: 99.9, color: 'success' },
                            { label: 'EWC Processor', status: 'High Load', val: 94.2, color: 'warning' },
                            { label: 'Drift Worker', status: 'Healthy', val: 100, color: 'success' },
                            { label: 'Database Sink', status: 'Healthy', val: 99.8, color: 'success' }
                        ].map((node, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-slate-400">{node.label}</span>
                                    <span className={cn("font-bold", node.color === 'success' ? 'text-success' : 'text-warning')}>{node.status}</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className={cn("h-full rounded-full transition-all duration-1000", node.color === 'success' ? 'bg-success' : 'bg-warning')} style={{ width: `${node.val}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const DriftMonitor = () => {
    const pieData = [
        { name: 'Feature A', value: 400 },
        { name: 'Feature B', value: 300 },
        { name: 'Feature C', value: 300 },
        { name: 'Feature D', value: 200 },
    ];
    const COLORS = ['#3B82F6', '#8B5CF6', '#00D1FF', '#F59E0B'];

    return (
        <div className="p-8 space-y-8 h-full overflow-y-auto pb-20">
            <h2 className={styles.sectionTitle}>Drift Monitoring</h2>
            <div className="grid grid-cols-12 gap-6">
                <div className={cn(styles.glassCard, "col-span-4 p-6 flex flex-col items-center justify-center min-h-[400px]")}>
                    <h3 className={styles.metricLabel + " mb-8"}>MMD Score Profile</h3>
                    <div className="relative w-48 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[{ value: 85 }, { value: 15 }]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    startAngle={180}
                                    endAngle={0}
                                >
                                    <Cell fill="#3B82F6" stroke="none" />
                                    <Cell fill="#ffffff05" stroke="none" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-white">0.852</span>
                            <span className="text-[10px] text-alert font-bold bg-alert/10 px-2 py-0.5 rounded-full mt-2">HIGH DRIFT</span>
                        </div>
                    </div>
                </div>

                <div className={cn(styles.glassCard, "col-span-8 p-6")}>
                    <h3 className={styles.metricLabel + " mb-6"}>Feature Drift Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={pieData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} />
                                <YAxis hide />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

const ModelUpdates = () => (
    <div className="p-8 space-y-8 h-full overflow-y-auto pb-20">
        <h2 className={styles.sectionTitle}>Model Updates</h2>
        <div className="grid grid-cols-2 gap-6">
            <div className={cn(styles.glassCard, "p-6")}>
                <h3 className={styles.metricLabel + " mb-6"}>Delta vs Full Retraining (Accuracy)</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { name: 'Full Retrain', acc: 98.4 },
                            { name: '∆Train', acc: 98.3 }
                        ]}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569' }} />
                            <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#0B1120', border: 'none' }} />
                            <Bar dataKey="acc" fill="#8B5CF6" radius={8} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className={cn(styles.glassCard, "p-6")}>
                <h3 className={styles.metricLabel + " mb-6"}>Converge Time (Minutes)</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { name: 'Full Retrain', time: 184 },
                            { name: '∆Train', time: 22 }
                        ]}>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569' }} />
                            <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#0B1120', border: 'none' }} />
                            <Bar dataKey="time" fill="#3B82F6" radius={8} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    </div>
);

const Equivalence = () => (
    <div className="p-8 space-y-8 h-full overflow-y-auto">
        <h2 className={styles.sectionTitle}>Equivalence Verification</h2>
        <div className="grid grid-cols-12 gap-6">
            <div className={cn(styles.glassCard, "col-span-12 p-12 flex flex-col items-center justify-center text-center")}>
                <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center text-success mb-6 ring-8 ring-success/5">
                    <CheckCircle size={48} />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Models Equivalent</h3>
                <p className="text-slate-400 max-w-md mx-auto">The updated Delta model has been statistically verified as equivalent to the retrained baseline with a 99.9% confidence interval.</p>
                <div className="mt-8 flex gap-4">
                    <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-xs font-mono text-slate-300">σ Diff: &lt; 0.0001</div>
                    <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-xs font-mono text-slate-300">p-value: 0.982</div>
                </div>
            </div>
        </div>
    </div>
);

const CostAnalytics = () => (
    <div className="p-8 space-y-8 h-full overflow-y-auto">
        <h2 className={styles.sectionTitle}>Cost Analytics</h2>
        <div className="grid grid-cols-3 gap-6">
            <div className={cn(styles.glassCard, "p-6 bg-gradient-to-br from-success/5 to-transparent border-success/20")}>
                <h3 className={styles.metricLabel}>Total Cloud Savings</h3>
                <div className="text-4xl font-bold text-success mt-2 font-mono">$12,842.00</div>
                <p className="text-xs text-slate-500 mt-2 italic">Based on Reserved Instance pricing</p>
            </div>
            <div className={cn(styles.glassCard, "p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent")}>
                <h3 className={styles.metricLabel}>Efficiency Factor</h3>
                <div className="text-4xl font-bold text-primary mt-2 font-mono">12.4x</div>
                <p className="text-xs text-slate-500 mt-2">vs traditional retraining cycles</p>
            </div>
            <div className={cn(styles.glassCard, "p-6 border-warning/20 bg-gradient-to-br from-warning/5 to-transparent")}>
                <h3 className={styles.metricLabel}>CO2 Reduction</h3>
                <div className="text-4xl font-bold text-warning mt-2 font-mono">2.4 Tons</div>
                <p className="text-xs text-slate-500 mt-2">Compute energy saved</p>
            </div>
        </div>
    </div>
);

const ModelVersions = () => {
    const versions = [
        { v: 'v2.4.1', type: 'Delta Update', acc: '98.12%', date: '2026-03-09', status: 'Active' },
        { v: 'v2.4.0', type: 'Baseline', acc: '97.45%', date: '2026-03-05', status: 'Archived' },
        { v: 'v2.3.9', type: 'Delta Update', acc: '97.20%', date: '2026-03-02', status: 'Archived' },
        { v: 'v2.3.8', type: 'Delta Update', acc: '96.90%', date: '2026-02-28', status: 'Archived' },
        { v: 'v2.3.7', type: 'Baseline', acc: '96.85%', date: '2026-02-20', status: 'Archived' },
    ];

    return (
        <div className="p-8 space-y-8 h-full overflow-y-auto pb-20">
            <h2 className={styles.sectionTitle}>Model Versions</h2>
            <div className={styles.glassCard}>
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Version</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Type</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Accuracy</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {versions.map((v, i) => (
                            <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                                <td className="p-4 text-sm font-bold text-white group-hover:text-primary transition-colors">{v.v}</td>
                                <td className="p-4 text-sm text-slate-400">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border",
                                        v.type === 'Baseline' ? "border-secondary text-secondary" : "border-primary text-primary"
                                    )}>{v.type}</span>
                                </td>
                                <td className="p-4 text-sm font-mono text-slate-300">{v.acc}</td>
                                <td className="p-4 text-sm text-right">
                                    <span className={cn(
                                        "font-bold text-[10px] uppercase",
                                        v.status === 'Active' ? "text-success" : "text-slate-600"
                                    )}>{v.status}</span>
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
    const [logs] = useState([
        { time: '14:22:10', event: 'New dataset batch received', src: 'Inbound Worker' },
        { time: '14:21:45', event: 'MMD Shift analysis completed: Stable', src: 'Drift Monitor' },
        { time: '14:15:20', event: 'Equivalence verified for model v2.4.1', src: 'Verifier' },
        { time: '14:02:00', event: 'Delta Update #42 finalized', src: 'EWC Engine' },
    ]);

    return (
        <div className="p-8 space-y-8 h-full overflow-y-auto">
            <h2 className={styles.sectionTitle}>System Activity Log</h2>
            <div className={cn(styles.glassCard, "bg-black flex flex-col h-[500px]")}>
                <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-alert/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-warning/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-success/50" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Runtime: bash</span>
                </div>
                <div className="flex-1 p-6 font-mono text-[11px] leading-relaxed space-y-3 overflow-y-auto">
                    {logs.map((log, i) => (
                        <div key={i} className="flex gap-4 group">
                            <span className="text-slate-700 whitespace-nowrap">[{log.time}]</span>
                            <span className="text-primary whitespace-nowrap italic">{log.src}:</span>
                            <span className="text-slate-400 group-hover:text-white transition-colors">{log.event}</span>
                        </div>
                    ))}
                    <div className="flex gap-4 animate-pulse">
                        <span className="text-primary font-bold">{'>'}</span>
                        <div className="w-2 h-4 bg-primary rounded-sm" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function App() {
    const [activeTab, setActiveTab] = useState('overview');
    const [pipelineStatus] = useState('Running');

    return (
        <div className="flex h-screen w-full bg-background selection:bg-primary/30">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <div className="flex-1 flex flex-col relative overflow-hidden">
                <TopNav pipelineStatus={pipelineStatus} />

                <main className="flex-1 relative overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="h-full"
                        >
                            {activeTab === 'overview' && <Overview />}
                            {activeTab === 'drift' && <DriftMonitor />}
                            {activeTab === 'updates' && <ModelUpdates />}
                            {activeTab === 'verification' && <Equivalence />}
                            {activeTab === 'costs' && <CostAnalytics />}
                            {activeTab === 'versions' && <ModelVersions />}
                            {activeTab === 'logs' && <ActivityLog />}
                            {activeTab === 'settings' && <div className="p-8"><h2 className={styles.sectionTitle}>Settings</h2></div>}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
