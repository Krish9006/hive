import Link from 'next/link';
import { LayoutDashboard, Settings, Activity } from 'lucide-react';

export function Sidebar() {
    return (
        <div className="w-64 bg-slate-900 text-white h-screen flex flex-col border-r border-slate-800">
            <div className="p-6 border-b border-slate-800">
                <h1 className="text-xl font-bold flex items-center gap-2">
                    <Activity className="text-blue-500" />
                    Hive Agents
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
                >
                    <LayoutDashboard size={20} />
                    <span>Runs</span>
                </Link>
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="text-xs text-slate-500">
                    v0.1.0 PoC
                </div>
            </div>
        </div >
    );
}
