import React, { useState } from 'react';
import {
    ChevronDown, ChevronUp, Database, FileCode,
    Copy, Settings, CheckCircle2, XCircle, Globe, ArrowRightLeft
} from 'lucide-react';

const App = () => {
    const [data] = useState([
        {
            id: 1,
            feed: "PROD_USER_ACTIVITY_LOGS_STREAM_GLOBAL_V2_FINAL",
            slice: "regional/north_america/compliance/audit_logs",
            cobDate: "2024-10-24",
            batchId: "BID-99283-XQA",
            currentEnv: "PROD",
            exists: true,
            path: "s3://prod-data-bucket/feeds/user-logs/v2/2024/10/24/",
            payload: { event: "LOGIN", status: "SUCCESS", ip: "192.168.1.1" }
        },
        {
            id: 2,
            feed: "MARKETING_CAMPAIGN_METRICS_AGGREGATED",
            slice: "partner_data/sharepoint/exports/daily_summary",
            cobDate: "2024-10-23",
            batchId: "BID-11204-LMN",
            currentEnv: "PROD",
            exists: false,
            path: "s3://prod-data-bucket/feeds/marketing/2024/10/23/",
            foundInEnv: "UAT", // Logic: Backend found it elsewhere
            alternativePath: "s3://uat-data-bucket/feeds/marketing/2024/10/23/"
        }
    ]);

    return (
        <div className="min-h-screen bg-[#f8fafc] p-8 font-sans text-slate-900">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Data Event Manager</h1>
                        <p className="text-slate-500 text-sm">Monitor batch availability across environments</p>
                    </div>
                    <div className="text-xs font-medium text-slate-400">Current Env: <span className="text-blue-600 font-bold px-2 py-1 bg-blue-50 rounded">PRODUCTION</span></div>
                </header>

                <div className="space-y-3">
                    {data.map((item) => (
                        <DataRow key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const DataRow = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`group bg-white rounded-xl border transition-all duration-200 ${isOpen ? 'ring-2 ring-blue-500 shadow-xl' : 'hover:border-slate-300 shadow-sm'}`}>
            {/* TILE VIEW (Main Row) */}
            <div
                className="flex items-center p-5 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                {/* Feed & Slice */}
                <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center gap-2">
                        <Database size={18} className={`${item.exists ? 'text-blue-500' : 'text-slate-400'}`} />
                        <span className="font-bold text-slate-700 truncate text-lg tracking-tight" title={item.feed}>
              {item.feed}
            </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium truncate block mt-1 ml-6 uppercase tracking-wider">
            {item.slice}
          </span>
                </div>

                {/* Batch ID & COB Date */}
                <div className="w-56 px-6 border-l border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Batch Context</div>
                    <div className="flex flex-col">
                        <span className="text-sm font-mono font-bold text-slate-600">{item.batchId}</span>
                        <span className="text-xs text-blue-500 font-semibold">{item.cobDate}</span>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="w-40 px-4">
                    {item.exists ? (
                        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg w-fit">
                            <CheckCircle2 size={16} />
                            <span className="text-xs font-bold uppercase italic">Available</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg w-fit">
                            <XCircle size={16} />
                            <span className="text-xs font-bold uppercase italic">Missing</span>
                        </div>
                    )}
                </div>

                {/* Dropdown Toggle */}
                <div className="ml-4 p-2 rounded-full group-hover:bg-slate-50 transition-colors">
                    {isOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                </div>
            </div>

            {/* DETAILED VIEW (Expanded) */}
            {isOpen && (
                <div className="border-t bg-slate-50/50 rounded-b-xl p-8 animate-in fade-in slide-in-from-top-1 duration-300">
                    <div className="grid grid-cols-12 gap-8">

                        {/* Left: Path Info */}
                        <div className="col-span-7">
                            <div className="flex items-center gap-2 mb-4">
                                <Globe size={14} className="text-slate-400" />
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Environment Configuration</h4>
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-inner">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{item.currentEnv}</span>
                                    <button className="text-slate-400 hover:text-blue-500 transition-colors"><Copy size={14}/></button>
                                </div>
                                <p className="text-xs font-mono text-slate-500 break-all leading-relaxed">
                                    {item.path}
                                </p>
                            </div>
                        </div>

                        {/* Right: Actions (Conditional) */}
                        <div className="col-span-5 flex flex-col justify-center border-l border-slate-200 pl-8">
                            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Intelligent Actions</h4>

                            {item.exists ? (
                                /* Scenario A: Data Exists */
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-900 transition-transform active:scale-95 shadow-lg shadow-slate-200">
                                        <FileCode size={18} /> View JSON Payload
                                    </button>
                                    <p className="text-[10px] text-center text-slate-400 italic">Inspect data event contents from AWS S3</p>
                                </div>
                            ) : (
                                /* Scenario B: Data Missing - Cross-Env Intelligence */
                                <div className="space-y-3">
                                    <div className="mb-4 p-3 bg-amber-100/50 border border-amber-200 rounded-lg">
                                        <p className="text-[11px] text-amber-800 leading-tight">
                                            <strong>Note:</strong> Batch found in <strong>{item.foundInEnv}</strong> environment. Select recovery action below:
                                        </p>
                                    </div>

                                    <button className="w-full flex items-center gap-3 bg-white border-2 border-blue-100 text-blue-600 px-4 py-3 rounded-xl font-bold text-sm hover:border-blue-500 hover:bg-blue-50 transition-all">
                                        <ArrowRightLeft size={18} />
                                        <div className="text-left">
                                            <div>Copy from {item.foundInEnv}</div>
                                            <div className="text-[10px] font-normal opacity-70">Duplicate event to current env</div>
                                        </div>
                                    </button>

                                    <button className="w-full flex items-center gap-3 bg-white border-2 border-slate-100 text-slate-600 px-4 py-3 rounded-xl font-bold text-sm hover:border-slate-400 hover:bg-slate-50 transition-all">
                                        <Settings size={18} />
                                        <div className="text-left">
                                            <div>Update Config Path</div>
                                            <div className="text-[10px] font-normal opacity-70">Point to {item.foundInEnv} S3 path</div>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;