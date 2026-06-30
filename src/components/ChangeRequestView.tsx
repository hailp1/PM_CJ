'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ChangeRequest } from '@/data/mockData';
import { Plus, Check, X, ShieldAlert, GitPullRequest, DollarSign } from 'lucide-react';

export default function ChangeRequestView() {
  const {
    changeRequests,
    setChangeRequests,
    projects,
    setProjects,
    activeProjectId,
    currentUser,
    logAction
  } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [impact, setImpact] = useState('');
  const [cost, setCost] = useState(0);

  const projectCRs = changeRequests.filter((cr) => cr.projectId === activeProjectId);
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleCreateCR = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser.role === 'Viewer') {
      alert('Unauthorized: Viewers cannot create change requests.');
      return;
    }

    const newCR: ChangeRequest = {
      id: 'cr_' + Math.random().toString(36).substr(2, 9),
      projectId: activeProjectId,
      code: `CR-${String(changeRequests.length + 1).padStart(3, '0')}`,
      title,
      description: desc,
      businessImpact: impact,
      costImpact: cost,
      status: 'Under Review',
      requestedBy: currentUser.name,
      requestedDate: new Date().toISOString().split('T')[0],
      approvalHistory: [
        {
          step: 'Initiated',
          actor: currentUser.name,
          action: 'Submitted',
          date: new Date().toISOString().split('T')[0]
        }
      ]
    };

    setChangeRequests((prev) => [...prev, newCR]);
    setShowForm(false);
    setTitle('');
    setDesc('');
    setImpact('');
    logAction(activeProjectId, `Created Change Request: "${title}"`);
  };

  const handleApprovalAction = (crId: string, action: 'Approved' | 'Rejected') => {
    // RBAC: Only Admin, PMO, or Department Head can approve/reject change requests
    const allowedRoles = ['Administrator', 'PMO', 'Department Head'];
    if (!allowedRoles.includes(currentUser.role)) {
      alert(`Unauthorized: Your role (${currentUser.role}) does not have permission to approve/reject change requests. Required: Admin, PMO, or Department Head.`);
      return;
    }

    const crIndex = changeRequests.findIndex((cr) => cr.id === crId);
    if (crIndex === -1) return;

    const cr = changeRequests[crIndex];
    const updatedCRs = [...changeRequests];

    const newHistory = [
      ...cr.approvalHistory,
      {
        step: 'Final Decision',
        actor: currentUser.name,
        action,
        date: new Date().toISOString().split('T')[0],
        comment: `Decision made under active session authorization.`
      }
    ];

    updatedCRs[crIndex] = {
      ...cr,
      status: action,
      approvalHistory: newHistory
    };

    setChangeRequests(updatedCRs);
    logAction(activeProjectId, `${action} Change Request ${cr.code}: "${cr.title}"`);

    // If approved, adjust project budget
    if (action === 'Approved') {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProjectId
            ? { ...p, budget: p.budget + cr.costImpact }
            : p
        )
      );
      logAction(activeProjectId, `Adjusted project budget by ${cr.costImpact >= 0 ? '+' : ''}${cr.costImpact}M VND due to CR approval`);
    }
  };

  const isReadOnly = currentUser.role === 'Viewer';
  const canDecide = ['Administrator', 'PMO', 'Department Head'].includes(currentUser.role);

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-[calc(100vh-64px)] w-full">
      {/* Title Header */}
      <div className="flex justify-between items-center border-b border-cj-gray-200/80 pb-4">
        <div>
          <span className="text-[10px] text-cj-red font-bold uppercase tracking-wider block bg-cj-red/5 px-2 py-0.5 rounded-full w-max">
            PMBOK Integration & Scope Control
          </span>
          <h1 className="text-xl font-extrabold text-cj-gray-800 mt-1">Change Request (CR) Registry</h1>
          <p className="text-xs text-gray-500">Record, assess business/cost impact, and submit scope change proposals for official PMO Steering Committee approvals.</p>
        </div>

        {!isReadOnly && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-cj-blue hover:bg-cj-blue/90 text-white rounded-lg text-xs font-semibold shadow-sm cursor-pointer transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create CR Proposal</span>
          </button>
        )}
      </div>

      {/* CR Form */}
      {showForm && (
        <form onSubmit={handleCreateCR} className="p-5 bg-white border border-cj-gray-200 rounded-2xl shadow-soft space-y-4 animate-scale-in">
          <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider">Submit Change Request Proposal</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Request Title</label>
              <input
                type="text"
                required
                className="w-full text-xs p-2.5 bg-cj-gray-100 border border-transparent focus:bg-white focus:border-cj-red rounded-lg outline-none"
                placeholder="e.g. Add Cheese Bites package format..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Cost Impact (Million VND)</label>
              <input
                type="number"
                required
                className="w-full text-xs p-2.5 bg-cj-gray-100 border border-transparent focus:bg-white focus:border-cj-red rounded-lg outline-none text-right"
                placeholder="e.g. 250"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Description of Scope Change</label>
            <textarea
              required
              className="w-full text-xs p-2.5 bg-cj-gray-100 border border-transparent focus:bg-white focus:border-cj-red rounded-lg outline-none"
              rows={2}
              placeholder="What specifically is changing?"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Business Impact Justification</label>
            <textarea
              required
              className="w-full text-xs p-2.5 bg-cj-gray-100 border border-transparent focus:bg-white focus:border-cj-red rounded-lg outline-none"
              rows={2}
              placeholder="What is the incremental value, margin improvement, or channel expansion benefit?"
              value={impact}
              onChange={(e) => setImpact(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button type="button" onClick={() => setShowForm(false)} className="px-3.5 py-1.5 bg-cj-gray-100 hover:bg-cj-gray-200 text-cj-gray-800 rounded-lg text-xs font-semibold cursor-pointer">Cancel</button>
            <button type="submit" className="px-4 py-1.5 bg-cj-blue hover:bg-cj-blue/90 text-white rounded-lg text-xs font-semibold shadow cursor-pointer">Submit Proposal</button>
          </div>
        </form>
      )}

      {/* CR Table */}
      <div className="space-y-4">
        {projectCRs.map((cr) => (
          <div key={cr.id} className="bg-white border border-cj-gray-200 rounded-2xl shadow-soft p-5 space-y-4">
            
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-cj-gray-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-black text-sm text-cj-gray-800">{cr.code}: {cr.title}</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                    cr.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    cr.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-50 text-yellow-600'
                  }`}>
                    {cr.status}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Requested by: <span className="font-bold text-cj-gray-800">{cr.requestedBy}</span> on {cr.requestedDate}</p>
              </div>

              {cr.status === 'Under Review' && (
                <div className="flex items-center space-x-1.5">
                  {canDecide ? (
                    <>
                      <button
                        onClick={() => handleApprovalAction(cr.id, 'Approved')}
                        className="flex items-center space-x-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-lg shadow-sm cursor-pointer transition-colors"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleApprovalAction(cr.id, 'Rejected')}
                        className="flex items-center space-x-1 px-3 py-1 bg-cj-red hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-sm cursor-pointer transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center space-x-1 text-[10px] text-cj-orange font-bold bg-cj-orange/5 px-2 py-1 rounded">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      <span>Awaiting Steering Committee approval</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Description & Impact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              <div className="md:col-span-2 space-y-2">
                <p className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Change Description</p>
                <p className="text-cj-gray-800 leading-relaxed font-medium bg-cj-gray-100/30 p-2.5 rounded-lg border border-cj-gray-100">{cr.description}</p>

                <p className="text-gray-500 font-bold uppercase text-[9px] tracking-wider pt-1">Business Impact</p>
                <p className="text-cj-gray-800 leading-relaxed font-medium bg-cj-gray-100/30 p-2.5 rounded-lg border border-cj-gray-100">{cr.businessImpact}</p>
              </div>

              <div className="space-y-4 bg-cj-gray-100/30 p-4 rounded-xl border border-cj-gray-200/50">
                <div>
                  <p className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Cost Impact</p>
                  <div className="flex items-baseline space-x-1 mt-1">
                    <span className="text-lg font-black text-cj-gray-800">
                      {cr.costImpact >= 0 ? '+' : ''}{cr.costImpact}M
                    </span>
                    <span className="text-[10px] text-gray-500 font-semibold">VND</span>
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 font-bold uppercase text-[9px] tracking-wider">Approval Path Log</p>
                  <div className="space-y-2 mt-2">
                    {cr.approvalHistory.map((h, index) => (
                      <div key={index} className="text-[10px] border-l-2 border-cj-blue pl-2 py-0.5">
                        <p className="font-bold text-cj-gray-800">{h.step}: {h.action}</p>
                        <p className="text-gray-400">{h.actor} • {h.date}</p>
                        {h.comment && <p className="text-[9px] text-cj-blue italic mt-0.5">"{h.comment}"</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        ))}

        {projectCRs.length === 0 && (
          <div className="bg-white border border-cj-gray-200 rounded-2xl p-8 text-center text-xs text-gray-400 font-medium">
            No Scope Change Requests recorded for this project lifecycle.
          </div>
        )}
      </div>

    </div>
  );
}
