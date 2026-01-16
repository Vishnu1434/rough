import React, { useState } from 'react';
import {
    Clock, User, MessageSquare, ArrowRight, Calendar,
    ChevronDown, Hash, BarChart3, Layers,
    PlayCircle, AlertCircle, CheckCircle2, Timer, Zap, ArrowDown
} from 'lucide-react';

const MOCK_STORIES = [
    { id: 'PROJ-101', title: 'Implement OAuth2 Flow', assignee: 'Alex Rivera', status: 'In Progress', points: 8, statusColor: 'bg-blue-500', cycleTime: '10d 4h' },
    { id: 'PROJ-102', title: 'Fix Header Overflow', assignee: 'Sam Smith', status: 'In Review', points: 3, statusColor: 'bg-purple-500', cycleTime: '2d 1h' },
];

const MOCK_HISTORY = [
    { id: 1, type: 'transition', from: 'To Do', to: 'In Progress', exactTime: 'Oct 22 • 10:15 AM', gap: '4h 20m', sprint: 'S42', color: 'text-blue-500', bgColor: 'bg-blue-50', icon: <PlayCircle size={20}/> },
    { id: 2, type: 'transition', from: 'In Progress', to: 'Blocked', exactTime: 'Oct 23 • 02:45 PM', gap: '3d 12h', sprint: 'S42', color: 'text-red-500', bgColor: 'bg-red-50', icon: <AlertCircle size={20}/> },
    { id: 3, type: 'transition', from: 'Blocked', to: 'In Progress', exactTime: 'Oct 24 • 09:00 AM', gap: '1d 4h', sprint: 'S42', color: 'text-blue-500', bgColor: 'bg-blue-50', icon: <PlayCircle size={20}/> },
    { id: 4, type: 'transition', from: 'In Progress', to: 'Ready for Review', exactTime: 'Oct 25 • 04:20 PM', gap: '5h 30m', sprint: 'S43', color: 'text-purple-500', bgColor: 'bg-purple-50', icon: <Timer size={20}/> },
    { id: 5, type: 'transition', from: 'Ready for Review', to: 'Done', exactTime: 'Oct 26 • 11:00 AM', gap: '2h 15m', sprint: 'S43', color: 'text-green-500', bgColor: 'bg-green-50', icon: <CheckCircle2 size={20}/> },
];

