'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

// Component view imports
import SSOLogin from '@/components/SSOLogin';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import DashboardView from '@/components/DashboardView';
import ProjectCharterView from '@/components/ProjectCharterView';
import WBSView from '@/components/WBSView';
import GanttView from '@/components/GanttView';
import KanbanView from '@/components/KanbanView';
import CalendarView from '@/components/CalendarView';
import RaciView from '@/components/RaciView';
import RiskIssueView from '@/components/RiskIssueView';
import ChangeRequestView from '@/components/ChangeRequestView';
import DocsMeetingsView from '@/components/DocsMeetingsView';
import FmcgModulesView from '@/components/FmcgModulesView';
import ResourcesView from '@/components/ResourcesView';
import AIAssistant from '@/components/AIAssistant';

export default function Home() {
  const { isLoggedIn } = useApp();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  if (!isLoggedIn) {
    return <SSOLogin />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'charter':
        return <ProjectCharterView />;
      case 'tasks':
        return <WBSView />;
      case 'gantt':
        return <GanttView />;
      case 'kanban':
        return <KanbanView />;
      case 'calendar':
        return <CalendarView />;
      case 'raci':
        return <RaciView />;
      case 'risks':
        return <RiskIssueView />;
      case 'changes':
        return <ChangeRequestView />;
      case 'documents':
        return <DocsMeetingsView />;
      case 'fmcg':
        return <FmcgModulesView />;
      case 'resources':
        return <ResourcesView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top Header */}
      <Header />

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Page Viewer Container */}
        <main className="flex-1 bg-[#f8f9fa] overflow-hidden flex flex-col">
          {renderActiveView()}
        </main>
      </div>

      {/* Floating AI Chat Assistant */}
      <AIAssistant />
    </div>
  );
}
