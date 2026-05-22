// import React, { useState, useRef } from 'react';
// import {
//   Network,
//   CheckCircle2,
//   Clock,
//   AlertTriangle,
//   RefreshCw,
//   Move,
//   ArrowRight,
//   Layers,
//   Sparkles
// } from 'lucide-react';
//
// // Dataset nodes mapped with default spatial coordinates for native canvas dragging
// const initialDatasets = [
//   {
//     id: 'ds-pb',
//     name: 'pb synthetics trs e15',
//     phase: 'Ingestion',
//     x: 60, y: 300,
//     slices: [
//       { id: 'pb-s1', num: 1, status: 'success' },
//       { id: 'pb-s2', num: 2, status: 'success' },
//       { id: 'pb-s3', num: 3, status: 'failed' },
//       { id: 'pb-s4', num: 4, status: 'inprogress' },
//       { id: 'pb-s5', num: 5, status: 'pending' },
//     ],
//     nextDatasets: ['ds-slsline']
//   },
//   {
//     id: 'ds-intercompany-fx',
//     name: 'calc intercompany fx adjustment e15',
//     phase: 'Ingestion',
//     x: 60, y: 80,
//     slices: [{ id: 'fx-s1', num: 1, status: 'success' }],
//     nextDatasets: ['ds-secured', 'ds-cashflow']
//   },
//   {
//     id: 'ds-ia-downgrade',
//     name: 'ia upon downgrade position slsline',
//     phase: 'Ingestion',
//     x: 60, y: 520,
//     slices: [{ id: 'ia-s1', num: 1, status: 'success' }],
//     nextDatasets: ['ds-cashflow']
//   },
//   {
//     id: 'ds-slsline',
//     name: 'slsline calculator e15',
//     phase: 'Processing',
//     x: 460, y: 300,
//     slices: Array.from({ length: 30 }, (_, i) => ({
//       id: `sls-s${i + 1}`,
//       num: i + 1,
//       status: i === 13 ? 'failed' : i % 6 === 0 ? 'inprogress' : i % 9 === 0 ? 'pending' : 'success'
//     })),
//     nextDatasets: ['ds-secured']
//   },
//   {
//     id: 'ds-secured',
//     name: 'calc secured vs unsecured e15',
//     phase: 'Processing',
//     x: 860, y: 200,
//     slices: [
//       { id: 'su-s1', num: 1, status: 'success' },
//       { id: 'su-s2', num: 2, status: 'inprogress' },
//     ],
//     nextDatasets: ['ds-cashflow', 'ds-aws']
//   },
//   {
//     id: 'ds-cashflow',
//     name: 'contractual cash flow results',
//     phase: 'Delivery',
//     x: 1260, y: 80,
//     slices: Array.from({ length: 8 }, (_, i) => ({ id: `ccf-s${i + 1}`, num: i + 1, status: 'pending' })),
//     nextDatasets: ['ds-results']
//   },
//   {
//     id: 'ds-aws',
//     name: 'sls aws details extended',
//     phase: 'Delivery',
//     x: 1260, y: 440,
//     slices: Array.from({ length: 6 }, (_, i) => ({ id: `aws-s${i + 1}`, num: i + 1, status: 'pending' })),
//     nextDatasets: ['ds-results']
//   },
//   {
//     id: 'ds-results',
//     name: 'intercompany results',
//     phase: 'Delivery',
//     x: 1660, y: 260,
//     slices: Array.from({ length: 5 }, (_, i) => ({ id: `res-s${i + 1}`, num: i + 1, status: 'pending' })),
//     nextDatasets: []
//   }
// ];
//
// // Contextual sub-dependencies representing precise slice-to-slice trigger targets
// const sliceCrossDependencies = {
//   'pb-s1': { 'ds-slsline': ['sls-s1', 'sls-s2', 'sls-s3'] },
//   'pb-s3': { 'ds-slsline': ['sls-s14'] },
//   'fx-s1': { 'ds-secured': ['su-s1'], 'ds-cashflow': ['ccf-s1', 'ccf-s2'] },
//   'sls-s1': { 'ds-secured': ['su-s1'] },
//   'sls-s14': { 'ds-secured': ['su-s2'] },
//   'su-s1': { 'ds-cashflow': ['ccf-s1', 'ccf-s2', 'ccf-s3'], 'ds-aws': ['aws-s1'] },
//   'su-s2': { 'ds-aws': ['aws-s4', 'aws-s5'] }
// };
//
// export default function SmoothFlowCanvas() {
//   const [datasets, setDatasets] = useState(initialDatasets);
//   const [hoveredNode, setHoveredNode] = useState(null);
//   const [popoverPos, setPopoverPos] = useState({ x: 0, y: 0 });
//   const [selectedSlice, setSelectedSlice] = useState(null);
//
//   // Real-time Drag-and-Drop state tracking
//   const [draggingNodeId, setDraggingNodeId] = useState(null);
//   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
//
//   const canvasRef = useRef(null);
//   const nodeRefs = useRef({});
//
//   const handleMouseDown = (id, e) => {
//     if (e.target.closest('.slice-interactive-item')) return;
//     setDraggingNodeId(id);
//     const targetNode = datasets.find(d => d.id === id);
//     setDragOffset({
//       x: e.clientX - targetNode.x,
//       y: e.clientY - targetNode.y
//     });
//   };
//
//   const handleMouseMove = (e) => {
//     if (!draggingNodeId) return;
//     setDatasets(prev => prev.map(node => {
//       if (node.id === draggingNodeId) {
//         return { ...node, x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y };
//       }
//       return node;
//     }));
//   };
//
//   const handleMouseUp = () => {
//     setDraggingNodeId(null);
//   };
//
//   const handleNodeMouseEnter = (id) => {
//     if (draggingNodeId) return;
//     const rect = nodeRefs.current[id].getBoundingClientRect();
//     const canvasRect = canvasRef.current.getBoundingClientRect();
//
//     setHoveredNode(id);
//     setPopoverPos({
//       x: rect.left - canvasRect.left + rect.width / 2,
//       y: rect.top - canvasRect.top - 12
//     });
//   };
//
//   const getProgressStats = (slices) => {
//     const total = slices.length;
//     const success = slices.filter(s => s.status === 'success').length;
//     const failed = slices.filter(s => s.status === 'failed').length;
//     const inprogress = slices.filter(s => s.status === 'inprogress').length;
//     const percentage = Math.round((success / total) * 100);
//     return { total, success, failed, inprogress, percentage };
//   };
//
//   const activeDownstreamImpacts = selectedSlice ? sliceCrossDependencies[selectedSlice.id] || {} : {};
//   const isDatasetImpacted = (dsId) => selectedSlice && Object.keys(activeDownstreamImpacts).includes(dsId);
//
//   return (
//     <div className="w-full h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col overflow-hidden select-none relative">
//
//       {/* Light Glass Navigation Dashboard */}
//       <header className="h-14 border-b border-slate-200/80 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between z-30 shrink-0 shadow-sm">
//         <div className="flex items-center space-x-3">
//           <div className="bg-slate-900 text-white p-1.5 rounded-lg">
//             <Network className="w-4 h-4" />
//           </div>
//           <div>
//             <h1 className="text-xs font-bold tracking-wider text-slate-900 uppercase font-mono">Pipeline Analyzer</h1>
//           </div>
//         </div>
//
//         {selectedSlice && (
//           <div className="bg-indigo-50 border border-indigo-100 px-4 py-1 rounded-full flex items-center gap-3 shadow-inner animate-in fade-in zoom-in-95 duration-150">
//             <span className="text-[11px] font-mono text-indigo-700">
//               Active Downstream Highway: <strong>{selectedSlice.parentDataset} ➔ Slice #{selectedSlice.num}</strong>
//             </span>
//             <button
//               onClick={() => setSelectedSlice(null)}
//               className="text-[10px] bg-white hover:bg-indigo-100 text-indigo-600 font-semibold px-2 py-0.5 rounded-full border border-indigo-200 transition"
//             >
//               Reset View
//             </button>
//           </div>
//         )}
//
//         <div className="flex items-center space-x-5 text-[11px] text-slate-400 font-mono">
//           <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 block"/> Success</div>
//           <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500 block"/> Failed</div>
//           <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 block animate-spin"/> Running</div>
//         </div>
//       </header>
//
//       {/* Workspace Interactive Canvas Layer */}
//       <div
//         ref={canvasRef}
//         onMouseMove={handleMouseMove}
//         onMouseUp={handleMouseUp}
//         className="flex-1 overflow-auto bg-[radial-gradient(#e2e8f0_1.2px,transparent_1.2px)] [background-size:28px_28px] relative p-12"
//       >
//
//         {/* SVG Viewport Container Layer - Generating Airflow Curved Bezier Lineage Paths */}
//         <svg className="absolute inset-0 w-[2600px] h-[1600px] pointer-events-none z-0">
//           <defs>
//             <marker id="arrow-smooth" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
//               <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#cbd5e1" />
//             </marker>
//             <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
//               <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#4f46e5" />
//             </marker>
//           </defs>
//
//           {datasets.map((sourceNode) =>
//             sourceNode.nextDatasets.map((targetId) => {
//               const targetNode = datasets.find(d => d.id === targetId);
//               if (!targetNode) return null;
//
//               // Calculate connection ports anchors dynamically
//               const startX = sourceNode.x + 288; // Dynamic positioning boundary width
//               const startY = sourceNode.y + 36;
//               const endX = targetNode.x;
//               const endY = targetNode.y + 36;
//
//               // Dynamic Bezier Control Points for organic Airflow curves
//               const controlOffset = Math.min(150, (endX - startX) * 0.5);
//               const cp1X = startX + controlOffset;
//               const cp1Y = startY;
//               const cp2X = endX - controlOffset;
//               const cp2Y = endY;
//
//               const isPathActive = selectedSlice && (
//                 sourceNode.id === selectedSlice.datasetId && activeDownstreamImpacts[targetId]
//               );
//
//               return (
//                 <g key={`${sourceNode.id}-${targetId}`}>
//                   <path
//                     d={`M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`}
//                     fill="none"
//                     stroke={isPathActive ? '#4f46e5' : '#cbd5e1'}
//                     strokeWidth={isPathActive ? 2.5 : 1.5}
//                     markerEnd={isPathActive ? "url(#arrow-active)" : "url(#arrow-smooth)"}
//                     className="transition-all duration-200"
//                   />
//                 </g>
//               );
//             })
//           )}
//         </svg>
//
//         {/* Draggable Dataset Processing Nodes */}
//         {datasets.map((dataset) => {
//           const { total, success, percentage, failed, inprogress } = getProgressStats(dataset.slices);
//           const isImpacted = isDatasetImpacted(dataset.id);
//           const isDimmed = selectedSlice && !isImpacted && selectedSlice.datasetId !== dataset.id;
//
//           return (
//             <div
//               key={dataset.id}
//               ref={el => nodeRefs.current[dataset.id] = el}
//               style={{ top: `${dataset.y}px`, left: `${dataset.x}px` }}
//               onMouseEnter={() => handleNodeMouseEnter(dataset.id)}
//               className={`absolute w-72 bg-white border rounded-xl shadow-sm transition-all duration-200 z-10 ${
//                 draggingNodeId === dataset.id ? 'cursor-grabbing shadow-xl border-slate-400 scale-[1.01]' : ''
//               } ${isImpacted ? 'border-indigo-500 ring-4 ring-indigo-500/10 shadow-md' : failed > 0 ? 'border-rose-200 shadow-sm shadow-rose-50' : 'border-slate-200'} ${
//                 isDimmed ? 'opacity-25 filter grayscale' : 'opacity-100'
//               }`}
//             >
//               {/* Header Drag Handle container */}
//               <div
//                 onMouseDown={(e) => handleMouseDown(dataset.id, e)}
//                 className="px-4 py-3 bg-slate-50/50 rounded-t-xl border-b border-slate-100 cursor-grab flex items-center justify-between"
//               >
//                 <div className="flex items-center space-x-2 truncate pr-2">
//                   <Move className="w-3 h-3 text-slate-400 shrink-0" />
//                   <span className="text-[11px] font-mono font-bold text-slate-700 tracking-tight truncate">
//                     {dataset.name}
//                   </span>
//                 </div>
//                 <span className="text-[10px] font-mono font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200/60 shrink-0">
//                   {success}/{total}
//                 </span>
//               </div>
//
//               {/* Progress Tracker Fill Bar */}
//               <div className="h-1.5 w-full bg-slate-100 overflow-hidden relative rounded-b-xl">
//                 <div
//                   className={`h-full transition-all duration-500 ${failed > 0 ? 'bg-rose-500' : inprogress > 0 ? 'bg-amber-400' : 'bg-emerald-500'}`}
//                   style={{ width: `${percentage}%` }}
//                 />
//               </div>
//
//               {/* CONTEXTUAL FEEDBACK TRAY: Renders inline underneath the node when tracking slice data paths */}
//               {isImpacted && (
//                 <div className="px-3.5 py-2.5 bg-indigo-50/50 border-t border-indigo-100/80 rounded-b-xl flex items-center justify-between animate-in slide-in-from-top-1 duration-150">
//                   <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-wider font-mono">Targets:</span>
//                   <div className="flex flex-wrap gap-1 justify-end max-w-[170px]">
//                     {activeDownstreamImpacts[dataset.id].map(sliceNumId => (
//                       <span key={sliceNumId} className="bg-indigo-600 text-[10px] font-mono font-bold text-white px-2 py-0.5 rounded shadow-sm border border-indigo-500">
//                         #{sliceNumId.split('-s')[1]}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//
//         {/* FLOATING HOVER PREDICTIVE POPOVER INSPECTOR */}
//         {hoveredNode && !draggingNodeId && (
//           <div
//             onMouseLeave={() => setHoveredNode(null)}
//             style={{ left: `${popoverPos.x}px`, top: `${popoverPos.y}px` }}
//             className="absolute z-50 w-76 bg-white border border-slate-200 rounded-xl shadow-xl p-4 -translate-x-1/2 -translate-y-full animate-in fade-in zoom-in-95 duration-100"
//           >
//             {(() => {
//               const currentDs = datasets.find(d => d.id === hoveredNode);
//               const stats = getProgressStats(currentDs.slices);
//
//               return (
//                 <div className="space-y-3.5">
//                   <div>
//                     <h4 className="text-[11px] font-mono font-bold text-slate-800 truncate mb-1.5">{currentDs.name}</h4>
//                     <div className="grid grid-cols-3 gap-1 text-center text-[10px] font-mono">
//                       <div className="bg-emerald-50 border border-emerald-100/80 py-0.5 rounded text-emerald-700 font-medium">
//                         Done: {stats.success}
//                       </div>
//                       <div className="bg-rose-50 border border-rose-100/80 py-0.5 rounded text-rose-700 font-medium">
//                         Fail: {stats.failed}
//                       </div>
//                       <div className="bg-amber-50 border border-amber-100/80 py-0.5 rounded text-amber-700 font-medium">
//                         Run: {stats.inprogress}
//                       </div>
//                     </div>
//                   </div>
//
//                   {/* Scrollable Slice Window List Engine */}
//                   <div className="space-y-1 max-h-48 overflow-y-auto pr-0.5 border-t border-slate-100 pt-2 custom-scrollbar">
//                     {currentDs.slices.map((slice) => {
//                       const isSelected = selectedSlice?.id === slice.id;
//                       return (
//                         <div
//                           key={slice.id}
//                           onClick={() => setSelectedSlice({ ...slice, datasetId: currentDs.id, parentDataset: currentDs.name })}
//                           className={`slice-interactive-item group flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-all ${
//                             isSelected ? 'bg-indigo-600 text-white border border-indigo-700 shadow-sm' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
//                           }`}
//                         >
//                           <div className="flex items-center space-x-2">
//                             <span className={`w-4.5 h-4.5 flex items-center justify-center rounded text-[9px] font-mono font-bold border ${
//                               isSelected ? 'bg-indigo-700 border-indigo-500 text-white' : 'bg-white border-slate-200 text-slate-500'
//                             }`}>
//                               {slice.num}
//                             </span>
//                             <span className={`text-[10px] font-mono truncate max-w-[130px] ${isSelected ? 'text-indigo-50' : 'text-slate-600'}`}>
//                               partition_chunk
//                             </span>
//                           </div>
//
//                           <div className="flex items-center space-x-1 shrink-0">
//                             {slice.status === 'success' && <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-500'}`} />}
//                             {slice.status === 'failed' && <AlertTriangle className={`w-3.5 h-3.5 ${isSelected ? 'text-white animate-pulse' : 'text-rose-500'}`} />}
//                             {slice.status === 'inprogress' && <RefreshCw className={`w-3.5 h-3.5 animate-spin ${isSelected ? 'text-white' : 'text-amber-500'}`} />}
//                             {slice.status === 'pending' && <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               );
//             })()}
//           </div>
//         )}
//
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import {
  GitCommit,
  GitMerge,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Zap,
  Sliders,
  Filter,
  ArrowRight,
  Maximize2
} from 'lucide-react';

