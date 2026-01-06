import React, { useState } from 'react';
import { Clock, User, MessageSquare, ArrowRight, Image as ImageIcon, Calendar, Filter, ChevronDown, Hash } from 'lucide-react';

// --- ENHANCED MOCK DATA WITH POINTS ---
const MOCK_STORIES = [
    {
        id: 'PROJ-101',
        title: 'Implement OAuth2 Flow',
        assignee: 'Alex Rivera',
        status: 'In Progress',
        points: 8,
        lastUpdated: '2023-10-24 14:30',
        statusColor: 'bg-blue-500'
    },
    {
        id: 'PROJ-102',
        title: 'Fix Header Overflow',
        assignee: 'Sam Smith',
        status: 'In Review',
        points: 3,
        lastUpdated: '2023-10-23 09:15',
        statusColor: 'bg-purple-500'
    },
    {
        id: 'PROJ-105',
        title: 'Database Migration',
        assignee: 'Alex Rivera',
        status: 'To Do',
        points: 13,
        lastUpdated: '2023-10-20 11:00',
        statusColor: 'bg-slate-400'
    },
];

const MOCK_HISTORY = [
    { id: 1, type: 'comment', user: 'Sam Smith', text: "I'm starting on the backend logic today.", time: '2 days ago', exactTime: 'Oct 22, 2023 • 10:15 AM', isViewer: false },
    { id: 2, type: 'transition', from: 'To Do', to: 'In Progress', time: '1 day ago', exactTime: 'Oct 23, 2023 • 02:45 PM', gap: '4h 20m' },
    { id: 3, type: 'point_change', oldPoints: 5, newPoints: 8, user: 'Project Lead', exactTime: 'Oct 23, 2023 • 03:00 PM' }, // Added point change event
    { id: 4, type: 'comment', user: 'Me (Viewer)', text: "Check the token expiration settings.", time: '10 hours ago', exactTime: 'Oct 24, 2023 • 08:30 AM', isViewer: true, attachments: ['config_v1.jpg'] },
    { id: 5, type: 'transition', from: 'In Progress', to: 'In Review', time: '2 hours ago', exactTime: 'Oct 24, 2023 • 04:20 PM', gap: '22h 15m' },
];

