'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  Clock,
  ChevronRight,
  TrendingDown,
  UserCheck
} from 'lucide-react';

export default function DashboardView() {
  const { projects, tasks, resources } = useApp();

  // Metrics
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const onTrackProjects = projects.filter(p => p.status === 'Active' && p.riskLevel !== 'High').length;
  const atRiskProjects = projects.filter(p => p.riskLevel === 'High' && p.status !== 'Completed').length;
  
  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const totalCost = projects.reduce((acc, p) => acc + p.actualCost, 0);
  const averageProgress = Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / totalProjects);

  // Earned Value Management (EVM) Metrics for the overall portfolio
  // EV = Sum(BAC * Progress)
  const portfolioEV = projects.reduce((acc, p) => acc + p.budget * (p.progress / 100), 0);
  const portfolioAC = totalCost;
  // PV = Sum(BAC * PlannedProgress) -> mock planned progress based on duration elapsed
  // Let's mock a portfolio PV representing slightly ahead of actual progress
  const portfolioPV = projects.reduce((acc, p) => acc + p.budget * 0.48, 0);

  const cpi = portfolioAC > 0 ? portfolioEV / portfolioAC : 1;
  const spi = portfolioPV > 0 ? portfolioEV / portfolioPV : 1;
  const costVariance = portfolioEV - portfolioAC;
  const scheduleVariance = portfolioEV - portfolioPV;

  // Resource Overloads
  const overloadedCount = resources.filter(r => r.availabilityStatus === 'Overloaded').length;

  // Upcoming Milestones (Completed = false tasks that are marked High or parentId = null)
  const upcomingMilestones = tasks
    .filter(t => t.status !== 'Completed' && t.priority === 'Critical')
    .slice(0, 3);

  // Late Tasks (due date passed, not completed)
  const todayStr = '2026-06-30'; // Current simulation date
  const lateTasks = tasks.filter(t => t.status !== 'Completed' && t.dueDate < todayStr);

  // SVGs Chart Data Calculations
  // 1. Status Distribution
  const statusCounts = {
    Draft: projects.filter(p => p.status === 'Draft').length,
    Planning: projects.filter(p => p.status === 'Planning').length,
    Active: projects.filter(p => p.status === 'Active').length,
    Completed: projects.filter(p => p.status === 'Completed').length
  };
  
  // 2. Department Breakdown
  const deptCounts: { [key: string]: number } = {};
  projects.forEach(p => {
    deptCounts[p.department] = (deptCounts[p.department] || 0) + 1;
  });

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-[calc(100vh-64px)] w-full">
      {/* Page Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-extrabold text-cj-gray-800">Executive Portfolio Dashboard</h1>
          <p className="text-xs text-gray-500">Real-time status updates and Earned Value Management (EVM) for CJ Foods Vietnam.</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-semibold text-cj-gray-700 bg-white border border-cj-gray-200 shadow-sm rounded-lg px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span>System Status: Healthy</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Projects */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Portfolio Size</span>
            <span className="text-2xl font-black text-cj-gray-800 mt-1 block">{totalProjects} Projects</span>
            <span className="text-[10px] text-gray-500 mt-1.5 flex items-center">
              <span className="font-semibold text-cj-blue mr-1">{completedProjects}</span> completed • 
              <span className="font-semibold text-cj-red ml-1 mr-1">{onTrackProjects}</span> active
            </span>
          </div>
          <div className="w-12 h-12 bg-cj-blue/5 rounded-xl flex items-center justify-center text-cj-blue">
            <Briefcase className="h-6 w-6" />
          </div>
        </div>

        {/* Completion % */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Overall Progress</span>
            <span className="text-2xl font-black text-cj-gray-800 mt-1 block">{averageProgress}% Complete</span>
            <div className="w-32 bg-cj-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-gradient-to-r from-cj-blue to-cj-red h-full rounded-full" style={{ width: `${averageProgress}%` }} />
            </div>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Budget Burn */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Budget Burn Rate</span>
            <span className="text-2xl font-black text-cj-gray-800 mt-1 block">
              {Math.round((totalCost / totalBudget) * 100)}%
            </span>
            <span className="text-[10px] text-gray-500 mt-1.5 block">
              Spent: <span className="font-bold text-cj-gray-800">{(totalCost).toLocaleString()}M</span> / {(totalBudget).toLocaleString()}M VND
            </span>
          </div>
          <div className="w-12 h-12 bg-cj-orange/5 rounded-xl flex items-center justify-center text-cj-orange">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        {/* Portfolio Health */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Risk Level</span>
            <span className="text-2xl font-black text-cj-red mt-1 block">{atRiskProjects} At Risk</span>
            <span className="text-[10px] text-gray-500 mt-1.5 flex items-center">
              <AlertTriangle className="h-3 w-3 text-cj-orange mr-1" />
              <span>{overloadedCount} overloaded resources</span>
            </span>
          </div>
          <div className="w-12 h-12 bg-cj-red/5 rounded-xl flex items-center justify-center text-cj-red animate-pulse">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Earned Value Management (EVM) Panels */}
      <div className="bg-white p-6 rounded-2xl border border-cj-gray-200/60 shadow-soft">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-sm font-black text-cj-gray-800 uppercase tracking-wider">Earned Value (EVM) & PMBOK Controls</h2>
            <p className="text-[11px] text-gray-500">Portfolio-wide health scoring metrics based on cost and schedule performance indices.</p>
          </div>
          <span className="text-xs text-cj-blue font-bold px-2 py-0.5 bg-cj-blue/5 rounded-md">PMBOK 7th Ed. Alignment</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          
          <div className="p-3 bg-cj-gray-100/50 rounded-xl">
            <span className="text-[10px] text-gray-500 font-bold block uppercase">CPI (Cost Performance Index)</span>
            <span className={`text-xl font-extrabold block mt-1 ${cpi >= 1 ? 'text-green-600' : 'text-cj-red'}`}>
              {cpi.toFixed(2)}
            </span>
            <span className="text-[9px] text-gray-400">
              {cpi >= 1 ? 'Under Budget' : 'Over Budget'}
            </span>
          </div>

          <div className="p-3 bg-cj-gray-100/50 rounded-xl">
            <span className="text-[10px] text-gray-500 font-bold block uppercase">SPI (Schedule Perf. Index)</span>
            <span className={`text-xl font-extrabold block mt-1 ${spi >= 1 ? 'text-green-600' : 'text-cj-red'}`}>
              {spi.toFixed(2)}
            </span>
            <span className="text-[9px] text-gray-400">
              {spi >= 1 ? 'Ahead of Schedule' : 'Behind Schedule'}
            </span>
          </div>

          <div className="p-3 bg-cj-gray-100/50 rounded-xl">
            <span className="text-[10px] text-gray-500 font-bold block uppercase">CV (Cost Variance)</span>
            <span className={`text-xl font-extrabold block mt-1 ${costVariance >= 0 ? 'text-green-600' : 'text-cj-red'}`}>
              {costVariance >= 0 ? '+' : ''}{Math.round(costVariance).toLocaleString()}M VND
            </span>
            <span className="text-[9px] text-gray-400">Value vs. Actual Spent</span>
          </div>

          <div className="p-3 bg-cj-gray-100/50 rounded-xl">
            <span className="text-[10px] text-gray-500 font-bold block uppercase">SV (Schedule Variance)</span>
            <span className={`text-xl font-extrabold block mt-1 ${scheduleVariance >= 0 ? 'text-green-600' : 'text-cj-red'}`}>
              {scheduleVariance >= 0 ? '+' : ''}{Math.round(scheduleVariance).toLocaleString()}M VND
            </span>
            <span className="text-[9px] text-gray-400">Value vs. Baseline Target</span>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Project Status Breakdown (SVG Donut Chart) */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider mb-4">Project Status</h3>
            <div className="flex items-center justify-center h-40">
              <svg className="w-36 h-36" viewBox="0 0 36 36">
                {/* Background circle */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" strokeWidth="4.5" />
                
                {/* Completed - 25% (stroke-dasharray="25 75", stroke-dashoffset="100") */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22c55e" strokeWidth="4.5" 
                  strokeDasharray={`${(statusCounts.Completed / totalProjects) * 100} ${100 - (statusCounts.Completed / totalProjects) * 100}`} 
                  strokeDashoffset="100" />
                
                {/* Active - 50% (dasharray="50 50" offset="75") */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0055a5" strokeWidth="4.5" 
                  strokeDasharray={`${(statusCounts.Active / totalProjects) * 100} ${100 - (statusCounts.Active / totalProjects) * 100}`} 
                  strokeDashoffset={100 - (statusCounts.Completed / totalProjects) * 100} />
                
                {/* Planning - 25% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f37021" strokeWidth="4.5" 
                  strokeDasharray={`${(statusCounts.Planning / totalProjects) * 100} ${100 - (statusCounts.Planning / totalProjects) * 100}`} 
                  strokeDashoffset={100 - ((statusCounts.Completed + statusCounts.Active) / totalProjects) * 100} />

                {/* Center Text */}
                <g className="text-center">
                  <text x="50%" y="48%" className="text-[5px] font-black text-cj-gray-800" textAnchor="middle">
                    {totalProjects}
                  </text>
                  <text x="50%" y="62%" className="text-[2.5px] font-bold text-gray-500" textAnchor="middle">
                    PROJECTS
                  </text>
                </g>
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-[10px] pt-4 border-t border-cj-gray-100">
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cj-blue" />
              <span className="font-bold text-cj-gray-800">Active ({statusCounts.Active})</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="font-bold text-cj-gray-800">Completed ({statusCounts.Completed})</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cj-orange" />
              <span className="font-bold text-cj-gray-800">Planning ({statusCounts.Planning})</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              <span className="font-bold text-cj-gray-800">Draft ({statusCounts.Draft})</span>
            </div>
          </div>
        </div>

        {/* Budget Burn Line Chart (SVG Line Chart) */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft lg:col-span-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider">Cumulative Budget Burn Curve</h3>
            <div className="flex items-center space-x-3 text-[10px]">
              <span className="flex items-center"><span className="w-2.5 h-1 bg-cj-blue mr-1 rounded" />Planned Value</span>
              <span className="flex items-center"><span className="w-2.5 h-1 bg-cj-red mr-1 rounded" />Actual Cost</span>
            </div>
          </div>

          <div className="relative h-44 w-full">
            <svg className="w-full h-full" viewBox="0 0 500 150">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="40" y1="130" x2="480" y2="130" stroke="#e5e7eb" strokeWidth="1.5" />

              {/* Y Axis Labels */}
              <text x="30" y="24" className="text-[8px] text-gray-400 font-bold" textAnchor="end">15B</text>
              <text x="30" y="64" className="text-[8px] text-gray-400 font-bold" textAnchor="end">8B</text>
              <text x="30" y="104" className="text-[8px] text-gray-400 font-bold" textAnchor="end">3B</text>
              <text x="30" y="134" className="text-[8px] text-gray-400 font-bold" textAnchor="end">0</text>

              {/* X Axis Labels */}
              <text x="40" y="145" className="text-[8px] text-gray-400 font-bold" textAnchor="middle">Feb</text>
              <text x="130" y="145" className="text-[8px] text-gray-400 font-bold" textAnchor="middle">Apr</text>
              <text x="220" y="145" className="text-[8px] text-gray-400 font-bold" textAnchor="middle">Jun</text>
              <text x="310" y="145" className="text-[8px] text-gray-400 font-bold" textAnchor="middle">Aug</text>
              <text x="400" y="145" className="text-[8px] text-gray-400 font-bold" textAnchor="middle">Oct</text>
              <text x="480" y="145" className="text-[8px] text-gray-400 font-bold" textAnchor="middle">Dec</text>

              {/* Line: Planned Value (Blue) */}
              <path d="M 40 130 Q 130 110 220 85 T 400 40 T 480 20" fill="none" stroke="#0055a5" strokeWidth="2.5" strokeLinecap="round" />
              
              {/* Line: Actual Cost (Red) */}
              <path d="M 40 130 Q 130 120 220 100 T 260 90" fill="none" stroke="#e21e26" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 0" />

              {/* Actual Cost Node */}
              <circle cx="260" cy="90" r="4.5" fill="#e21e26" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Task Control Lists & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Late Tasks List */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft">
          <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider mb-4 flex items-center">
            <Clock className="h-4.5 w-4.5 text-cj-red mr-1.5" />
            <span>Late Tasks & Deadlines ({lateTasks.length})</span>
          </h3>

          <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
            {lateTasks.map((t) => (
              <div key={t.id} className="p-3 bg-red-50/40 border border-red-100 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-cj-gray-800">{t.title}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">PIC: {t.picName} • Due: <span className="text-cj-red font-bold">{t.dueDate}</span></p>
                </div>
                <span className="text-[9px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full uppercase">
                  Delayed
                </span>
              </div>
            ))}
            {lateTasks.length === 0 && (
              <div className="text-center text-xs text-gray-400 py-6">No delayed tasks found. Good job!</div>
            )}
          </div>
        </div>

        {/* Right: Upcoming Critical Milestones */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft">
          <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider mb-4 flex items-center">
            <UserCheck className="h-4.5 w-4.5 text-cj-blue mr-1.5" />
            <span>Critical Path Milestones</span>
          </h3>

          <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
            {upcomingMilestones.map((t) => (
              <div key={t.id} className="p-3 bg-cj-gray-100/40 border border-cj-gray-200 rounded-xl flex items-center justify-between hover:bg-cj-gray-100 transition-colors">
                <div>
                  <p className="text-xs font-bold text-cj-gray-800">{t.title}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Start: {t.startDate} • Due: {t.dueDate}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-cj-blue block">{t.progress}%</span>
                  <span className="text-[9px] text-gray-400">Progress</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