// Generates 30 mock slices dynamically to prove the design handles scale effortlessly
const generateSlices = (count, prefix, failIndices = [], rerunIndices = []) => {
  return Array.from({ length: count }, (_, i) => {
    const id = `${prefix}-s${i + 1}`;
    let status = 'success';
    if (failIndices.includes(i + 1)) status = 'failed';
    else if (rerunIndices.includes(i + 1)) status = 'rerun';
    return { id, num: i + 1, name: `${prefix} partition _chunk_0${i + 1}`, status };
  });
};

const initialPipelineData = [
  {
    id: 'ds-pb',
    name: 'pb synthetics trs e15',
    category: 'Ingestion Sources',
    slices: generateSlices(5, 'pb', [3], [5]),
    triggers: ['ds-slsline']
  },
  {
    id: 'ds-intercompany-fx',
    name: 'calc intercompany fx adjustment e15',
    category: 'Ingestion Sources',
    slices: generateSlices(1, 'fx'),
    triggers: ['ds-secured', 'ds-cashflow']
  },
  {
    id: 'ds-ia-downgrade',
    name: 'ia upon downgrade position slsline',
    category: 'Ingestion Sources',
    slices: generateSlices(1, 'ia'),
    triggers: ['ds-cashflow']
  },
  {
    id: 'ds-slsline',
    name: 'slsline calculator e15',
    category: 'Processing Engines',
    // Proving scale: Here are 30 slices handled gracefully
    slices: generateSlices(30, 'sls', [14, 22], [9]),
    triggers: ['ds-secured']
  },
  {
    id: 'ds-secured',
    name: 'calc secured vs unsecured e15',
    category: 'Processing Engines',
    slices: generateSlices(2, 'su', [], [2]),
    triggers: ['ds-cashflow', 'ds-aws']
  },
  {
    id: 'ds-cashflow',
    name: 'contractual cash flow results',
    category: 'Analytics & Delivery',
    slices: generateSlices(6, 'ccf'),
    triggers: ['ds-results']
  },
  {
    id: 'ds-aws',
    name: 'sls aws details extended',
    category: 'Analytics & Delivery',
    slices: generateSlices(5, 'aws'),
    triggers: ['ds-results']
  },
  {
    id: 'ds-results',
    name: 'intercompany results',
    category: 'Analytics & Delivery',
    slices: generateSlices(5, 'res'),
    triggers: []
  }
];

