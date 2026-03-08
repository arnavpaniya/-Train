import React, { useState, useEffect, useRef } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, ReferenceLine
} from 'recharts';
import {
    Activity, AlertTriangle, CheckCircle2, Cpu,
    Database, FlaskConical, Gauge, LayoutDashboard,
    RefreshCcw, ShieldCheck, Zap, History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for tailwind class merging
function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// --- Constants ---
const PRIMARY_CYAN = '#00E5CC';
const WARNING_AMBER = '#F5A623';
const ALERT_CRIMSON = '#FF3B5C';

// --- Sub-Components ---

const Panel = ({ title, icon: Icon, children, className, isAlert = false }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
            "glass-panel border-slate-800 transition-colors duration-500 flex flex-col h-full",
            isAlert ? "border-alert ring-1 ring-alert/20 animate-drift-alert" : "",
            className
        )}
    >
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/5">
            <div className="flex items-center gap-2">
                <Icon size={16} className={isAlert ? "text-alert" : "text-primary"} />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    {title}
                </h3>
            </div>
            <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-slate-700" />
                <div className="w-1 h-1 rounded-full bg-slate-700" />
            </div>
        </div>
        <div className="flex-1 p-4 relative overflow-hidden">
            {children}
        </div>
    </motion.div>
);

const MetricItem = ({ label, value, subValue, trend, color = "primary" }) => (
    <div className="flex flex-col">
        <span className="label-caps">{label}</span>
        <div className="flex items-baseline gap-2">
            <span className={cn("text-2xl font-mono font-bold", color === "primary" ? "text-primary" : `text-${color}`)}>{value}</span>
            {subValue && <span className="text-[10px] text-slate-500 font-mono italic">{subValue}</span>}
        </div>
    </div>
);

const PipelineNode = ({ label, icon: Icon, status }) => {
    const statusColors = {
        idle: 'bg-slate-800 text-slate-500 border-slate-700',
        processing: 'bg-amber-500/10 text-warning border-amber-500/50 animate-pulse',
        active: 'bg-primary/10 text-primary border-primary/50',
        error: 'bg-alert/10 text-alert border-alert/50'
    };

    return (
        <div className="flex flex-col items-center gap-2 group">
            <div className={cn(
                "w-10 h-10 rounded-sm border flex items-center justify-center transition-all duration-300",
                statusColors[status]
            )}>
                <Icon size={18} />
            </div>
            <span className={cn(
                "text-[9px] font-bold uppercase tracking-tighter transition-colors",
                status === 'idle' ? "text-slate-600" : "text-slate-300"
            )}>{label}</span>
        </div>
    );
};

// --- Main Application ---

