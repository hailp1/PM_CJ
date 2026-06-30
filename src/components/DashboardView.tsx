'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  TrendingUp,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  Clock,
  UserCheck,
  Building,
  Target,
  Users,
  ShieldAlert,
  Calendar
} from 'lucide-react';

export default function DashboardView() {
  const { projects, tasks, resources, risks, activeProjectId, t, language } = useApp();
  const [scope, setScope] = useState<'portfolio' | 'project'>('portfolio');

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  // Helper variables for filtering
  const displayProjects = scope === 'portfolio' ? projects : [activeProject];
  const displayTasks = scope === 'portfolio' ? tasks : tasks.filter(t => t.projectId === activeProject.id);
  const displayRisks = scope === 'portfolio' ? risks : risks.filter(r => r.projectId === activeProject.id);

  // Portfolio level metrics
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const onTrackProjects = projects.filter(p => p.status === 'Active' && p.riskLevel !== 'High').length;

  const isPortfolio = scope === 'portfolio';

  // Progress metrics
  const progressVal = isPortfolio
    ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / totalProjects)
    : activeProject.progress;

  // PIC and Resource Load Metrics (Mapped from tasks to avoid type mismatches)
  const activePicsCount = resources.filter(r => tasks.some(t => t.picId === r.userId)).length;
  const overloadedPicsCount = resources.filter(r => r.availabilityStatus === 'Overloaded').length;

  // Risk Metrics
  const criticalRisksCount = displayRisks.filter(r => (r.severity === 'High' || r.severity === 'Critical') && r.status !== 'Closed').length;
  const totalRisksCount = displayRisks.filter(r => r.status !== 'Closed').length;

  // Late Tasks (due date passed, not completed)
  const todayStr = '2026-06-30';
  const lateTasks = displayTasks.filter(t => t.status !== 'Completed' && t.dueDate < todayStr);

  // Milestones (Critical path tasks)
  const upcomingMilestones = displayTasks
    .filter(t => t.status !== 'Completed' && t.priority === 'Critical')
    .slice(0, 3);

  // Status breakdown calculations
  const statusCounts = {
    Draft: displayProjects.filter(p => p.status === 'Draft').length,
    Planning: displayProjects.filter(p => p.status === 'Planning').length,
    Active: displayProjects.filter(p => p.status === 'Active').length,
    Completed: displayProjects.filter(p => p.status === 'Completed').length
  };

  const taskStatusCounts = {
    Backlog: displayTasks.filter(t => t.status === 'Backlog').length,
    Planning: displayTasks.filter(t => t.status === 'Planning').length,
    ToDo: displayTasks.filter(t => t.status === 'To Do' || t.status === 'Planning').length,
    InProgress: displayTasks.filter(t => t.status === 'In Progress').length,
    Review: displayTasks.filter(t => t.status === 'Review').length,
    Blocked: displayTasks.filter(t => t.status === 'Blocked').length,
    Completed: displayTasks.filter(t => t.status === 'Completed').length
  };

  const getStatusText = (status: string) => {
    if (language === 'VI') {
      if (status === 'Completed') return 'Hoàn thành';
      if (status === 'Active') return 'Đang hoạt động';
      if (status === 'Planning') return 'Đang lập kế hoạch';
      if (status === 'Draft') return 'Bản nháp';
    }
    if (language === 'KO') {
      if (status === 'Completed') return '완료됨';
      if (status === 'Active') return '활성 상태';
      if (status === 'Planning') return '계획 수립';
      if (status === 'Draft') return '초안';
    }
    return status;
  };

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-[calc(100vh-64px)] w-full select-none">
      
      {/* Page Title & Scope Toggle */}
      <div className="flex justify-between items-center max-md:flex-col max-md:items-start max-md:space-y-3">
        <div>
          <h1 className="text-xl font-extrabold text-cj-gray-800">
            {isPortfolio 
              ? t('allProjects').split(' (')[0] + ' ' + t('menu_dashboard') 
              : `${t('menu_dashboard')}: ${activeProject.code}`}
          </h1>
          <p className="text-xs text-gray-500">
            {isPortfolio 
              ? (language === 'VI' ? 'Giám sát tiến độ dự án, tải trọng nhân sự và kiểm soát rủi ro toàn danh mục.' : (language === 'KO' ? '포트폴리오의 실시간 진행률, 리소스 가동률 및 활성 리스크 모니터링입니다.' : 'Monitor project progress, resource workload, and active risk controls across all portfolios.'))
              : (language === 'VI' ? `Chi tiết hiệu suất thực thi công việc, nhân sự PIC và cảnh báo rủi ro của dự án ${activeProject.name}.` : (language === 'KO' ? `${activeProject.name} 프로젝트의 작업 수행 현황, 담당자 가동률 및 주요 리스크 분석입니다.` : `Specific progress timelines, PIC task distributions, and risk heatmaps for ${activeProject.name}.`))}
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
            {t('allProjects')}
          </button>
          <button
            onClick={() => setScope('project')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              !isPortfolio ? 'bg-cj-blue text-white shadow-sm' : 'text-gray-500 hover:text-cj-gray-800'
            }`}
          >
            {t('activeProjectFocus')}
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Size/Status */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              {isPortfolio ? t('portfolioSize') : t('projectStatus')}
            </span>
            <span className="text-2xl font-black text-cj-gray-800 mt-1 block">
              {isPortfolio ? `${totalProjects} ${language === 'VI' ? 'Dự án' : (language === 'KO' ? '개 프로젝트' : 'Projects')}` : getStatusText(activeProject.status)}
            </span>
            <span className="text-[10px] text-gray-500 mt-1.5 flex items-center">
              {isPortfolio ? (
                <>
                  <span className="font-semibold text-cj-blue mr-1">{completedProjects}</span> {t('completed')} • 
                  <span className="font-semibold text-cj-red ml-1 mr-1">{onTrackProjects}</span> {t('active')}
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

        {/* Card 2: Progress */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              {isPortfolio ? t('averageProgress') : t('projectProgress')}
            </span>
            <span className="text-2xl font-black text-cj-gray-800 mt-1 block">
              {progressVal}% {language === 'VI' ? 'Hoàn thành' : (language === 'KO' ? '완료' : 'Complete')}
            </span>
            <div className="w-32 bg-cj-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-gradient-to-r from-cj-blue to-cj-red h-full rounded-full" style={{ width: `${progressVal}%` }} />
            </div>
          </div>
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: PIC & Resource Count */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              {language === 'VI' ? 'Nhân lực PIC' : (language === 'KO' ? 'PIC 담당 리소스' : 'Active PIC Resources')}
            </span>
            <span className="text-2xl font-black text-cj-gray-800 mt-1 block">
              {activePicsCount} {language === 'VI' ? 'Nhân sự' : (language === 'KO' ? '명' : 'Staff')}
            </span>
            <span className="text-[10px] text-gray-500 mt-1.5 block">
              {language === 'VI' ? 'Nhân sự quá tải: ' : (language === 'KO' ? '초과 할당: ' : 'Overloaded: ')}
              <span className={`font-bold ${overloadedPicsCount > 0 ? 'text-cj-red' : 'text-green-600'}`}>{overloadedPicsCount} PICs</span>
            </span>
          </div>
          <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
            <Users className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Risks count */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              {language === 'VI' ? 'Rủi ro đang hoạt động' : (language === 'KO' ? '활성 리스크 관리' : 'Active Risks')}
            </span>
            <span className="text-2xl font-black mt-1 block text-cj-gray-800">
              {totalRisksCount} {language === 'VI' ? 'Rủi ro' : (language === 'KO' ? '개 리스크' : 'Risks')}
            </span>
            <span className="text-[10px] text-gray-500 mt-1.5 flex items-center">
              <AlertTriangle className="h-3 w-3 text-cj-red mr-1" />
              <span className="font-bold text-cj-red">{criticalRisksCount} {language === 'VI' ? 'mức độ Cao' : (language === 'KO' ? '높음 등급' : 'High Severity')}</span>
            </span>
          </div>
          <div className="w-12 h-12 bg-cj-red/5 rounded-xl flex items-center justify-center text-cj-red">
            <ShieldAlert className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* PIC Resource Load Matrix (Replaces EVM block) */}
      <div className="bg-white p-6 rounded-2xl border border-cj-gray-200/60 shadow-soft">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-sm font-black text-cj-gray-800 uppercase tracking-wider">
              {language === 'VI' ? 'Bảng cân tải & Phân phối công việc PIC' : (language === 'KO' ? '담당자별 작업 부하 매트릭스' : 'PIC Resource Workload & Task Matrix')}
            </h2>
            <p className="text-[11px] text-gray-500">
              {language === 'VI' ? 'Thống kê chi tiết tải trọng công việc thực tế của từng nhân sự tham gia dự án.' : (language === 'KO' ? '프로젝트 참여 인원별 배정된 작업 건수와 업무 가동 상태를 보여줍니다.' : 'Details of assigned tasks and current allocation load status for each team member.')}
            </p>
          </div>
          <span className="text-xs text-purple-600 font-bold px-2 py-0.5 bg-purple-50 rounded-md">
            {language === 'VI' ? 'Điều phối nhân lực' : (language === 'KO' ? '리소스 제어' : 'Resource Controls')}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
          {resources.slice(0, 7).map((r) => {
            const picTasks = tasks.filter(t => t.picId === r.userId && t.projectId === activeProject.id);
            const picLateTasks = picTasks.filter(t => t.status !== 'Completed' && t.dueDate < todayStr);

            return (
              <div key={r.userId} className="p-3 bg-cj-gray-100/40 border border-cj-gray-200/60 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="font-extrabold text-xs text-cj-gray-800 block truncate">{r.userName}</span>
                  <span className="text-[9px] text-gray-400 block mt-0.5 uppercase font-bold">{r.department}</span>
                </div>
                <div className="my-2.5">
                  <span className="text-lg font-black text-cj-blue block">{picTasks.length}</span>
                  <span className="text-[9px] text-gray-400">{language === 'VI' ? 'Công việc' : (language === 'KO' ? '개 작업' : 'Tasks')}</span>
                </div>
                <div>
                  {picLateTasks.length > 0 ? (
                    <span className="text-[8px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full font-bold uppercase inline-block animate-pulse">
                      {picLateTasks.length} {language === 'VI' ? 'TRỄ HẠN' : (language === 'KO' ? '지연됨' : 'LATE')}
                    </span>
                  ) : (
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase inline-block ${
                      r.availabilityStatus === 'Overloaded' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {r.availabilityStatus}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts & Analytical Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Project Status Breakdown (SVG Donut Chart) */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider mb-4">
              {isPortfolio ? (language === 'VI' ? 'Trạng thái dự án danh mục' : (language === 'KO' ? '포트폴리오 프로젝트 현황' : 'Projects Status')) : t('taskStatusBreakdown')}
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
                      {language === 'VI' ? 'DỰ ÁN' : (language === 'KO' ? '프로젝트' : 'PROJECTS')}
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
                      {language === 'VI' ? 'CÔNG VIỆC' : (language === 'KO' ? '작업수' : 'TASKS')}
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
                  <span className="font-bold text-cj-gray-800">{getStatusText('Active')} ({statusCounts.Active})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="font-bold text-cj-gray-800">{getStatusText('Completed')} ({statusCounts.Completed})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cj-orange" />
                  <span className="font-bold text-cj-gray-800">{getStatusText('Planning')} ({statusCounts.Planning})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                  <span className="font-bold text-cj-gray-800">{getStatusText('Draft')} ({statusCounts.Draft})</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="font-bold text-cj-gray-800">{language === 'VI' ? 'Đang chạy' : (language === 'KO' ? '진행중' : 'In Progress')} ({taskStatusCounts.InProgress})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="font-bold text-cj-gray-800">{language === 'VI' ? 'Hoàn thành' : (language === 'KO' ? '완료됨' : 'Completed')} ({taskStatusCounts.Completed})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cj-orange" />
                  <span className="font-bold text-cj-gray-800">{language === 'VI' ? 'Cần làm' : (language === 'KO' ? '할 일' : 'To Do')} ({taskStatusCounts.ToDo})</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span className="font-bold text-cj-gray-800">{language === 'VI' ? 'Bị nghẽn' : (language === 'KO' ? '지연됨' : 'Blocked')} ({taskStatusCounts.Blocked})</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Task Completion Burnup Line Chart */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft lg:col-span-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider">
              {language === 'VI' ? 'Biểu đồ tích lũy công việc hoàn thành (Burn-up)' : (language === 'KO' ? '작업 완료 누적 추이 차트 (Burn-up)' : 'Task Completion Cumulative Trend (Burn-up)')}
            </h3>
            <div className="flex items-center space-x-3 text-[10px]">
              <span className="flex items-center"><span className="w-2.5 h-1 bg-cj-blue mr-1 rounded" />{language === 'VI' ? 'Tổng số việc kế hoạch' : (language === 'KO' ? '총 계획 작업수' : 'Total Planned Tasks')}</span>
              <span className="flex items-center"><span className="w-2.5 h-1 bg-green-500 mr-1 rounded" />{language === 'VI' ? 'Công việc đã xong' : (language === 'KO' ? '완료된 작업수' : 'Completed Tasks')}</span>
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
                {isPortfolio ? '50 Tasks' : '20 Tasks'}
              </text>
              <text x="30" y="64" className="text-[8px] text-gray-400 font-bold" textAnchor="end">
                {isPortfolio ? '25 Tasks' : '10 Tasks'}
              </text>
              <text x="30" y="104" className="text-[8px] text-gray-400 font-bold" textAnchor="end">
                {isPortfolio ? '10 Tasks' : '4 Tasks'}
              </text>
              <text x="30" y="134" className="text-[8px] text-gray-400 font-bold" textAnchor="end">0</text>

              {/* X Axis Labels */}
              <text x="40" y="145" className="text-[8px] text-gray-400 font-bold" textAnchor="middle">Feb</text>
              <text x="130" y="145" className="text-[8px] text-gray-400 font-bold" textAnchor="middle">Apr</text>
              <text x="220" y="145" className="text-[8px] text-gray-400 font-bold" textAnchor="middle">Jun</text>
              <text x="310" y="145" className="text-[8px] text-gray-400 font-bold" textAnchor="middle">Aug</text>
              <text x="400" y="145" className="text-[8px] text-gray-400 font-bold" textAnchor="middle">Oct</text>
              <text x="480" y="145" className="text-[8px] text-gray-400 font-bold" textAnchor="middle">Dec</text>

              {/* Line: Total Planned Tasks (Blue) */}
              <path d="M 40 120 L 130 90 L 220 70 L 310 50 L 400 40 L 480 30" fill="none" stroke="#0055a5" strokeWidth="2" strokeDasharray="3,3" />
              
              {/* Line: Completed Tasks (Green) */}
              <path 
                d={isPortfolio ? "M 40 130 Q 130 115 220 95 T 310 75" : "M 40 130 Q 130 120 220 100 T 310 85"} 
                fill="none" 
                stroke="#22c55e" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
              />

              {/* Node */}
              <circle cx="310" cy={isPortfolio ? "75" : "85"} r="4" fill="#22c55e" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Task Lists, Milestones & Active Risks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Late Tasks List */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft">
          <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider mb-4 flex items-center">
            <Clock className="h-4.5 w-4.5 text-cj-red mr-1.5" />
            <span>{t('lateTasks')} ({lateTasks.length})</span>
          </h3>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {lateTasks.map((t) => (
              <div key={t.id} className="p-3 bg-red-50/40 border border-red-100 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-cj-gray-800">{t.title}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">PIC: {t.picName} • Due: <span className="text-cj-red font-bold">{t.dueDate}</span></p>
                </div>
                <span className="text-[9px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full uppercase">
                  {language === 'VI' ? 'TRỄ HẠN' : (language === 'KO' ? '지연됨' : 'Delayed')}
                </span>
              </div>
            ))}
            {lateTasks.length === 0 && (
              <div className="text-center text-xs text-gray-400 py-6">
                {language === 'VI' ? 'Không có công việc trễ hạn nào. Tuyệt vời!' : (language === 'KO' ? '지연된 작업이 없습니다. 훌륭합니다!' : 'No delayed tasks found. Good job!')}
              </div>
            )}
          </div>
        </div>

        {/* Center: Active Risks & Mitigations */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft">
          <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider mb-4 flex items-center">
            <ShieldAlert className="h-4.5 w-4.5 text-cj-orange mr-1.5" />
            <span>{language === 'VI' ? 'Rủi ro & Kế hoạch xử lý' : (language === 'KO' ? '주요 리스크 및 대응 방안' : 'Active Risks & Mitigations')}</span>
          </h3>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {displayRisks.slice(0, 3).map((r) => (
              <div key={r.id} className="p-3 bg-cj-gray-100/40 border border-cj-gray-200 rounded-xl space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-cj-gray-800 block truncate max-w-[150px]">{r.code}</span>
                  <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    r.severity === 'High' || r.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {r.severity}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed">{r.description}</p>
                <p className="text-[9px] text-cj-blue bg-cj-blue/5 p-1 rounded font-medium">
                  💡 <span className="font-bold">{language === 'VI' ? 'Gỡ rối: ' : (language === 'KO' ? '대응책: ' : 'Mitigation: ')}</span>{r.mitigation}
                </p>
              </div>
            ))}
            {displayRisks.length === 0 && (
              <div className="text-center text-xs text-gray-400 py-6">
                {language === 'VI' ? 'Không có rủi ro nào được phát hiện.' : (language === 'KO' ? '등록된 리스크가 없습니다.' : 'No active risks identified.')}
              </div>
            )}
          </div>
        </div>

        {/* Right: Milestones */}
        <div className="bg-white p-5 rounded-2xl border border-cj-gray-200/60 shadow-soft">
          <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider mb-4 flex items-center">
            <UserCheck className="h-4.5 w-4.5 text-cj-blue mr-1.5" />
            <span>{t('criticalMilestones')} ({upcomingMilestones.length})</span>
          </h3>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {upcomingMilestones.map((t) => (
              <div key={t.id} className="p-3 bg-cj-gray-100/40 border border-cj-gray-200 rounded-xl flex items-center justify-between hover:bg-cj-gray-100 transition-colors">
                <div>
                  <p className="text-xs font-bold text-cj-gray-800">{t.title}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Start: {t.startDate} • Due: {t.dueDate}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-cj-blue block">{t.progress}%</span>
                  <span className="text-[9px] text-gray-400">{language === 'VI' ? 'Tiến độ' : (language === 'KO' ? '진척률' : 'Progress')}</span>
                </div>
              </div>
            ))}
            {upcomingMilestones.length === 0 && (
              <div className="text-center text-xs text-gray-400 py-6">
                {language === 'VI' ? 'Không có cột mốc đường găng nào.' : (language === 'KO' ? '활성 마일스톤이 없습니다.' : 'No active critical path milestones.')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