export default function StreamlinedPipeline() {
  const [pipeline, setPipeline] = useState(initialPipelineData);
  const [expandedDatasets, setExpandedDatasets] = useState({ 'ds-slsline': true }); // default open the big one
  const [activeSlice, setActiveSlice] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (id) => {
    setExpandedDatasets(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusSummary = (slices) => {
    const failed = slices.filter(s => s.status === 'failed').length;
    const rerun = slices.filter(s => s.status === 'rerun').length;
    return { failed, rerun, total: slices.length };
  };

  // UI state color map
  const statusConfig = {
    success: { icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />, bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    failed: { icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />, bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse' },
    rerun: { icon: <AlertCircle className="w-3.5 h-3.5 text-amber-400" />, bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' }
  };

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-100 font-sans antialiased flex flex-col overflow-hidden">

      {/* Top Professional Control Bar */}
      <header className="h-16 border-b border-slate-900 bg-slate-900/20 backdrop-blur px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <Zap className="w-5 h-5 text-indigo-400" />
          <h1 className="text-sm font-semibold tracking-wider text-slate-200 uppercase">Linear Flow Control Deck</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Find slice target across lifecycle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/60 border border-slate-800/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-300 w-72 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          <button className="bg-slate-900 hover:bg-slate-800 border border-slate-800 p-2 rounded-lg text-slate-400 hover:text-slate-200 transition">
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Split Interface Workspace */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left Side: Unified Linear Pipeline Engine */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-slate-950 to-slate-900/40">

          {/* Grouped by Logical Architectural Layer */}
          {['Ingestion Sources', 'Processing Engines', 'Analytics & Delivery'].map((category) => (
            <div key={category} className="space-y-3">
              <h2 className="text-[10px] font-bold text-slate-500 tracking-widest uppercase pl-2">
                {category}
              </h2>

              <div className="space-y-2">
                {pipeline
                  .filter(ds => ds.category === category)
                  .map((dataset) => {
                    const isExpanded = expandedDatasets[dataset.id];
                    const summary = getStatusSummary(dataset.slices);

                    return (
                      <div
                        key={dataset.id}
                        className={`border rounded-xl transition-all duration-200 ${
                          isExpanded ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-900/10 border-slate-900/60 hover:border-slate-800'
                        }`}
                      >
                        {/* Summary Row (Simplifies everything to 1 line by default) */}
                        <div
                          onClick={() => toggleExpand(dataset.id)}
                          className="px-5 py-3.5 flex items-center justify-between cursor-pointer select-none"
                        >
                          <div className="flex items-center space-x-4 min-w-[300px]">
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                            <div>
                              <h3 className="text-xs font-mono font-semibold text-slate-200 tracking-tight">{dataset.name}</h3>
                              <p className="text-[10px] text-slate-500 mt-0.5">Triggers downstream: <span className="text-slate-400 font-mono">{dataset.triggers.join(', ') || 'None (Sink)'}</span></p>
                            </div>
                          </div>

                          {/* Simplified Aggregation Pill */}
                          <div className="flex items-center space-x-3">
                            <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                              {summary.total} Slices
                            </span>
                            {summary.failed > 0 && (
                              <span className="bg-rose-500/10 text-rose-400 text-[10px] font-medium px-2 py-0.5 rounded-full border border-rose-500/20">
                                {summary.failed} Failed
                              </span>
                            )}
                            {summary.rerun > 0 && (
                              <span className="bg-amber-500/10 text-amber-400 text-[10px] font-medium px-2 py-0.5 rounded-full border border-amber-500/20">
                                {summary.rerun} Running
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Expandable Deep-Dive Area: Handles 30+ slices seamlessly */}
                        {isExpanded && (
                          <div className="px-5 pb-5 pt-1 border-t border-slate-900 bg-slate-950/40 rounded-b-xl">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 mt-3">
                              {dataset.slices.map((slice) => {
                                const isSelected = activeSlice?.id === slice.id;
                                const config = statusConfig[slice.status];

                                return (
                                  <div
                                    key={slice.id}
                                    onClick={() => setActiveSlice({ ...slice, parentDataset: dataset.name, triggers: dataset.triggers })}
                                    className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${config.bg} ${
                                      isSelected ? 'ring-2 ring-indigo-500 border-transparent scale-[1.02]' : 'hover:scale-[1.01]'
                                    }`}
                                  >
                                    <div className="flex items-center space-x-2 truncate">
                                      <span className="text-[11px] font-mono font-bold bg-slate-950/80 px-1.5 py-0.5 rounded border border-slate-800">
                                        {slice.num}
                                      </span>
                                      <span className="text-[10px] font-mono tracking-tight truncate text-slate-300">
                                        {slice.name}
                                      </span>
                                    </div>
                                    <div className="shrink-0 pl-1">
                                      {config.icon}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: The Smart Data-Flow Pipeline Auditor */}
        <div className="w-80 border-l border-slate-900 bg-slate-900/10 backdrop-blur-md p-6 flex flex-col justify-between shrink-0">
          {activeSlice ? (
            <div className="space-y-6">
              <div>
                <span className="text-[9px] font-bold tracking-widest text-indigo-400 uppercase block mb-1">
                  Active Dependency Trace
                </span>
                <h3 className="text-xs font-mono font-bold text-white break-words bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  {activeSlice.name}
                </h3>
              </div>

              {/* Step-by-Step Chain Flow */}
              <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-800">

                {/* Step 1: Parent origin */}
                <div className="flex items-start space-x-3 relative">
                  <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 z-10 shrink-0 font-mono">1</div>
                  <div>
                    <h4 className="text-[11px] font-semibold text-slate-400">Parent Data Feed</h4>
                    <p className="text-[11px] font-mono text-slate-300 truncate w-48">{activeSlice.parentDataset}</p>
                  </div>
                </div>

                {/* Step 2: The active sub-unit */}
                <div className="flex items-start space-x-3 relative">
                  <div className="w-6 h-6 rounded-full bg-indigo-950 border border-indigo-500 flex items-center justify-center text-[10px] text-indigo-400 font-bold z-10 shrink-0 font-mono">2</div>
                  <div>
                    <h4 className="text-[11px] font-semibold text-indigo-400">Current Processing Slice</h4>
                    <p className="text-[11px] font-mono text-slate-200">Slice #{activeSlice.num} ({activeSlice.status})</p>
                  </div>
                </div>

                {/* Step 3: Target Downstreams */}
                <div className="flex items-start space-x-3 relative">
                  <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] text-slate-400 z-10 shrink-0 font-mono">3</div>
                  <div>
                    <h4 className="text-[11px] font-semibold text-slate-400">Triggers Downstream</h4>
                    <div className="space-y-1 mt-1">
                      {activeSlice.triggers.length > 0 ? (
                        activeSlice.triggers.map(t => (
                          <span key={t} className="block text-[10px] font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800/60 text-slate-400 max-w-[180px] truncate">
                            {t}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-600 italic">End of workflow stream.</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta Stats Panel */}
              <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-xl space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Run Type Profile</span>
                  <span className="font-mono text-slate-300">Prelim & Final Match</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Isolation Status</span>
                  <span className="text-emerald-400 font-medium">Ready for Re-run</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-600">
              <GitMerge className="w-5 h-5 mb-2 text-slate-800" />
              <p className="text-xs">Click any slice inside an expanded dataset to map its directional trigger routing instantly.</p>
            </div>
          )}

          {activeSlice && (
            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-xl text-xs transition duration-150 flex items-center justify-center space-x-1.5 shadow-lg shadow-indigo-600/10">
              <span>Execute Isolated Slice Force Run</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}