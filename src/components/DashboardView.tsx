'use client';

import React, { useState } from 'react';
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
  UserCheck,
  Building,
  Target
} from 'lucide-react';

export default function DashboardView() {
  const { projects, tasks, resources, activeProjectId } = useApp();
  const [scope, setScope] = useState<'portfolio' | 'project'>('portfolio');

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  // Helper variables for filtering
  const displayProjects = scope === 'portfolio' ? projects : [activeProject];
  const displayTasks = scope === 'portfolio' ? tasks : tasks.filter(t => t.projectId === activeProject.id);

  // Portfolio level metrics
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const onTrackProjects = projects.filter(p => p.status === 'Active' && p.riskLevel !== 'High').length;
  const atRiskProjects = projects.filter(p => p.riskLevel === 'High' && p.status !== 'Completed').length;

  // Render variables based on Scope (Portfolio vs Active Project)
  const isPortfolio = scope === 'portfolio';

  const budgetVal = isPortfolio
    ? projects.reduce((acc, p) => acc + p.budget, 0)
    : activeProject.budget;

  const costVal = isPortfolio
    ? projects.reduce((acc, p) => acc + p.actualCost, 0)
    : activeProject.actualCost;

  const progressVal = isPortfolio
    ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / totalProjects)
    : activeProject.progress;

  // Earned Value Management (EVM)
  const ev = isPortfolio
    ? projects.reduce((acc, p) => acc + p.budget * (p.progress / 100), 0)
    : activeProject.budget * (activeProject.progress / 100);

  const ac = costVal;
  
  // PV representing slightly ahead of progress
  const pv = isPortfolio
    ? projects.reduce((acc, p) => acc + p.budget * 0.48, 0)
    : activeProject.budget * 0.52;

  const cpi = ac > 0 ? ev / ac : 1;
  const spi = pv > 0 ? ev / pv : 1;
  const costVariance = ev - ac;
  const scheduleVariance = ev - pv;

  // Resource Overloads
  const overloadedCount = resources.filter(r => r.availabilityStatus === 'Overloaded').length;

  // Milestones (Critical path tasks)
  const upcomingMilestones = displayTasks
    .filter(t => t.status !== 'Completed' && t.priority === 'Critical')
    .slice(0, 3);

  // Late Tasks (due date passed, not completed)
  const todayStr = '2026-06-30';
  const lateTasks = displayTasks.filter(t => t.status !== 'Completed' && t.dueDate < todayStr);

  // Status breakdown calculations
  const statusCounts = {
    Draft: displayProjects.filter(p => p.status === 'Draft').length,
    Planning: displayProjects.filter(p => p.status === 'Planning').length,
    Active: displayProjects.filter(p => p.status === 'Active').length,
    Completed: displayProjects.filter(p => p.status === 'Completed').length
  };

  // If viewing project, status counts represents WBS tasks status instead!
  const taskStatusCounts = {
    Backlog: displayTasks.filter(t => t.status === 'Backlog').length,
    Planning: displayTasks.filter(t => t.status === 'Planning').length,
    ToDo: displayTasks.filter(t => t.status === 'To Do' || t.status === 'Planning').length,
    InProgress: displayTasks.filter(t => t.status === 'In Progress').length,
    Review: displayTasks.filter(t => t.status === 'Review').length,
    Blocked: displayTasks.filter(t => t.status === 'Blocked').length,
    Completed: displayTasks.filter(t => t.status === 'Completed').length
  };

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-[calc(100vh-64px)] w-full select-none">
      
      {/* Page Title & Scope Toggle */}
      <div className="flex justify-between items-center max-md:flex-col max-md:items-start max-md:space-y-3">
        <div>
          <h1 className="text-xl font-extrabold text-cj-gray-800">
            {isPortfolio ? 'Executive Portfolio Dashboard' : `Project Dashboard: ${activeProject.code}`}
          </h1>
          <p className="text-xs text-gray-500">
            {isPortfolio 
              ? 'Real-time status updates and Earned Value Management (EVM) for overall portfolio.' 
              : `Specific project metrics, task completion indexes, and budget variance controls for ${activeProject.name}.`}
          </p>
        </div>

        {/* Dashboard toggle controls */}
        <div className="flex items-center bg-white border border-cj-gray-200 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setScope('portfolio')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              isPortfolio ? 'bg-cj-blue text-white shadow-sm' : 'text-gray-500 hover:text-cj-gray-800'
            }`}
          >
            All Projects (Portfolio)
          </button>
          <button
            onClick={() => setScope('project')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              !isPortfolio ? 'bg-cj-blue text-white shadow-sm' : 'text-gray-500 hover:text-cj-gray-800'
            }`}
          >
            Active Project Focus
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Metric Card 1: Size/Status */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              {isPortfolio ? 'Portfolio Size' : 'Project Status'}
            </span>
            <span className="text-2xl font-black text-cj-gray-800 mt-1 block">
              {isPortfolio ? `${totalProjects} Projects` : activeProject.status}
            </span>
            <span className="text-[10px] text-gray-500 mt-1.5 flex items-center">
              {isPortfolio ? (
                <>
                  <span className="font-semibold text-cj-blue mr-1">{completedProjects}</span> completed • 
                  <span className="font-semibold text-cj-red ml-1 mr-1">{onTrackProjects}</span> active
                </>
              ) : (
                <>
                  BU: <span className="font-bold text-cj-blue ml-1">{activeProject.businessUnit}</span>
                </>
              )}
            </span>
          </div>
          <div className="w-12 h-12 bg-cj-blue/5 rounded-xl flex items-center justify-center text-cj-blue">
            <Briefcase className="h-6 w-6" />
          </div>
        </div>

        {/* Metric Card 2: Progress */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              {isPortfolio ? 'Average Progress' : 'Project Progress'}
            </span>
            <span className="text-2xl font-black text-cj-gray-800 mt-1 block">
              {progressVal}% Complete
            </span>
            <div className="w-32 bg-cj-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-gradient-to-r from-cj-blue to-cj-red h-full rounded-full" style={{ width: `${progressVal}%` }} />
            </div>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Metric Card 3: Cost */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              {isPortfolio ? 'Budget Consumption' : 'Cost Consumption'}
            </span>
            <span className="text-2xl font-black text-cj-gray-800 mt-1 block">
              {budgetVal > 0 ? Math.round((costVal / budgetVal) * 100) : 0}%
            </span>
            <span className="text-[10px] text-gray-500 mt-1.5 block">
              Spent: <span className="font-bold text-cj-gray-800">{(costVal).toLocaleString()}M</span> / {(budgetVal).toLocaleString()}M VND
            </span>
          </div>
          <div className="w-12 h-12 bg-cj-orange/5 rounded-xl flex items-center justify-center text-cj-orange">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        {/* Metric Card 4: Risks/Tasks count */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              {isPortfolio ? 'Portfolio Risks' : 'Tasks Summary'}
            </span>
            <span className="text-2xl font-black mt-1 block text-cj-gray-800">
              {isPortfolio ? `${atRiskProjects} Projects At Risk` : `${displayTasks.length} Tasks`}
            </span>
            <span className="text-[10px] text-gray-500 mt-1.5 flex items-center">
              {isPortfolio ? (
                <>
                  <AlertTriangle className="h-3 w-3 text-cj-orange mr-1" />
                  <span>{overloadedCount} overloaded resources</span>
                </>
              ) : (
                <>
                  PIC: <span className="font-bold text-cj-red ml-1">{activeProject.pm}</span>
                </>
              )}
            </span>
          </div>
          <div className="w-12 h-12 bg-cj-red/5 rounded-xl flex items-center justify-center text-cj-red">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Earned Value Management (EVM) Panels */}
      <div className="bg-white p-6 rounded-2xl border border-cj-gray-200/60 shadow-soft">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-sm font-black text-cj-gray-800 uppercase tracking-wider">
              {isPortfolio ? 'Portfolio EVM Controls' : `EVM Metrics: ${activeProject.code}`}
            </h2>
            <p className="text-[11px] text-gray-500">
              {isPortfolio 
                ? 'Portfolio-wide health scoring metrics based on cost and schedule performance indices.' 
                : 'Project specific cost performance metrics compared to planned schedule baseline.'}
            </p>
          </div>
          <span className="text-xs text-cj-blue font-bold px-2 py-0.5 bg-cj-blue/5 rounded-md">PMBOK 7th Ed. Controls</span>
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
            <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider mb-4">
              {isPortfolio ? 'Projects Status' : 'Tasks Status Breakdown'}
            </h3>
            
            <div className="flex items-center justify-center h-40">
              {isPortfolio ? (
                <svg className="w-36 h-36" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" strokeWidth="4.5" />
                  
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22c55e" strokeWidth="4.5" 
                    strokeDasharray={`${(statusCounts.Completed / totalProjects) * 100} ${100 - (statusCounts.Completed / totalProjects) * 100}`} 
                    strokeDashoffset="100" />
                  
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0055a5" strokeWidth="4.5" 
                    strokeDasharray={`${(statusCounts.Active / totalProjects) * 100} ${100 - (statusCounts.Active / totalProjects) * 100}`} 
                    strokeDashoffset={100 - (statusCounts.Completed / totalProjects) * 100} />
                  
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f37021" strokeWidth="4.5" 
                    strokeDasharray={`${(statusCounts.Planning / totalProjects) * 100} ${100 - (statusCounts.Planning / totalProjects) * 100}`} 
                    strokeDashoffset={100 - ((statusCounts.Completed + statusCounts.Active) / totalProjects) * 100} />

                  <g className="text-center">
                    <text x="50%" y="48%" className="text-[5px] font-black text-cj-gray-800" textAnchor="middle">
                      {totalProjects}
                    </text>
                    <text x="50%" y="62%" className="text-[2.5px] font-bold text-gray-500" textAnchor="middle">
                      PROJECTS
                    </text>
                  </g>
                </svg>
              ) : (
                <svg className="w-36 h-36" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" strokeWidth="4.5" />
                  
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22c55e" strokeWidth="4.5" 
                    strokeDasharray={`${(taskStatusCounts.Completed / Math.max(1, displayTasks.length)) * 100} ${100 - (taskStatusCounts.Completed / Math.max(1, displayTasks.length)) * 100}`} 
                    strokeDashoffset="100" />
                  
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" strokeWidth="4.5" 
                    strokeDasharray={`${(taskStatusCounts.InProgress / Math.max(1, displayTasks.length)) * 100} ${100 - (taskStatusCounts.InProgress / Math.max(1, displayTasks.length)) * 100}`} 
                    strokeDashoffset={100 - (taskStatusCounts.Completed / Math.max(1, displayTasks.length)) * 100} />
                  
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f37021" strokeWidth="4.5" 
                    strokeDasharray={`${(taskStatusCounts.ToDo / Math.max(1, displayTasks.length)) * 100} ${100 - (taskStatusCounts.ToDo / Math.max(1, displayTasks.length)) * 100}`} 
                    strokeDashoffset={100 - ((taskStatusCounts.Completed + taskStatusCounts.InProgress) / Math.max(1, displayTasks.length)) * 100} />

                  <g className="text-center">
                    <text x="50%" y="48%" className="text-[5px] font-black text-cj-gray-800" textAnchor="middle">
                      {displayTasks.length}
                    </text>
                    <text x="50%" y="62%" className="text-[2.5px] font-bold text-gray-500" textAnchor="middle">
                      TASKS
                    </text>
                  </g>
                </svg>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-[10px] pt-4 border-t border-cj-gray-100">
            {isPortfolio ? (
              <>
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
              </>
            ) : (
              <>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="font-bold text-cj-gray-800">In Progress ({taskStatusCounts.InProgress})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="font-bold text-cj-gray-800">Completed ({taskStatusCounts.Completed})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cj-orange" />
                  <span className="font-bold text-cj-gray-800">To Do ({taskStatusCounts.ToDo})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="font-bold text-cj-gray-800">Blocked ({taskStatusCounts.Blocked})</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Budget Burn Line Chart (SVG Line Chart) */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft lg:col-span-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider">
              {isPortfolio ? 'Cumulative Budget Burn Curve' : `Budget Burn: ${activeProject.code}`}
            </h3>
            <div className="flex items-center space-x-3 text-[10px]">
              <span className="flex items-center"><span className="w-2.5 h-1 bg-cj-blue mr-1 rounded" />Planned Value</span>
              <span className="flex items-center"><span className="w-2.5 h-1 bg-cj-red mr-1 rounded" />Actual Cost</span>
            </div>
          </div>

          <div className="relative h-44 w-full">
            <svg className="w-full h-full" viewBox="0 0 500 150">
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="#f3f4f6" strokeWidth="1" />
              <line x1="40" y1="130" x2="480" y2="130" stroke="#e5e7eb" strokeWidth="1.5" />

              {/* Y Axis Labels */}
              <text x="30" y="24" className="text-[8px] text-gray-400 font-bold" textAnchor="end">
                {isPortfolio ? '15B' : `${Math.round(budgetVal * 1.2)}M`}
              </text>
              <text x="30" y="64" className="text-[8px] text-gray-400 font-bold" textAnchor="end">
                {isPortfolio ? '8B' : `${Math.round(budgetVal * 0.6)}M`}
              </text>
              <text x="30" y="104" className="text-[8px] text-gray-400 font-bold" textAnchor="end">
                {isPortfolio ? '3B' : `${Math.round(budgetVal * 0.2)}M`}
              </text>
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
              <path 
                d={isPortfolio ? "M 40 130 Q 130 120 220 100 T 260 90" : `M 40 130 Q 130 125 220 ${130 - (110 * (costVal / budgetVal))} T 300 80`} 
                fill="none" 
                stroke="#e21e26" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
              />

              {/* Node */}
              <circle cx={isPortfolio ? "260" : "300"} cy={isPortfolio ? "90" : "80"} r="4.5" fill="#e21e26" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Task Lists & Milestones */}
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

        {/* Right: Milestones */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft">
          <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider mb-4 flex items-center">
            <UserCheck className="h-4.5 w-4.5 text-cj-blue mr-1.5" />
            <span>Critical Path Milestones ({upcomingMilestones.length})</span>
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
            {upcomingMilestones.length === 0 && (
              <div className="text-center text-xs text-gray-400 py-6">No active critical path milestones.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