export default function App() {
    // State
    const [dataStream, setDataStream] = useState([]);
    const [mmdScore, setMmdScore] = useState(0.12);
    const [historyMMD, setHistoryMMD] = useState([]);
    const [updateLog, setUpdateLog] = useState([]);
    const [selectedUpdate, setSelectedUpdate] = useState(null);
    const [verification, setVerification] = useState({
        performance: 98.4,
        klDivergence: 0.02,
        behavioral: 99.1,
        passed: true
    });
    const [isDriftAlert, setIsDriftAlert] = useState(false);
    const [driftSeverity, setDriftSeverity] = useState('LOW');
    const [pipelineState, setPipelineState] = useState({
        data: 'active',
        drift: 'active',
        update: 'idle',
        verify: 'active',
        dash: 'active'
    });
    const [systemStats, setSystemStats] = useState({
        version: '2.4.1-stable',
        uptime: '14d 06h 22m',
        driftEvents: 14,
        successUpdates: 14,
        lastVerified: '2026-03-09 00:15:30'
    });

    // Initialize Data
    useEffect(() => {
        const initialData = Array.from({ length: 20 }, (_, i) => ({
            time: i.toString(),
            training: 0.5 + Math.random() * 0.1,
            incoming: 0.5 + Math.random() * 0.1,
            id: i
        }));
        setDataStream(initialData);

        const initialMMD = Array.from({ length: 15 }, (_, i) => ({
            time: i.toString(),
            mmd: 0.05 + Math.random() * 0.1
        }));
        setHistoryMMD(initialMMD);

        const initialLogs = [
            { id: '1', timestamp: '00:12:45', beforeAcc: 94.2, afterAcc: 96.8, lambda: 0.45, epochs: 12, status: 'improved' },
            { id: '2', timestamp: '23:45:10', beforeAcc: 96.8, afterAcc: 96.9, lambda: 0.42, epochs: 8, status: 'neutral' },
        ];
        setUpdateLog(initialLogs);
    }, []);

    // Live Simulation loop
    useEffect(() => {
        const interval = setInterval(() => {
            if (isDriftAlert) return;

            setDataStream(prev => {
                const lastItem = prev[prev.length - 1];
                const nextId = lastItem ? lastItem.id + 1 : 0;
                const newData = {
                    time: nextId.toString(),
                    training: 0.5 + Math.random() * 0.1,
                    incoming: 0.5 + Math.random() * 0.15,
                    id: nextId
                };
                return [...prev.slice(1), newData];
            });

            setMmdScore(prev => {
                const jitter = (Math.random() - 0.5) * 0.02;
                const next = Math.max(0.01, prev + jitter);
                setHistoryMMD(h => [...h.slice(1), { time: Date.now().toString(), mmd: next }]);
                return next;
            });
        }, 1500);

        return () => clearInterval(interval);
    }, [isDriftAlert]);

    // Simulate Drift Event Cascade
    const triggerDriftSimulation = () => {
        setIsDriftAlert(true);
        setDriftSeverity('HIGH');
        setMmdScore(0.85);
        setHistoryMMD(h => [...h.slice(1), { time: 'NOW', mmd: 0.85 }]);
        setPipelineState(s => ({ ...s, drift: 'error' }));

        setTimeout(() => {
            setPipelineState(s => ({ ...s, update: 'processing', drift: 'active' }));
        }, 2000);

        setTimeout(() => {
            const newUpdate = {
                id: Date.now().toString(),
                timestamp: new Date().toLocaleTimeString([], { hour12: false }),
                beforeAcc: 92.1,
                afterAcc: 97.4,
                lambda: 0.58,
                epochs: 18,
                status: 'improved'
            };
            setUpdateLog(prev => [newUpdate, ...prev]);
            setVerification({
                performance: 99.2,
                klDivergence: 0.05,
                behavioral: 98.6,
                passed: true
            });
            setIsDriftAlert(false);
            setMmdScore(0.08);
            setPipelineState({
                data: 'active',
                drift: 'active',
                update: 'active',
                verify: 'active',
                dash: 'active'
            });
            setSystemStats(ss => ({
                ...ss,
                driftEvents: ss.driftEvents + 1,
                successUpdates: ss.successUpdates + 1,
                lastVerified: new Date().toLocaleString()
            }));
        }, 5000);
    };

    return (
        <div className="relative min-h-screen bg-background font-sans text-slate-300 selection:bg-primary/30 select-none">
            <div className="scanline-overlay" />
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,229,204,0.05)_0%,transparent_70%)] pointer-events-none" />

            <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-background/50 backdrop-blur-xl z-50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary flex items-center justify-center rounded-sm">
                            <span className="text-background font-black text-lg leading-none">∆</span>
                        </div>
                        <h1 className="text-sm font-black tracking-[0.3em] uppercase">Train <span className="text-slate-500 font-normal ml-1">Mission Control</span></h1>
                    </div>
                    <div className="h-4 w-[1px] bg-slate-800" />
                    <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Live Deployment: Cluster-04
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <button
                        onClick={triggerDriftSimulation}
                        disabled={isDriftAlert}
                        className={cn(
                            "px-3 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all border",
                            isDriftAlert
                                ? "bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed"
                                : "bg-primary/10 border-primary/30 text-primary hover:bg-primary hover:text-background"
                        )}
                    >
                        {isDriftAlert ? "Cascade in Progress..." : "Simulate Drift Event"}
                    </button>

                    <div className="flex flex-col items-end">
                        <span className="label-caps mb-0 text-slate-600">Sync Status</span>
                        <span className="text-[10px] font-mono text-primary">0.02ms Latency</span>
                    </div>
                </div>
            </header>

            <main className="grid grid-cols-12 grid-rows-[1fr_180px] gap-4 p-4 h-[calc(100vh-56px)] overflow-hidden">

                {/* TOP LEFT: LIVE DATA STREAM */}
                <Panel title="Live Data Stream" icon={Activity} className="col-span-3">
                    <div className="flex justify-between mb-4">
                        <MetricItem label="Batch ID" value={`#${dataStream[dataStream.length - 1]?.id || 0}`} />
                        <MetricItem label="Velocity" value="128.4" subValue="ops/sec" />
                    </div>
                    <div className="h-[calc(100%-80px)] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dataStream}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="time" hide />
                                <YAxis hide domain={[0.4, 1.2]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#090E1A', border: '1px solid #1e293b', fontSize: '10px' }}
                                    itemStyle={{ color: PRIMARY_CYAN }}
                                />
                                <Line type="monotone" dataKey="training" stroke="#334155" strokeWidth={1} dot={false} strokeDasharray="4 4" isAnimationActive={false} />
                                <Line type="monotone" dataKey="incoming" stroke={isDriftAlert ? ALERT_CRIMSON : PRIMARY_CYAN} strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-4 text-[9px] uppercase font-bold tracking-widest text-slate-500">
                        <div className="flex items-center gap-1 font-mono"><div className="w-2 h-[1px] bg-slate-600" /> Baseline</div>
                        <div className="flex items-center gap-1 font-mono"><div className="w-2 h-[2px] bg-primary" /> Active</div>
                    </div>
                </Panel>

                {/* TOP CENTER: DRIFT MONITOR */}
                <Panel title="Drift Monitor & MMD Processor" icon={Gauge} className="col-span-6" isAlert={isDriftAlert}>
                    <div className="grid grid-cols-3 gap-6 h-full">
                        <div className="col-span-1 flex flex-col items-center justify-center border-r border-white/5 pr-6">
                            <div className="relative w-40 h-40">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="80" cy="80" r="70" fill="transparent" stroke="#1e293b" strokeWidth="6" />
                                    <circle
                                        cx="80" cy="80" r="70"
                                        fill="transparent"
                                        stroke={isDriftAlert ? ALERT_CRIMSON : PRIMARY_CYAN}
                                        strokeWidth="6"
                                        strokeDasharray={440}
                                        strokeDashoffset={440 - (440 * Math.min(mmdScore, 1))}
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="label-caps mb-0 text-slate-500">MMD Score</span>
                                    <span className={cn("text-4xl font-mono font-black", isDriftAlert ? "text-alert" : "text-primary")}>
                                        {mmdScore.toFixed(3)}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 flex flex-col items-center text-center">
                                <span className={cn(
                                    "px-3 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest",
                                    isDriftAlert ? "bg-alert text-white" : "bg-slate-800 text-slate-400"
                                )}>
                                    {isDriftAlert ? `DRIFT: ${driftSeverity}` : "SYSTEM STABLE"}
                                </span>
                                <span className="mt-2 text-[9px] text-slate-600 font-mono tracking-tighter">CONFIDENCE: 99.982%</span>
                            </div>
                        </div>

                        <div className="col-span-2 flex flex-col">
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <MetricItem label="Threshold" value="0.250" color="warning" />
                                <MetricItem label="Samples" value="2048" subValue="batch" />
                                <MetricItem label="Latency" value="1.2" subValue="ms" />
                            </div>
                            <div className="flex-1 w-full bg-black/20 rounded-sm p-4 border border-white/5">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={historyMMD}>
                                        <defs>
                                            <linearGradient id="colorMmd" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={isDriftAlert ? ALERT_CRIMSON : PRIMARY_CYAN} stopOpacity={0.4} />
                                                <stop offset="95%" stopColor={isDriftAlert ? ALERT_CRIMSON : PRIMARY_CYAN} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                        <XAxis dataKey="time" hide />
                                        <YAxis domain={[0, 1]} hide />
                                        <ReferenceLine y={0.25} stroke={WARNING_AMBER} strokeDasharray="3 3" />
                                        <Area type="step" dataKey="mmd" stroke={isDriftAlert ? ALERT_CRIMSON : PRIMARY_CYAN} fillOpacity={1} fill="url(#colorMmd)" isAnimationActive={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </Panel>

                {/* TOP RIGHT: MODEL UPDATE LOG */}
                <Panel title="Model Update Log" icon={History} className="col-span-3">
                    <div className="h-full overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        <AnimatePresence initial={false}>
                            {updateLog.map((log) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    onClick={() => setSelectedUpdate(log.id)}
                                    className={cn(
                                        "p-3 rounded-sm border cursor-pointer transition-all",
                                        selectedUpdate === log.id
                                            ? "bg-primary/5 border-primary/40"
                                            : "bg-white/5 border-white/5 hover:border-white/10"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-mono text-slate-500">{log.timestamp}</span>
                                        <span className={cn(
                                            "px-1.5 py-0.5 rounded-[2px] text-[8px] font-bold uppercase",
                                            log.status === 'improved' ? "bg-primary text-black" :
                                                log.status === 'neutral' ? "bg-warning text-black" : "bg-alert text-white"
                                        )}>
                                            {log.status}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <div className="label-caps text-[7px] mb-0 opacity-50">Acc Change</div>
                                            <div className="text-[11px] font-mono font-bold">
                                                {log.beforeAcc}% → <span className="text-primary">{log.afterAcc}%</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="label-caps text-[7px] mb-0 opacity-50">λ Parameter</div>
                                            <div className="text-[11px] font-mono">{log.lambda}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </Panel>

                {/* BOTTOM LEFT: VERIFICATION */}
                <Panel title="Verification Status" icon={ShieldCheck} className="col-span-4">
                    <div className="grid grid-cols-5 gap-4 h-full">
                        <div className="col-span-2 flex flex-col justify-center border-r border-white/5 pr-4">
                            <span className="label-caps">Final Verdict</span>
                            <div className={cn(
                                "flex items-center justify-center gap-2 px-3 py-3 rounded-sm border mb-4",
                                verification.passed ? "bg-primary/10 border-primary/30 text-primary" : "bg-alert/10 border-alert/30 text-alert"
                            )}>
                                {verification.passed ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                                <span className="text-sm font-black tracking-widest leading-none">{verification.passed ? "PASSED" : "FAILED"}</span>
                            </div>
                            <div className="flex flex-col text-center">
                                <span className="label-caps text-[8px]">Rollback Protocol</span>
                                <span className="text-[9px] font-bold text-slate-600">IDLE_NO_EXCEPTION</span>
                            </div>
                        </div>

                        <div className="col-span-3 space-y-4 py-1">
                            {[
                                { label: 'Perf Core', value: verification.performance },
                                { label: 'KL Div Bound', value: (1 - verification.klDivergence) * 100 },
                                { label: 'Behavioral', value: verification.behavioral }
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center px-1">
                                        <div className="text-[9px] font-bold uppercase text-slate-500">{stat.label}</div>
                                        <span className="text-[10px] font-mono text-primary">{stat.value.toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${stat.value}%` }}
                                            className="h-full bg-primary"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Panel>

                {/* BOTTOM: SYSTEM HEALTH BAR */}
                <div className="col-span-8 glass-panel border-white/5 px-8 pt-4 pb-6 flex items-center justify-between">
                    <div className="grid grid-cols-4 gap-12">
                        {[
                            { label: 'System Version', v: `v${systemStats.version}`, c: 'text-white' },
                            { label: 'Success Updates', v: systemStats.successUpdates, c: 'text-primary' },
                            { label: 'Drift Incidents', v: systemStats.driftEvents, c: 'text-alert' },
                            { label: 'Node Uptime', v: systemStats.uptime, c: 'text-slate-500' }
                        ].map((s, i) => (
                            <div key={i} className="flex flex-col">
                                <span className="label-caps mb-0 opacity-50">{s.label}</span>
                                <span className={cn("text-xs font-mono font-bold uppercase", s.c)}>{s.v}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-6 border-l border-white/5 pl-12 h-full py-2">
                        <PipelineNode label="Stream" icon={Database} status={pipelineState.data} />
                        <div className="w-6 h-[1px] bg-white/5 mt-[-14px]" />
                        <PipelineNode label="Monitor" icon={Gauge} status={pipelineState.drift} />
                        <div className="w-6 h-[1px] bg-white/5 mt-[-14px]" />
                        <PipelineNode label="Update" icon={Cpu} status={pipelineState.update} />
                        <div className="w-6 h-[1px] bg-white/5 mt-[-14px]" />
                        <PipelineNode label="Verify" icon={ShieldCheck} status={pipelineState.verify} />
                        <div className="w-6 h-[1px] bg-white/5 mt-[-14px]" />
                        <PipelineNode label="Control" icon={LayoutDashboard} status={pipelineState.dash} />
                    </div>
                </div>

            </main>

            <footer className="fixed bottom-0 w-full h-6 border-t border-white/5 bg-[#090E1A] flex items-center justify-between px-6 text-[8px] font-mono text-slate-600 uppercase tracking-widest z-50">
                <div className="flex gap-4">
                    <span className="text-primary font-bold">∆TRAIN MISSION_CRITICAL_CORE_SERVICE</span>
                    <span className="opacity-30">|</span>
                    <span>LOCATION_ID: CLUSTER-S-4-DELTA</span>
                </div>
                <div className="flex gap-6">
                    <span>MEM: 4.2GB</span>
                    <span>LATENCY: 12ms</span>
                    <span className="text-primary font-black">SYSTEM_NOMINAL</span>
                </div>
            </footer>
        </div>
    );
}
