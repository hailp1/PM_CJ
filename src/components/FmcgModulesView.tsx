'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Sparkles,
  ShoppingBag,
  Navigation,
  Truck,
  CheckCircle,
  AlertTriangle,
  Play,
  ArrowRight,
  TrendingUp,
  MapPin
} from 'lucide-react';

type FmcgSubModule = 'stage-gate' | 'trade' | 'sales' | 'supply-chain';

export default function FmcgModulesView() {
  const { projects, activeProjectId, tasks, setTasks, logAction, currentUser } = useApp();
  const [activeSub, setActiveSub] = useState<FmcgSubModule>('stage-gate');

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Stage gate specific checklist status
  const currentGate = activeProject.stageGate || 'Idea';
  const readinessScore = activeProject.launchReadinessScore || 0;

  const handleAdvanceGate = () => {
    if (currentUser.role === 'Viewer') return;
    const gates: ('Idea' | 'Feasibility' | 'Development' | 'Launch' | 'Post-launch')[] = [
      'Idea',
      'Feasibility',
      'Development',
      'Launch',
      'Post-launch'
    ];
    const currentIdx = gates.indexOf(currentGate);
    if (currentIdx < gates.length - 1) {
      const nextGate = gates[currentIdx + 1];
      activeProject.stageGate = nextGate;
      activeProject.launchReadinessScore = Math.min(100, readinessScore + 15);
      logAction(activeProject.id, `Advanced Stage-Gate to: ${nextGate}`);
      alert(`Project advanced to Stage-Gate: ${nextGate}`);
    }
  };

  const isReadOnly = currentUser.role === 'Viewer';

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-[calc(100vh-64px)] w-full">
      {/* Title Header */}
      <div className="flex justify-between items-center border-b border-cj-gray-200/80 pb-4">
        <div>
          <span className="text-[10px] text-cj-red font-bold uppercase tracking-wider block bg-cj-red/5 px-2 py-0.5 rounded-full w-max">
            CJ Foods FMCG Operational Modules
          </span>
          <h1 className="text-xl font-extrabold text-cj-gray-800 mt-1">FMCG Execution Center</h1>
          <p className="text-xs text-gray-500">Track operations specific to FMCG: Stage-Gate workflows, Trade Marketing POSMs, Route-to-Market (RTM), and Supply Chain logistics.</p>
        </div>

        {/* Sub Module Selector */}
        <div className="flex items-center bg-white border border-cj-gray-200 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveSub('stage-gate')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeSub === 'stage-gate' ? 'bg-cj-blue text-white shadow-sm' : 'text-gray-500 hover:text-cj-gray-800'
            }`}
          >
            <Sparkles className="h-4.5 w-4.5" />
            <span>Stage-Gate Launch</span>
          </button>
          
          <button
            onClick={() => setActiveSub('trade')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeSub === 'trade' ? 'bg-cj-blue text-white shadow-sm' : 'text-gray-500 hover:text-cj-gray-800'
            }`}
          >
            <ShoppingBag className="h-4.5 w-4.5" />
            <span>Trade Marketing</span>
          </button>

          <button
            onClick={() => setActiveSub('sales')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeSub === 'sales' ? 'bg-cj-blue text-white shadow-sm' : 'text-gray-500 hover:text-cj-gray-800'
            }`}
          >
            <Navigation className="h-4.5 w-4.5" />
            <span>Sales & RTM</span>
          </button>

          <button
            onClick={() => setActiveSub('supply-chain')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
              activeSub === 'supply-chain' ? 'bg-cj-blue text-white shadow-sm' : 'text-gray-500 hover:text-cj-gray-800'
            }`}
          >
            <Truck className="h-4.5 w-4.5" />
            <span>Supply Chain</span>
          </button>
        </div>
      </div>

      {activeSub === 'stage-gate' && (
        <div className="space-y-6 animate-fade-in">
          {/* Stage Gate Steps Diagram */}
          <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/80 shadow-soft">
            <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider mb-6">Stage-Gate Workflow</h3>
            
            <div className="flex items-center justify-between w-full max-w-4xl mx-auto relative px-4">
              {/* Connector line */}
              <div className="absolute top-[18px] left-[5%] right-[5%] h-1 bg-cj-gray-200 z-0" />
              
              {/* Steps */}
              {['Idea', 'Feasibility', 'Development', 'Launch', 'Post-launch'].map((gateName, index) => {
                const gates = ['Idea', 'Feasibility', 'Development', 'Launch', 'Post-launch'];
                const isCurrent = currentGate === gateName;
                const isPast = gates.indexOf(currentGate) > index;

                return (
                  <div key={gateName} className="flex flex-col items-center z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-all border-2 ${
                      isCurrent ? 'bg-cj-red text-white border-cj-red ring-4 ring-cj-red/10 scale-110' :
                      isPast ? 'bg-cj-blue text-white border-cj-blue' :
                      'bg-white text-gray-400 border-cj-gray-200'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`text-[10px] font-bold mt-2 ${isCurrent ? 'text-cj-red font-black' : 'text-gray-500'}`}>
                      {gateName}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end mt-8 border-t pt-4">
              {!isReadOnly && currentGate !== 'Post-launch' && (
                <button
                  onClick={handleAdvanceGate}
                  className="flex items-center space-x-1 px-4 py-2 bg-cj-red hover:bg-red-700 text-white rounded-lg font-bold text-xs shadow cursor-pointer transition-colors"
                >
                  <span>Approve & Advance Gate</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Launch Readiness and Checklists */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Readiness Gauge */}
            <div className="bg-white p-5 rounded-2xl border border-cj-gray-200 shadow-soft flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider mb-2">Launch Readiness Score</h3>
                <p className="text-[10px] text-gray-500">Aggregated task checklist score across all department workstreams.</p>
              </div>

              <div className="flex items-center justify-center py-6">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  {/* Gauge Arc SVG */}
                  <svg className="absolute w-full h-full transform -rotate-90">
                    <circle cx="72" cy="72" r="58" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                    <circle
                      cx="72"
                      cy="72"
                      r="58"
                      fill="none"
                      stroke="url(#cj-gauge-gradient)"
                      strokeWidth="10"
                      strokeDasharray="364.4"
                      strokeDashoffset={364.4 - (364.4 * readinessScore) / 100}
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="cj-gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0055a5" />
                        <stop offset="50%" stopColor="#e21e26" />
                        <stop offset="100%" stopColor="#f37021" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="text-center z-10">
                    <span className="text-3xl font-black text-cj-gray-800">{readinessScore}%</span>
                    <span className="text-[9px] font-bold text-gray-400 block mt-0.5 uppercase tracking-wider">Ready to Market</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist elements */}
            <div className="bg-white p-5 rounded-2xl border border-cj-gray-200 shadow-soft md:col-span-2 space-y-4">
              <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider">Active Gate Deliverables Checklist</h3>
              
              <div className="space-y-2.5">
                {[
                  { text: 'Final localized recipe sensory panel scoring validation', done: true, dept: 'R&D' },
                  { text: 'Mockup packaging layout validation by CJ Brand standards', done: true, dept: 'Marketing' },
                  { text: 'Supplier contract commitments for cheddar cheese imports', done: false, dept: 'Procurement' },
                  { text: 'Warehouse cold chain temperature certification testing', done: false, dept: 'Supply Chain' },
                  { text: 'Food Safety Bureau (ATVSTP) dossier registration submission', done: false, dept: 'Regulatory' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-cj-gray-100/40 border border-cj-gray-200/50 rounded-xl">
                    <div className="flex items-center space-x-2.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${item.done ? 'bg-green-500' : 'bg-cj-orange animate-pulse'}`} />
                      <span className="text-xs text-cj-gray-800 font-semibold">{item.text}</span>
                    </div>
                    <span className="text-[9px] font-black text-cj-blue bg-cj-blue/5 px-2 py-0.5 rounded uppercase">
                      {item.dept}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {activeSub === 'trade' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {/* POSM Tracker */}
          <div className="bg-white p-5 rounded-2xl border border-cj-gray-200 shadow-soft md:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider">POSM Production & Rollout Status</h3>
            
            <div className="space-y-3.5">
              {[
                { name: 'Festive Tet Booth Stands', target: 500, done: 120, status: 'In Production' },
                { name: 'Supermarket Hanging Mobiles', target: 150, done: 150, status: 'Completed' },
                { name: 'A-Frame Board Displays', target: 300, done: 80, status: 'Assembly' }
              ].map((posm, idx) => {
                const progress = Math.round((posm.done / posm.target) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-cj-gray-800">{posm.name}</span>
                      <span className="text-gray-500">{posm.done}/{posm.target} Units ({progress}%)</span>
                    </div>
                    <div className="w-full bg-cj-gray-100 h-2 rounded-full overflow-hidden flex">
                      <div className="bg-cj-blue h-full rounded-full" style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trade Budget */}
          <div className="bg-white p-5 rounded-2xl border border-cj-gray-200 shadow-soft flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider mb-1">Trade Campaign Budget</h3>
              <p className="text-[10px] text-gray-500">Tet activation allocation limits.</p>
            </div>
            
            <div className="space-y-4 py-3">
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Marketing Fund Allocation</span>
                <span className="text-2xl font-black text-cj-gray-800 block">4,200M VND</span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Burn Rate Index</span>
                <span className="text-lg font-bold text-green-600 block">8.2% Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSub === 'sales' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {/* Route Mapping */}
          <div className="bg-white p-5 rounded-2xl border border-cj-gray-200 shadow-soft md:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider flex items-center">
              <MapPin className="h-4.5 w-4.5 text-cj-red mr-1.5" />
              <span>GT Route Optimisation - Mekong delta</span>
            </h3>

            {/* Mock Route Map */}
            <div className="h-60 bg-cj-gray-100 rounded-xl border relative overflow-hidden flex items-center justify-center">
              {/* Draw dummy nodes */}
              <div className="absolute w-4 h-4 bg-cj-blue rounded-full border-2 border-white top-12 left-24 flex items-center justify-center text-[8px] font-bold text-white">1</div>
              <div className="absolute w-4 h-4 bg-cj-red rounded-full border-2 border-white top-28 left-48 flex items-center justify-center text-[8px] font-bold text-white">2</div>
              <div className="absolute w-4 h-4 bg-cj-orange rounded-full border-2 border-white top-16 left-64 flex items-center justify-center text-[8px] font-bold text-white">3</div>
              <div className="absolute w-3 h-3 bg-gray-400 rounded-full border border-white bottom-8 left-16" />
              <div className="absolute w-3 h-3 bg-gray-400 rounded-full border border-white bottom-12 right-24" />

              <svg className="absolute inset-0 w-full h-full text-gray-300" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="24" y1="12" x2="48" y2="28" stroke="#0055a5" strokeWidth="0.8" />
                <line x1="48" y1="28" x2="64" y2="16" stroke="#e21e26" strokeWidth="0.8" />
                <line x1="24" y1="12" x2="16" y2="60" stroke="#cccccc" strokeWidth="0.5" />
              </svg>

              <span className="text-[10px] text-gray-500 font-bold bg-white border px-2 py-1 rounded shadow-sm z-10 flex items-center space-x-1">
                <span>Distributor Delivery Route Optimization (Active)</span>
              </span>
            </div>
          </div>

          {/* SFE Performance */}
          <div className="bg-white p-5 rounded-2xl border border-cj-gray-200 shadow-soft space-y-4">
            <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider">Sales Force (SFE) Productivity</h3>
            
            <div className="space-y-4 text-xs font-medium">
              <div className="p-3 bg-cj-gray-100/40 rounded-xl">
                <span className="text-gray-500 text-[10px] block font-bold uppercase">Call Compliance Rate</span>
                <span className="text-lg font-black text-cj-blue">92.4%</span>
              </div>

              <div className="p-3 bg-cj-gray-100/40 rounded-xl">
                <span className="text-gray-500 text-[10px] block font-bold uppercase">New Outlet Listings</span>
                <span className="text-lg font-black text-green-600">+124 Supermarkets</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSub === 'supply-chain' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          {/* Warehouse pallets */}
          <div className="bg-white p-5 rounded-2xl border border-cj-gray-200 shadow-soft space-y-4">
            <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider">Warehouse Capacity Mapping</h3>
            <div className="flex items-center justify-between text-xs font-bold p-3 bg-cj-gray-100/40 rounded-xl">
              <span>Hiep Phuoc Pallet Capacity</span>
              <span className="text-cj-blue">1,850/2,500 slots (74% Load)</span>
            </div>
            <div className="w-full bg-cj-gray-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-cj-blue h-full rounded-full" style={{ width: '74%' }} />
            </div>
          </div>

          {/* Logistics Tracking */}
          <div className="bg-white p-5 rounded-2xl border border-cj-gray-200 shadow-soft md:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider">Logistics Transit Milestones</h3>
            <div className="space-y-3.5">
              {[
                { detail: 'Import shipment: Australian Wagyu Beef', eta: '2026-07-10', status: 'At Sea' },
                { detail: 'Local supplier: Packaging Film materials', eta: '2026-06-28', status: 'Delivered' },
                { detail: 'Equipment: Cold-chain refrigeration units', eta: '2026-08-01', status: 'In Customs' }
              ].map((logis, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2.5 border-b border-cj-gray-100 last:border-0">
                  <div>
                    <p className="font-bold text-cj-gray-800">{logis.detail}</p>
                    <p className="text-[10px] text-gray-500">ETA: {logis.eta}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-black text-[9px] uppercase ${
                    logis.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                    logis.status === 'At Sea' ? 'bg-cj-blue/10 text-cj-blue' : 'bg-cj-orange/10 text-cj-orange'
                  }`}>
                    {logis.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