const App = () => {
    const [selectedSprint, setSelectedSprint] = useState('Sprint 42');
    const [selectedUser, setSelectedUser] = useState('All Assignees');
    const [selectedStory, setSelectedStory] = useState(MOCK_STORIES[0]);

    const filteredStories = MOCK_STORIES.filter(s =>
        selectedUser === 'All Assignees' || s.assignee === selectedUser
    );

    return (
        <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900">

            {/* SIDEBAR */}
            <aside className="w-85 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-2xl font-black tracking-tight text-indigo-600">JiraStream</h1>
                </div>

                <div className="p-4 space-y-5 overflow-y-auto">
                    {/* SPRINT & USER SELECTORS */}
                    <div className="space-y-3">
                        <div className="relative">
                            <select className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none" value={selectedSprint} onChange={(e) => setSelectedSprint(e.target.value)}>
                                <option>Sprint 42</option>
                                <option>Sprint 41</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-3 text-slate-400" size={16} />
                        </div>
                        <div className="relative">
                            <select className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                                {["All Assignees", "Alex Rivera", "Sam Smith"].map(user => <option key={user}>{user}</option>)}
                            </select>
                            <Filter className="absolute right-3 top-3 text-slate-400" size={16} />
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* STORY LIST */}
                    <div className="space-y-3">
                        {filteredStories.map(story => (
                            <div
                                key={story.id}
                                onClick={() => setSelectedStory(story)}
                                className={`group p-4 rounded-2xl cursor-pointer border relative transition-all duration-200 ${
                                    selectedStory.id === story.id ? 'bg-white border-blue-500 shadow-md translate-x-1' : 'bg-transparent border-transparent hover:bg-slate-50'
                                }`}
                            >
                                {/* Points Badge on Card */}
                                <div className="absolute top-4 right-4 bg-slate-100 text-slate-600 text-[10px] font-black w-6 h-6 rounded flex items-center justify-center">
                                    {story.points}
                                </div>

                                <div className="mb-1">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold text-white ${story.statusColor}`}>
                    {story.status}
                  </span>
                                </div>
                                <p className={`text-sm font-bold leading-snug mb-3 pr-6 ${selectedStory.id === story.id ? 'text-slate-900' : 'text-slate-600'}`}>
                                    {story.title}
                                </p>
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50">
                                    <div className="flex items-center text-[11px] text-slate-500">
                                        <User size={12} className="mr-1" /> {story.assignee}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* CHAT DISPLAY AREA */}
            <main className="flex-1 flex flex-col bg-slate-50 relative">

                {/* Story Header */}
                <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200 p-6 flex justify-between items-center sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        {/* Story Points Hero Metric */}
                        <div className="flex flex-col items-center justify-center bg-indigo-600 text-white w-14 h-14 rounded-2xl shadow-lg shadow-indigo-200">
                            <span className="text-[10px] font-bold uppercase opacity-80">Pts</span>
                            <span className="text-xl font-black">{selectedStory.points}</span>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-slate-800">{selectedStory.title}</h2>
                            <div className="flex gap-4 items-center mt-1">
                                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{selectedStory.id}</span>
                                <span className="flex items-center gap-1 text-[11px] font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded uppercase tracking-wider">
                  <Calendar size={12}/> Sprint Carry-over: 2
                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Narrative Flow */}
                <div className="flex-1 overflow-y-auto px-10 py-8 space-y-10">
                    {MOCK_HISTORY.map((item) => (
                        <div key={item.id}>

                            {item.type === 'point_change' ? (
                                /* Points Change Event */
                                <div className="flex justify-center my-6">
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 flex items-center gap-3">
                                        <Hash size={14} className="text-amber-600" />
                                        <span className="text-xs font-bold text-amber-800">Points re-estimated:</span>
                                        <span className="text-xs line-through text-amber-400">{item.oldPoints}</span>
                                        <ArrowRight size={12} className="text-amber-400" />
                                        <span className="text-sm font-black text-amber-600">{item.newPoints}</span>
                                        <span className="text-[10px] text-amber-400 ml-2">{item.exactTime}</span>
                                    </div>
                                </div>
                            ) : item.type === 'transition' ? (
                                /* Status Transition Pill */
                                <div className="flex flex-col items-center">
                                    <div className="flex items-center gap-4 bg-white shadow-sm border border-slate-200 px-6 py-3 rounded-2xl">
                                        <span className="text-xs font-bold text-slate-600 uppercase">{item.from}</span>
                                        <ArrowRight className="text-blue-500" size={18} />
                                        <span className="text-xs font-bold text-blue-600 uppercase">{item.to}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-2">{item.exactTime}</p>
                                </div>
                            ) : (
                                /* Comment Bubble */
                                <div className={`flex ${item.isViewer ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex flex-col max-w-lg ${item.isViewer ? 'items-end' : 'items-start'}`}>
                                        <div className="flex items-center gap-2 mb-2 px-1">
                                            <span className="text-xs font-bold text-slate-700">{item.user}</span>
                                            <span className="text-[10px] text-slate-400 font-medium">— {item.exactTime}</span>
                                        </div>
                                        <div className={`p-4 rounded-3xl shadow-sm text-sm ${
                                            item.isViewer ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'
                                        }`}>
                                            {item.text}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Action Bar */}
                <div className="p-6 bg-white/50 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto flex items-center bg-white border border-slate-200 rounded-2xl p-2 shadow-lg">
                        <input type="text" placeholder="Update story status or add comment..." className="flex-1 border-none focus:ring-0 text-sm px-4" />
                        <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-bold text-sm">Send</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;