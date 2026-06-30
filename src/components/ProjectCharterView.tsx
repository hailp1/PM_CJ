'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Target, HelpCircle, Shield, Flag, Compass, Calendar, DollarSign, Edit3, Save } from 'lucide-react';

export default function ProjectCharterView() {
  const { projects, activeProjectId, setProjects, currentUser, logAction } = useApp();
  const [isEditing, setIsEditing] = useState(false);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Form states
  const [name, setName] = useState(activeProject.name);
  const [objective, setObjective] = useState(activeProject.objective);
  const [justification, setJustification] = useState(activeProject.businessJustification);
  const [scope, setScope] = useState(activeProject.scope);
  const [outOfScope, setOutOfScope] = useState(activeProject.outOfScope);
  const [priority, setPriority] = useState(activeProject.priority);
  const [riskLevel, setRiskLevel] = useState(activeProject.riskLevel);
  const [alignment, setAlignment] = useState(activeProject.strategicAlignment);
  const [budget, setBudget] = useState(activeProject.budget);

  // Sync state if active project changes
  React.useEffect(() => {
    setName(activeProject.name);
    setObjective(activeProject.objective);
    setJustification(activeProject.businessJustification);
    setScope(activeProject.scope);
    setOutOfScope(activeProject.outOfScope);
    setPriority(activeProject.priority);
    setRiskLevel(activeProject.riskLevel);
    setAlignment(activeProject.strategicAlignment);
    setBudget(activeProject.budget);
  }, [activeProject]);

  const handleSave = () => {
    // RBAC verification: Viewer cannot save
    if (currentUser.role === 'Viewer') {
      alert('Unauthorized: Viewers are not allowed to modify project charter details.');
      setIsEditing(false);
      return;
    }

    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProject.id
          ? {
              ...p,
              name,
              objective,
              businessJustification: justification,
              scope,
              outOfScope,
              priority,
              riskLevel,
              strategicAlignment: alignment,
              budget
            }
          : p
      )
    );
    setIsEditing(false);
    logAction(activeProject.id, 'Updated Project Charter details');
  };

  const isReadOnly = currentUser.role === 'Viewer';

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-[calc(100vh-64px)] w-full">
      {/* Title Header */}
      <div className="flex justify-between items-center border-b border-cj-gray-200 pb-4">
        <div>
          <span className="text-[10px] text-cj-red font-bold uppercase tracking-wider block bg-cj-red/5 px-2 py-0.5 rounded-full w-max">
            PMBOK Initiating Phase
          </span>
          <h1 className="text-xl font-extrabold text-cj-gray-800 mt-1">Official Project Charter</h1>
          <p className="text-xs text-gray-500">Official statement authorization charter aligning project objective to CJ strategic initiatives.</p>
        </div>

        {!isReadOnly && (
          <div>
            {isEditing ? (
              <button
                onClick={handleSave}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-cj-blue hover:bg-cj-blue/90 text-white rounded-lg text-xs font-semibold shadow-sm cursor-pointer transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save Charter</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-cj-gray-200 hover:bg-cj-gray-100 text-cj-gray-800 rounded-lg text-xs font-semibold shadow-sm cursor-pointer transition-colors"
              >
                <Edit3 className="h-4 w-4" />
                <span>Edit Charter</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Detail Cards */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Objective & Business Case */}
          <div className="bg-white p-5 rounded-2xl border border-cj-gray-200 shadow-soft space-y-4">
            <h3 className="text-xs font-black text-cj-gray-800 uppercase tracking-wider flex items-center">
              <Target className="h-4.5 w-4.5 text-cj-blue mr-2" />
              <span>Project Objective & Objectives</span>
            </h3>
            {isEditing ? (
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full text-xs p-3 border rounded-lg focus:ring-1 focus:ring-cj-red focus:border-cj-red outline-none min-h-[80px]"
              />
            ) : (
              <p className="text-xs text-cj-gray-800 leading-relaxed font-medium bg-cj-gray-100/30 p-3 rounded-lg border border-cj-gray-100">
                {activeProject.objective}
              </p>
            )}

            <h3 className="text-xs font-black text-cj-gray-800 uppercase tracking-wider flex items-center pt-2">
              <HelpCircle className="h-4.5 w-4.5 text-cj-orange mr-2" />
              <span>Business Justification</span>
            </h3>
            {isEditing ? (
              <textarea
                value={justification}
                onChange={(e) => setJustification(e.target.value)}
                className="w-full text-xs p-3 border rounded-lg focus:ring-1 focus:ring-cj-red focus:border-cj-red outline-none min-h-[80px]"
              />
            ) : (
              <p className="text-xs text-cj-gray-800 leading-relaxed font-medium bg-cj-gray-100/30 p-3 rounded-lg border border-cj-gray-100">
                {activeProject.businessJustification}
              </p>
            )}
          </div>

          {/* Section 2: Scope Statement */}
          <div className="bg-white p-5 rounded-2xl border border-cj-gray-200 shadow-soft grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-black text-cj-gray-800 uppercase tracking-wider flex items-center mb-2">
                <span className="w-1.5 h-3 bg-cj-blue rounded mr-2" />
                <span>In Scope Statement</span>
              </h3>
              {isEditing ? (
                <textarea
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="w-full text-xs p-3 border rounded-lg focus:ring-1 focus:ring-cj-red focus:border-cj-red outline-none min-h-[120px]"
                />
              ) : (
                <p className="text-xs text-cj-gray-800 leading-relaxed bg-green-50/20 p-3 rounded-lg border border-green-100/50 min-h-[120px]">
                  {activeProject.scope}
                </p>
              )}
            </div>

            <div>
              <h3 className="text-xs font-black text-cj-gray-800 uppercase tracking-wider flex items-center mb-2">
                <span className="w-1.5 h-3 bg-cj-red rounded mr-2" />
                <span>Out of Scope Statement</span>
              </h3>
              {isEditing ? (
                <textarea
                  value={outOfScope}
                  onChange={(e) => setOutOfScope(e.target.value)}
                  className="w-full text-xs p-3 border rounded-lg focus:ring-1 focus:ring-cj-red focus:border-cj-red outline-none min-h-[120px]"
                />
              ) : (
                <p className="text-xs text-cj-gray-800 leading-relaxed bg-red-50/20 p-3 rounded-lg border border-red-100/50 min-h-[120px]">
                  {activeProject.outOfScope}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Metadata / Alignment */}
        <div className="space-y-6">
          {/* Alignment card */}
          <div className="bg-white p-5 rounded-2xl border border-cj-gray-200 shadow-soft space-y-4">
            <h3 className="text-xs font-black text-cj-gray-800 uppercase tracking-wider">Strategic Alignment</h3>
            
            <div className="space-y-3 text-xs">
              
              <div className="flex items-center justify-between p-2.5 bg-cj-gray-100/40 rounded-xl">
                <span className="flex items-center font-bold text-gray-500">
                  <Compass className="h-4 w-4 text-cj-blue mr-2" />
                  Alignment Pillar
                </span>
                {isEditing ? (
                  <select
                    value={alignment}
                    onChange={(e) => setAlignment(e.target.value as any)}
                    className="p-1 text-xs border rounded cursor-pointer"
                  >
                    <option value="Market Leadership">Market Leadership</option>
                    <option value="Cost Optimization">Cost Optimization</option>
                    <option value="Digital Acceleration">Digital Acceleration</option>
                    <option value="Product Innovation">Product Innovation</option>
                  </select>
                ) : (
                  <span className="font-extrabold text-cj-blue bg-cj-blue/5 px-2 py-0.5 rounded">
                    {activeProject.strategicAlignment}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 bg-cj-gray-100/40 rounded-xl">
                <span className="flex items-center font-bold text-gray-500">
                  <Flag className="h-4 w-4 text-cj-red mr-2" />
                  Project Priority
                </span>
                {isEditing ? (
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="p-1 text-xs border rounded cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                ) : (
                  <span className={`font-extrabold px-2 py-0.5 rounded ${
                    activeProject.priority === 'Critical' 
                      ? 'bg-red-100 text-red-700' 
                      : activeProject.priority === 'High'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-cj-blue/5 text-cj-blue'
                  }`}>
                    {activeProject.priority}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 bg-cj-gray-100/40 rounded-xl">
                <span className="flex items-center font-bold text-gray-500">
                  <Shield className="h-4 w-4 text-cj-orange mr-2" />
                  Risk Profile
                </span>
                {isEditing ? (
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value as any)}
                    className="p-1 text-xs border rounded cursor-pointer"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                ) : (
                  <span className={`font-extrabold px-2 py-0.5 rounded ${
                    activeProject.riskLevel === 'High' 
                      ? 'bg-red-50 text-cj-red font-bold' 
                      : 'bg-green-50 text-green-700'
                  }`}>
                    {activeProject.riskLevel}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Project Cost & Schedule */}
          <div className="bg-white p-5 rounded-2xl border border-cj-gray-200 shadow-soft space-y-4">
            <h3 className="text-xs font-black text-cj-gray-800 uppercase tracking-wider">Timeline & Financial limits</h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-cj-gray-100/40 rounded-xl">
                <span className="flex items-center font-bold text-gray-500">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  Schedule Range
                </span>
                <span className="font-extrabold text-cj-gray-800">
                  {activeProject.startDate} ~ {activeProject.endDate}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-cj-gray-100/40 rounded-xl">
                <span className="flex items-center font-bold text-gray-500">
                  <DollarSign className="h-4 w-4 text-green-500 mr-2" />
                  Total Budget BAC
                </span>
                {isEditing ? (
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="p-1 text-xs border rounded w-24 text-right"
                  />
                ) : (
                  <span className="font-extrabold text-green-600">
                    {(activeProject.budget).toLocaleString()}M VND
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between p-2.5 bg-cj-gray-100/40 rounded-xl">
                <span className="flex items-center font-bold text-gray-500">
                  <DollarSign className="h-4 w-4 text-cj-red mr-2" />
                  Actual Cost AC
                </span>
                <span className="font-extrabold text-cj-red">
                  {(activeProject.actualCost).toLocaleString()}M VND
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