const App = () => {
    const [selectedStory, setSelectedStory] = useState(MOCK_STORIES[0]);
    const [viewMode, setViewMode] = useState('graph');
    const [tablePivot, setTablePivot] = useState('total');

    return (
        <div className="flex h-screen bg-[#FDFDFD] font-sans text-slate-900 overflow-hidden">

            {/* SIDEBAR */}
            <aside className="w-72 bg-white border-r border-slate-100 flex flex-col shadow-sm z-10">
                <div className="p-6 border-b border-slate-50 flex items-center gap-2">
                    <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-lg">
                        <Zap size={14} className="text-white fill-white" />
                    </div>
                    <h1 className="text-lg font-black tracking-tight text-slate-800">JiraStream</h1>
                </div>

                <div className="p-4 space-y-2 overflow-y-auto">
                    {MOCK_STORIES.map(story => (
                        <div key={story.id} onClick={() => setSelectedStory(story)}
                             className={`p-4 rounded-2xl cursor-pointer border transition-all ${
                                 selectedStory.id === story.id ? 'bg-indigo-50/50 border-indigo-200' : 'bg-transparent border-transparent hover:bg-slate-50'
                             }`}>
                            <p className="text-[10px] font-black text-slate-400 mb-1">{story.id}</p>
                            <p className="text-sm font-bold text-slate-700 leading-tight">{story.title}</p>
                        </div>
                    ))}
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex justify-between items-center z-20">
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-900 text-white w-12 h-12 rounded-2xl flex flex-col items-center justify-center">
                            <span className="text-[8px] font-bold opacity-60 uppercase">Pts</span>
                            <span className="text-lg font-black">{selectedStory.points}</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-800 tracking-tight">{selectedStory.title}</h2>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{selectedStory.assignee}</p>
                        </div>
                    </div>

                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button onClick={() => setViewMode('chat')} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${viewMode === 'chat' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>CHAT</button>
                        <button onClick={() => setViewMode('graph')} className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${viewMode === 'graph' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>ANALYTICS</button>
                    </div>
                </header>

                <div className="flex-1 flex overflow-hidden">
                    {viewMode === 'graph' && (
                        <>
                            {/* LEFT: COLORFUL TIMELINE (30%) */}
                            <div className="w-[30%] border-r border-slate-100 bg-white overflow-y-auto p-10 relative">
                                <div className="absolute left-[67px] top-0 bottom-0 w-1 bg-gradient-to-b from-blue-50 via-red-50 to-green-50" />

                                {MOCK_HISTORY.map((step, idx) => (
                                    <div key={idx} className="relative mb-16 last:mb-0 group">
                                        <div className="flex items-center gap-6">
                                            {/* Colorful Orb */}
                                            <div className={`z-10 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${step.bgColor} ${step.color} border-2 border-white`}>
                                                {step.icon}
                                            </div>
                                            <div>
                                                <p className={`text-xs font-black uppercase tracking-tight ${step.color}`}>{step.to}</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-0.5">{step.exactTime}</p>
                                            </div>
                                        </div>

                                        {/* Connector Arrow with Time Label */}
                                        {idx !== MOCK_HISTORY.length - 1 && (
                                            <div className="ml-[27px] py-4 flex flex-col items-start pl-12 relative">
                                                <div className="absolute left-[-1px] top-0 bottom-0 w-0.5 bg-slate-100" />
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black shadow-sm bg-white ${step.gap.includes('d') ? 'border-red-100 text-red-500' : 'border-indigo-100 text-indigo-500'}`}>
                                                    <Clock size={12} /> {step.gap}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* RIGHT: COMPACT SUMMARY TABLE (70%) */}
                            <div className="flex-1 bg-slate-50/30 p-8 overflow-y-auto">
                                <div className="max-w-4xl mx-auto space-y-6">
                                    <div className="flex justify-between items-end mb-2">
                                        <h3 className="text-sm font-black text-slate-800 uppercase flex items-center gap-2">
                                            <BarChart3 size={18} className="text-indigo-600"/> Efficiency Metrics
                                        </h3>
                                        <div className="flex bg-white border border-slate-200 p-1 rounded-lg shadow-sm">
                                            <button onClick={() => setTablePivot('total')} className={`px-3 py-1 text-[9px] font-black rounded ${tablePivot === 'total' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>OVERALL</button>
                                            <button onClick={() => setTablePivot('sprint')} className={`px-3 py-1 text-[9px] font-black rounded ${tablePivot === 'sprint' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>BY SPRINT</button>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <th className="px-8 py-5">Life Segment</th>
                                                <th className="px-8 py-5">Duration</th>
                                                <th className="px-8 py-5 text-right">Contribution</th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                            {MOCK_HISTORY.map((row, i) => (
                                                <tr key={i} className="hover:bg-indigo-50/20 transition-all">
                                                    <td className="px-8 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`w-2 h-2 rounded-full ${row.color.replace('text', 'bg')}`} />
                                                            <div>
                                                                <p className="text-sm font-bold text-slate-700">{row.to}</p>
                                                                <p className="text-[9px] font-black text-slate-300 uppercase">{row.sprint}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-4 font-mono text-xs font-black text-slate-600">
                                                        {tablePivot === 'total' ? row.gap : `From ${row.from}`}
                                                    </td>
                                                    <td className="px-8 py-4">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                <div className={`h-full ${row.color.replace('text', 'bg')}`} style={{ width: row.gap.includes('d') ? '80%' : '30%' }} />
                                                            </div>
                                                            <span className="text-[10px] font-black text-slate-400 w-8">{row.gap.includes('d') ? '72%' : '12%'}</span>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* COMPACT INSIGHT CARDS */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase">Avg Response</p>
                                                <p className="text-lg font-black text-slate-800">4h 12m</p>
                                            </div>
                                            <div className="p-3 bg-green-50 text-green-600 rounded-xl"><CheckCircle2 size={20}/></div>
                                        </div>
                                        <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase">Blocked Time</p>
                                                <p className="text-lg font-black text-red-600">3d 12h</p>
                                            </div>
                                            <div className="p-3 bg-red-50 text-red-600 rounded-xl"><AlertCircle size={20}/></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {viewMode === 'chat' && (
                        <div className="flex-1 bg-slate-50 flex items-center justify-center text-slate-400 font-bold">
                            Chat View Integrated (Same as your provided code)
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default App;
