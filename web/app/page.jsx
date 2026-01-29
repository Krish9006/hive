import { getRuns } from '@/lib/data';
import Link from 'next/link';
import { BadgeCheck, XCircle, Clock, Activity, Zap, Layers, BarChart3 } from 'lucide-react';
import clsx from 'clsx';

export const dynamic = 'force-dynamic';

export default async function Home() {
    const runs = await getRuns();

    // Calculate mock stats
    const totalRuns = runs.length;
    const completedRuns = runs.filter(r => r.status === 'completed').length;
    const successRate = totalRuns > 0 ? Math.round((completedRuns / totalRuns) * 100) : 0;
    const activeNow = runs.filter(r => r.status === 'running').length;

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                        Dashboard
                    </h2>
                    <p className="text-slate-500 mt-1">Monitor your autonomous agent fleet in real-time.</p>
                </div>
                <div className="flex gap-2">
                    <span className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full animate-pulse">
                        <span className="w-2 h-2 bg-green-500 rounded-full" />
                        System Operational
                    </span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Runs"
                    value={totalRuns}
                    icon={<Layers className="text-blue-600" />}
                    gradient="from-blue-50 to-blue-100" // Subtle gradient
                />
                <StatCard
                    title="Success Rate"
                    value={`${successRate}%`}
                    icon={<BarChart3 className="text-emerald-600" />}
                    gradient="from-emerald-50 to-emerald-100"
                />
                <StatCard
                    title="Active Agents"
                    value={activeNow}
                    icon={<Zap className="text-amber-500" />}
                    gradient="from-amber-50 to-amber-100"
                />
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900">Recent Activity</h3>
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">View All</button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 w-1/3">Goal</th>
                            <th className="px-6 py-4">Run ID</th>
                            <th className="px-6 py-4">Created</th>
                            <th className="px-6 py-4">Duration</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {runs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                    <div className="flex flex-col items-center gap-2">
                                        <Activity className="text-slate-300" size={32} />
                                        <p>No agent runs recorded yet.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            runs.map((run) => (
                                <tr key={run.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4">
                                        <StatusBadge status={run.status} />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-900">
                                        <Link href={`/runs/${run.id}`} className="block hover:text-blue-600 transition-colors text-ellipsis overflow-hidden whitespace-nowrap max-w-xs">
                                            {run.goal_description || 'No Description'}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                        {run.id.substring(0, 8)}...
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(run.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {run.metrics?.duration_ms ? `${(run.metrics.duration_ms / 1000).toFixed(1)}s` : '-'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, gradient }) {
    return (
        <div className={clsx("p-6 rounded-2xl border border-white shadow-sm flex items-center gap-4 transition-all hover:scale-[1.02]", `bg-gradient-to-br ${gradient}`)}>
            <div className="p-3 bg-white rounded-xl shadow-sm">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-600">{title}</p>
                <p className="text-3xl font-bold text-slate-900">{value}</p>
            </div>
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        completed: 'bg-green-100 text-green-700 border-green-200',
        failed: 'bg-red-100 text-red-700 border-red-200',
        running: 'bg-blue-100 text-blue-700 border-blue-200',
        pending: 'bg-slate-100 text-slate-700 border-slate-200',
    };

    const icons = {
        completed: <BadgeCheck size={14} />,
        failed: <XCircle size={14} />,
        running: <Activity size={14} />,
        pending: <Clock size={14} />,
    };

    return (
        <span className={clsx(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border shadow-sm',
            styles[status] || styles.pending
        )}>
            {icons[status] || icons.pending}
            <span className="capitalize">{status}</span>
        </span>
    );
}
