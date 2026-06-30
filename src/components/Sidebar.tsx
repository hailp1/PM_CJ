'use client';

import React from 'react';
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
  const menuGroups = [
    {
      title: 'Core Portfolio',
      items: [
        { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'charter', label: 'Project Charter', icon: FileText },
        { id: 'documents', label: 'Docs & Meetings', icon: FolderLock }
      ]
    },
    {
      title: 'PMBOK Scheduling',
      items: [
        { id: 'tasks', label: 'WBS Task Tree', icon: ListTodo },
        { id: 'gantt', label: 'Interactive Gantt', icon: GanttChart },
        { id: 'kanban', label: 'Kanban Board', icon: Kanban },
        { id: 'calendar', label: 'Project Calendar', icon: Calendar }
      ]
    },
    {
      title: 'Governance & Risks',
      items: [
        { id: 'raci', label: 'RACI Matrix', icon: Grid3X3 },
        { id: 'risks', label: 'Risks & Issues', icon: AlertOctagon },
        { id: 'changes', label: 'Change Requests', icon: GitPullRequest }
      ]
    },
    {
      title: 'CJ Foods Specific',
      items: [
        { id: 'fmcg', label: 'FMCG Execution', icon: Boxes },
        { id: 'resources', label: 'Resource Capacity', icon: Users2 }
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
            Aligned with PMBOK 7th Edition best practices for FMCG operations.
          </p>
        </div>
      </div>
    </aside>
  );
}
