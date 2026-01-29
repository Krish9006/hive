import { getRun } from '@/lib/data';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, BrainCircuit, Terminal, FileJson, Zap, Shield, ChevronDown, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { notFound } from 'next/navigation';
import { AnimatedList, AnimatedItem } from '@/components/Animation';
import { MetricChart } from '@/components/MetricChart';

export const dynamic = 'force-dynamic';

export default async function RunDetail({ params }) {
    const run = await getRun(params.id);

    if (!run) {
        notFound();
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors">
                    <ArrowLeft size={16} className="mr-1" />
                    Back to Runs
                </Link>

                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{run.goal_description}</h1>
                        <div className="flex items-center gap-3 mt-2 text-sm text-slate-500 font-mono">
                            <span>{run.id}</span>
                            <span>•</span>
                            <span>{new Date(run.created_at).toLocaleString()}</span>
                            <span>•</span>
                            <span className={clsx(
                                'px-2 py-0.5 rounded-full text-xs font-semibold uppercase',
                                run.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    run.status === 'failed' ? 'bg-red-100 text-red-700' :
                                        'bg-blue-100 text-blue-700'
                            )}>
                                {run.status}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Metrics & Chart */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap className="text-amber-500" size={20} />
                            <h3 className="font-semibold text-slate-900">Live Performance</h3>
                        </div>
                        <MetricChart data={run.decisions} />
                    </div>

                    {/* Input / Output */}
                    <div className="grid grid-cols-1 gap-6">
                        <DataCard title="Final Output" data={run.output_data} icon={<FileJson size={18} />} expanded />
                        <DataCard title="Initial Input" data={run.input_data} icon={<Terminal size={18} />} />
                    </div>
                </div>

                {/* Right Column: Key Stats */}
                <div className="space-y-4">
                    <MetricCard label="Total Duration" value={`${(run.metrics?.duration_ms || 0) / 1000}s`} />
                    <MetricCard label="Tokens Consumed" value={run.metrics?.tokens_used || 0} />
                    <MetricCard label="Estimated Cost" value={`$${run.metrics?.cost || 0}`} highlighted />
                </div>
            </div>

            {/* Decision Timeline */}
            <div className="space-y-6 pt-8 border-t border-slate-100">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <BrainCircuit className="text-violet-600" />
                    Decision Timeline
                </h3>

                <div className="relative border-l-2 border-slate-200 ml-4 space-y-12 pl-8">
                    <AnimatedList className="space-y-12">
                        {run.decisions.map((decision, idx) => (
                            <AnimatedItem key={idx} className="relative">
                                <div className={clsx(
                                    "absolute -left-[43px] top-0 border-2 rounded-full p-1.5 z-10 box-content",
                                    decision.outcome?.success ? "bg-white border-slate-200" : "bg-red-50 border-red-200"
                                )}>
                                    <div className={clsx(
                                        "w-3 h-3 rounded-full",
                                        decision.outcome?.success ? "bg-violet-600" : "bg-red-500"
                                    )} />
                                </div>

                                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
                                    {/* Decision Header */}
                                    <div className="p-5 border-b border-slate-50 flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-lg text-slate-900 leading-tight">
                                                    {decision.intent}
                                                </h4>
                                                {decision.decision_type === 'recovery' && (
                                                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-amber-200">
                                                        <Shield size={10} /> Self-Healing
                                                    </span>
                                                )}
                                            </div>

                                            <div className="text-xs text-slate-500 flex items-center gap-2">
                                                <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 text-slate-600 uppercase text-[10px]">
                                                    {decision.decision_type}
                                                </span>
                                                <span>•</span>
                                                <span>{new Date(decision.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                        </div>
                                        {decision.outcome?.success ? (
                                            <div className="text-green-600 bg-green-50 px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                                                <CheckCircle size={14} /> Success
                                            </div>
                                        ) : (
                                            <div className="text-red-600 bg-red-50 px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1">
                                                <XCircle size={14} /> Failed
                                            </div>
                                        )}
                                    </div>

                                    {/* Thinking Cloud (Options) */}
                                    {decision.options && decision.options.length > 0 && (
                                        <div className="bg-slate-50/50 p-5 border-b border-slate-50">
                                            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <BrainCircuit size={14} /> EVALUATED OPTIONS
                                            </div>
                                            <div className="space-y-2">
                                                {decision.options.map((opt) => (
                                                    <div key={opt.id} className={clsx(
                                                        "flex items-center justify-between p-3 rounded-lg text-sm border",
                                                        opt.id === decision.chosen_option_id
                                                            ? "bg-violet-50 border-violet-200 text-violet-900 shadow-sm"
                                                            : "bg-white border-transparent text-slate-400 opacity-60"
                                                    )}>
                                                        <span className="font-medium">{opt.description}</span>
                                                        {opt.id === decision.chosen_option_id && (
                                                            <span className="text-xs bg-violet-200 text-violet-800 px-2 py-0.5 rounded-full font-bold">
                                                                CHOSEN
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Reasoning & Output */}
                                    <div className="p-5 space-y-4">
                                        <div className="bg-amber-50 text-amber-900 text-sm p-3 rounded-lg border border-amber-100 italic relative">
                                            <div className="absolute -top-2 left-4 w-4 h-4 bg-amber-50 border-t border-l border-amber-100 transform rotate-45"></div>
                                            <span className="font-semibold not-italic text-amber-700 block text-xs mb-1 uppercase">Reasoning</span>
                                            "{decision.reasoning}"
                                        </div>

                                        {decision.outcome && (
                                            <details className="group/details">
                                                <summary className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-800 transition-colors select-none">
                                                    <ChevronRight size={14} className="group-open/details:rotate-90 transition-transform" />
                                                    View Tool Output / Result
                                                </summary>
                                                <div className="mt-2 bg-slate-900 text-slate-300 text-xs p-3 rounded-lg font-mono overflow-auto max-h-60 shadow-inner">
                                                    <pre>{JSON.stringify(decision.outcome.result || decision.outcome.error, null, 2)}</pre>
                                                </div>
                                            </details>
                                        )}
                                    </div>
                                </div>
                            </AnimatedItem>
                        ))}
                    </AnimatedList>
                </div>
            </div>
        </div>
    );
}

function MetricCard({ label, value, highlighted }) {
    return (
        <div className={clsx(
            "p-6 rounded-xl border shadow-sm transition-all hover:scale-[1.02]",
            highlighted
                ? "bg-gradient-to-br from-violet-600 to-indigo-700 text-white border-transparent"
                : "bg-white border-slate-200"
        )}>
            <div className={clsx("text-sm font-medium", highlighted ? "text-white/80" : "text-slate-500")}>
                {label}
            </div>
            <div className={clsx("text-3xl font-bold mt-2", highlighted ? "text-white" : "text-slate-900")}>
                {value}
            </div>
        </div>
    );
}

function DataCard({ title, data, icon, expanded }) {
    return (
        <div className={clsx(
            "bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col",
            expanded ? "h-64" : "h-40"
        )}>
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center gap-2 font-semibold text-slate-700">
                {icon}
                {title}
            </div>
            <div className="p-4 bg-slate-900 text-slate-50 text-xs font-mono overflow-auto flex-1 custom-scrollbar">
                <pre>{JSON.stringify(data || {}, null, 2)}</pre>
            </div>
        </div>
    );
}
