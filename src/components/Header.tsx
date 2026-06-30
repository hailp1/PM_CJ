'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Bell, Search, ChevronDown, CheckSquare, Shield, AlertTriangle, LogOut, Check, Plus, X } from 'lucide-react';
import { mockUsers } from '@/data/mockData';

export default function Header() {
  const {
    currentUser,
    setCurrentUser,
    projects,
    setProjects,
    activeProjectId,
    setActiveProjectId,
    notifications,
    markNotificationsRead,
    setIsLoggedIn,
    logAction
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Project Modal States
  const [showNewProjModal, setShowNewProjModal] = useState(false);
  const [newProjCode, setNewProjCode] = useState('CJ-DMS-EXP');
  const [newProjName, setNewProjName] = useState('Dự án mở rộng bán hàng');
  const [newProjPmId, setNewProjPmId] = useState('u3'); // default Lê Phúc Hải
  const [newProjSponsor, setNewProjSponsor] = useState('Nguyễn Tuấn Đạt');
  const [newProjBudget, setNewProjBudget] = useState(1500);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleRoleChange = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      setCurrentUser(user);
      setShowProfileMenu(false);
    }
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser.role === 'Viewer') {
      alert('Unauthorized: Viewers cannot create projects.');
      return;
    }
    const matchedPm = mockUsers.find(u => u.id === newProjPmId);
    const newProjId = 'p_' + Math.random().toString(36).substr(2, 9);
    const newProj = {
      id: newProjId,
      code: newProjCode,
      name: newProjName,
      businessUnit: 'CJ Foods Vietnam' as const,
      department: 'Sales' as const,
      sponsor: newProjSponsor,
      pm: matchedPm ? matchedPm.name : 'Lê Phúc Hải',
      pmId: newProjPmId,
      objective: 'Objective placeholder for new project.',
      businessJustification: 'Business case justification.',
      scope: 'Core deliverables scope.',
      outOfScope: 'Out of scope items.',
      priority: 'Medium' as const,
      riskLevel: 'Low' as const,
      strategicAlignment: 'Market Leadership' as const,
      status: 'Planning' as const,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().split('T')[0],
      budget: newProjBudget,
      actualCost: 0,
      progress: 0,
      type: 'Sales RTM' as const
    };

    setProjects(prev => [...prev, newProj]);
    setActiveProjectId(newProjId);
    setShowNewProjModal(false);
    logAction(newProjId, `Created project charter for "${newProjName}"`);
  };

  return (
    <header className="h-16 bg-white border-b border-cj-gray-200/80 px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm select-none">
      {/* Left: Logo & Project Switcher */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <img src="/CJ_logo.png" alt="CJ Foods Vietnam Logo" className="h-9 w-auto object-contain" />
          <span className="font-bold text-lg tracking-tight text-cj-gray-800">
            CJ <span className="text-cj-red font-extrabold">ProjectHub</span>
          </span>
        </div>

        <div className="h-6 w-px bg-cj-gray-200" />

        {/* Project Selector */}
        <div className="relative flex items-center">
          <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider absolute -top-3 left-1">Active Project</label>
          <div className="relative flex items-center">
            <select
              className="pl-2 pr-8 py-1.5 bg-cj-gray-100/60 hover:bg-cj-gray-100 border-0 rounded-lg text-sm font-semibold text-cj-gray-800 focus:ring-2 focus:ring-cj-red/10 outline-none transition-all cursor-pointer appearance-none max-w-[280px] truncate"
              value={activeProjectId}
              onChange={(e) => setActiveProjectId(e.target.value)}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
            
            {/* Create Project Button */}
            {!['Viewer', 'Member'].includes(currentUser.role) && (
              <button
                onClick={() => setShowNewProjModal(true)}
                className="p-1 text-gray-400 hover:text-cj-red transition-all cursor-pointer bg-cj-gray-100 rounded ml-2"
                title="Create New Project"
              >
                <Plus className="h-4.5 w-4.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right: Search, Notifications, Profile Role Switcher */}
      <div className="flex items-center space-x-4">
        {/* Global Search Mock */}
        <div className="relative w-64 max-lg:hidden">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Global search (Tasks, Risks, Docs)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-cj-gray-100/60 focus:bg-white border border-transparent focus:border-cj-gray-200 rounded-lg text-xs outline-none transition-all placeholder:text-gray-500"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 text-cj-gray-700 hover:bg-cj-gray-100 rounded-lg transition-all relative cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-4 min-w-[16px] px-1 bg-cj-red text-[9px] font-bold text-white rounded-full flex items-center justify-center border border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white rounded-xl shadow-soft border border-cj-gray-200 overflow-hidden z-50 animate-scale-in">
              <div className="p-3.5 border-b border-cj-gray-200 flex justify-between items-center bg-cj-gray-100/50">
                <span className="font-bold text-xs text-cj-gray-800 uppercase tracking-wider">In-App Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markNotificationsRead}
                    className="text-[10px] text-cj-blue hover:underline font-semibold cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-cj-gray-100">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 text-xs transition-colors hover:bg-cj-gray-100/40 ${!n.read ? 'bg-cj-blue/2' : ''}`}
                    >
                      <div className="flex items-start space-x-2.5">
                        <div className="mt-0.5">
                          {n.type === 'approval' ? (
                            <CheckSquare className="h-4 w-4 text-cj-blue" />
                          ) : n.type === 'issue' ? (
                            <AlertTriangle className="h-4 w-4 text-cj-red" />
                          ) : (
                            <Shield className="h-4 w-4 text-cj-orange" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-cj-gray-800 ${!n.read ? 'font-semibold' : ''}`}>{n.text}</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs text-gray-400">No notifications.</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile / Role Selector */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-2 p-1.5 hover:bg-cj-gray-100 rounded-lg transition-all cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full border border-cj-gray-200 object-cover"
            />
            <div className="text-left max-md:hidden">
              <p className="text-xs font-bold text-cj-gray-800 leading-tight">{currentUser.name}</p>
              <p className="text-[9px] text-cj-red font-semibold tracking-wide leading-none">{currentUser.role}</p>
            </div>
            <ChevronDown className="h-4.5 w-4.5 text-gray-500 max-md:hidden" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2.5 w-60 bg-white rounded-xl shadow-soft border border-cj-gray-200 overflow-hidden z-50 animate-scale-in">
              <div className="p-3.5 border-b border-cj-gray-200">
                <p className="font-bold text-xs text-cj-gray-800 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{currentUser.email}</p>
              </div>

              {/* Role Toggle for testing */}
              <div className="p-2 bg-cj-gray-100/50 border-b border-cj-gray-200">
                <p className="text-[9px] font-bold text-cj-gray-700 uppercase tracking-wider px-2 mb-1.5">
                  Change Tester Role (RBAC)
                </p>
                <div className="space-y-0.5">
                  {mockUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleRoleChange(user.id)}
                      className={`w-full text-left px-2.5 py-1 text-xs rounded-md transition-colors flex items-center justify-between cursor-pointer ${
                        currentUser.id === user.id
                          ? 'bg-cj-blue text-white font-semibold'
                          : 'hover:bg-cj-gray-200 text-cj-gray-800'
                      }`}
                    >
                      <span>{user.name} ({user.role})</span>
                      {currentUser.id === user.id && <Check className="h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-1">
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out of AD</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProjModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <form onSubmit={handleCreateProject} className="bg-white rounded-2xl shadow-lg border border-cj-gray-200 max-w-md w-full overflow-hidden animate-scale-in">
            <div className="p-4 border-b bg-cj-gray-100/50 flex justify-between items-center">
              <span className="font-bold text-sm text-cj-gray-800">Khởi tạo dự án mới</span>
              <button type="button" onClick={() => setShowNewProjModal(false)} className="text-gray-400 hover:text-cj-red transition-all cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">Mã dự án (Code)</label>
                <input
                  type="text"
                  required
                  className="w-full p-2.5 bg-cj-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-cj-red outline-none"
                  value={newProjCode}
                  onChange={(e) => setNewProjCode(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">Tên dự án (Name)</label>
                <input
                  type="text"
                  required
                  className="w-full p-2.5 bg-cj-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-cj-red outline-none"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1">Project Manager (PM)</label>
                  <select
                    className="w-full p-2.5 bg-cj-gray-100 border border-transparent rounded-lg cursor-pointer outline-none"
                    value={newProjPmId}
                    onChange={(e) => setNewProjPmId(e.target.value)}
                  >
                    {mockUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1">Sponsor</label>
                  <select
                    className="w-full p-2.5 bg-cj-gray-100 border border-transparent rounded-lg cursor-pointer outline-none"
                    value={newProjSponsor}
                    onChange={(e) => setNewProjSponsor(e.target.value)}
                  >
                    {mockUsers.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">Ngân sách (Million VND)</label>
                <input
                  type="number"
                  required
                  className="w-full p-2.5 bg-cj-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-cj-red outline-none text-right"
                  value={newProjBudget}
                  onChange={(e) => setNewProjBudget(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="p-4 border-t bg-cj-gray-100/30 flex justify-end space-x-2">
              <button type="button" onClick={() => setShowNewProjModal(false)} className="px-3.5 py-1.5 bg-cj-gray-100 hover:bg-cj-gray-200 text-cj-gray-800 rounded-lg text-xs font-semibold cursor-pointer">Hủy</button>
              <button type="submit" className="px-4 py-1.5 bg-cj-blue hover:bg-cj-blue/90 text-white rounded-lg text-xs font-semibold shadow cursor-pointer">Khởi tạo</button>
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
