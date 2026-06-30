'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  FileText,
  ListTodo,
  GanttChart,
  Kanban,
  Calendar,
  Grid3X3,
  AlertOctagon,
  GitPullRequest,
  FolderLock,
  Boxes,
  Users2
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { t } = useApp();

  const menuGroups = [
    {
      title: t('menu_dashboard') === 'Dashboard' ? 'Core Portfolio' : (t('menu_dashboard') === 'Bảng Điều khiển' ? 'Danh mục cốt lõi' : '핵심 포트폴리오'),
      items: [
        { id: 'dashboard', label: t('menu_dashboard'), icon: LayoutDashboard },
        { id: 'charter', label: t('menu_charter'), icon: FileText },
        { id: 'documents', label: t('menu_docs'), icon: FolderLock }
      ]
    },
    {
      title: t('menu_dashboard') === 'Dashboard' ? 'PMBOK Scheduling' : (t('menu_dashboard') === 'Bảng Điều khiển' ? 'Kế hoạch PMBOK' : 'PMBOK 일정 관리'),
      items: [
        { id: 'tasks', label: t('menu_wbs'), icon: ListTodo },
        { id: 'gantt', label: t('menu_gantt'), icon: GanttChart },
        { id: 'kanban', label: t('menu_kanban'), icon: Kanban },
        { id: 'calendar', label: t('menu_calendar'), icon: Calendar }
      ]
    },
    {
      title: t('menu_dashboard') === 'Dashboard' ? 'Governance & Risks' : (t('menu_dashboard') === 'Bảng Điều khiển' ? 'Quản trị & Rủi ro' : '거버넌스 및 리스크'),
      items: [
        { id: 'raci', label: t('menu_raci'), icon: Grid3X3 },
        { id: 'risks', label: t('menu_risks'), icon: AlertOctagon },
        { id: 'changes', label: t('menu_changes'), icon: GitPullRequest }
      ]
    },
    {
      title: t('menu_dashboard') === 'Dashboard' ? 'CJ Foods Specific' : (t('menu_dashboard') === 'Bảng Điều khiển' ? 'Đặc thù CJ Foods' : 'CJ Foods 특화'),
      items: [
        { id: 'fmcg', label: t('menu_fmcg'), icon: Boxes },
        { id: 'resources', label: t('menu_resources'), icon: Users2 }
      ]
    }
  ];

  return (
    <aside className="w-[260px] shrink-0 bg-white border-r border-cj-gray-200/80 flex flex-col h-[calc(100vh-64px)] sticky top-16 z-30 select-none">
      {/* Scrollable menu options */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1.5">
            <span className="px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              {group.title}
            </span>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all text-left cursor-pointer ${
                        isActive
                          ? 'bg-cj-blue text-white shadow-sm'
                          : 'text-cj-gray-700 hover:bg-cj-gray-100 hover:text-cj-gray-800'
                      }`}
                    >
                      <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom sidebar info card */}
      <div className="p-4 border-t border-cj-gray-200 bg-cj-gray-100/30">
        <div className="bg-white border border-cj-gray-200/60 rounded-xl p-3 shadow-soft">
          <div className="flex items-center space-x-1.5 text-cj-red font-bold text-[10px] uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cj-red animate-pulse" />
            <span>PMO Standard</span>
          </div>
          <p className="text-[10px] text-gray-500 leading-normal">
            {t('menu_dashboard') === 'Dashboard' 
              ? 'Aligned with PMBOK 7th Edition best practices for FMCG operations.'
              : (t('menu_dashboard') === 'Bảng Điều khiển'
                ? 'Tuân thủ các phương pháp PMBOK thế hệ thứ 7 trong ngành hàng tiêu dùng nhanh (FMCG).'
                : 'FMCG 운영을 위한 PMBOK 7판 글로벌 표준 방법론 준수.')}
          </p>
        </div>
      </div>
    </aside>
  );
}
