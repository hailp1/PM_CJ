'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Risk, Issue, mockUsers } from '@/data/mockData';
import { Plus, ShieldAlert, ShieldCheck, AlertCircle, HelpCircle, Save } from 'lucide-react';

export default function RiskIssueView() {
  const {
    risks,
    setRisks,
    issues,
    setIssues,
    activeProjectId,
    currentUser,
    logAction
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'risks' | 'issues'>('risks');

  // Form toggles
  const [showRiskForm, setShowRiskForm] = useState(false);
  const [showIssueForm, setShowIssueForm] = useState(false);

  // Risk inputs
  const [riskDesc, setRiskDesc] = useState('');
  const [riskProb, setRiskProb] = useState(3);
  const [riskImp, setRiskImp] = useState(3);
  const [riskOwner, setRiskOwner] = useState(mockUsers[0].name);
  const [riskMitigation, setRiskMitigation] = useState('');
  const [riskResponse, setRiskResponse] = useState<'Avoid' | 'Mitigate' | 'Transfer' | 'Accept'>('Mitigate');

  // Issue inputs
  const [issueDesc, setIssueDesc] = useState('');
  const [issueOwner, setIssueOwner] = useState(mockUsers[0].name);
  const [issuePriority, setIssuePriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [issueRoot, setIssueRoot] = useState('');
  const [issueAction, setIssueAction] = useState('');
  const [issueTargetDate, setIssueTargetDate] = useState('2026-07-15');

  const projectRisks = risks.filter((r) => r.projectId === activeProjectId);
  const projectIssues = issues.filter((i) => i.projectId === activeProjectId);

  const calculateSeverity = (prob: number, imp: number): Risk['severity'] => {
    const score = prob * imp;
    if (score >= 15) return 'Critical';
    if (score >= 10) return 'High';
    if (score >= 5) return 'Medium';
    return 'Low';
  };

  const handleAddRisk = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser.role === 'Viewer') {
      alert('Unauthorized: Viewers cannot register risks.');
      return;
    }

    const severity = calculateSeverity(riskProb, riskImp);
    const newRisk: Risk = {
      id: 'r_' + Math.random().toString(36).substr(2, 9),
      projectId: activeProjectId,
      code: `RSK-${String(risks.length + 1).padStart(3, '0')}`,
      description: riskDesc,
      probability: riskProb,
      impact: riskImp,
      severity,
      ownerName: riskOwner,
      mitigation: riskMitigation,
      responseStrategy: riskResponse,
      status: 'Open'
    };

    setRisks((prev) => [...prev, newRisk]);
    setShowRiskForm(false);
    setRiskDesc('');
    setRiskMitigation('');
    logAction(activeProjectId, `Registered Risk: "${riskDesc}" with severity ${severity}`);
  };

  const handleAddIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser.role === 'Viewer') {
      alert('Unauthorized: Viewers cannot log issues.');
      return;
    }

    const newIssue: Issue = {
      id: 'i_' + Math.random().toString(36).substr(2, 9),
      projectId: activeProjectId,
      code: `ISS-${String(issues.length + 1).padStart(3, '0')}`,
      description: issueDesc,
      ownerName: issueOwner,
      priority: issuePriority,
      rootCause: issueRoot,
      correctiveAction: issueAction,
      targetDate: issueTargetDate,
      status: 'Open'
    };

    setIssues((prev) => [...prev, newIssue]);
    setShowIssueForm(false);
    setIssueDesc('');
    setIssueRoot('');
    setIssueAction('');
    logAction(activeProjectId, `Logged Issue: "${issueDesc}"`);
  };

  const handleToggleRiskStatus = (riskId: string) => {
    if (currentUser.role === 'Viewer') return;
    setRisks((prev) =>
      prev.map((r) =>
        r.id === riskId
          ? { ...r, status: r.status === 'Open' ? 'Mitigated' : r.status === 'Mitigated' ? 'Closed' : 'Open' }
          : r
      )
    );
  };

  const handleToggleIssueStatus = (issueId: string) => {
    if (currentUser.role === 'Viewer') return;
    setIssues((prev) =>
      prev.map((i) =>
        i.id === issueId
          ? { ...i, status: i.status === 'Open' ? 'Resolved' : i.status === 'Resolved' ? 'Closed' : 'Open' }
          : i
      )
    );
  };

  const isReadOnly = currentUser.role === 'Viewer';

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-[calc(100vh-64px)] w-full">
      {/* Title Header */}
      <div className="flex justify-between items-center border-b border-cj-gray-200/80 pb-4">
        <div>
          <span className="text-[10px] text-cj-red font-bold uppercase tracking-wider block bg-cj-red/5 px-2 py-0.5 rounded-full w-max">
            PMBOK Governance & Risk Control
          </span>
          <h1 className="text-xl font-extrabold text-cj-gray-800 mt-1">Governing Risk Register & Issue Log</h1>
          <p className="text-xs text-gray-500">Proactively identify critical risks, plan mitigations, log blocking issues, and track corrective actions.</p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-white border border-cj-gray-200 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveSubTab('risks')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'risks' ? 'bg-cj-blue text-white shadow-sm' : 'text-gray-500 hover:text-cj-gray-800'
            }`}
          >
            Risk Register
          </button>
          <button
            onClick={() => setActiveSubTab('issues')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'issues' ? 'bg-cj-blue text-white shadow-sm' : 'text-gray-500 hover:text-cj-gray-800'
            }`}
          >
            Issue Log
          </button>
        </div>
      </div>

      {activeSubTab === 'risks' ? (
        <div className="space-y-6">
          {/* Risk Actions header */}
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider">Identified Project Risks</h3>
            {!isReadOnly && (
              <button
                onClick={() => setShowRiskForm(!showRiskForm)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-cj-blue hover:bg-cj-blue/90 text-white rounded-lg text-xs font-semibold shadow-sm cursor-pointer transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Register Risk</span>
              </button>
            )}
          </div>

          {/* Add Risk Form */}
          {showRiskForm && (
            <form onSubmit={handleAddRisk} className="p-5 bg-white border border-cj-gray-200 rounded-2xl shadow-soft space-y-4 animate-scale-in">
              <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider">Register New Risk</h3>
              
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Risk Description</label>
                <textarea
                  required
                  className="w-full text-xs p-2.5 bg-cj-gray-100 border border-transparent focus:bg-white focus:border-cj-red rounded-lg outline-none"
                  rows={2}
                  placeholder="e.g. Regulatory certificate processing delay..."
                  value={riskDesc}
                  onChange={(e) => setRiskDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Probability (1-5)</label>
                  <select
                    className="w-full text-xs p-2 bg-cj-gray-100 border border-transparent rounded-lg cursor-pointer"
                    value={riskProb}
                    onChange={(e) => setRiskProb(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Impact (1-5)</label>
                  <select
                    className="w-full text-xs p-2 bg-cj-gray-100 border border-transparent rounded-lg cursor-pointer"
                    value={riskImp}
                    onChange={(e) => setRiskImp(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Response Strategy</label>
                  <select
                    className="w-full text-xs p-2 bg-cj-gray-100 border border-transparent rounded-lg cursor-pointer"
                    value={riskResponse}
                    onChange={(e) => setRiskResponse(e.target.value as any)}
                  >
                    <option value="Mitigate">Mitigate</option>
                    <option value="Avoid">Avoid</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Accept">Accept</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Risk Owner</label>
                  <select
                    className="w-full text-xs p-2 bg-cj-gray-100 border border-transparent rounded-lg cursor-pointer"
                    value={riskOwner}
                    onChange={(e) => setRiskOwner(e.target.value)}
                  >
                    {mockUsers.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Mitigation Plan</label>
                <textarea
                  required
                  className="w-full text-xs p-2.5 bg-cj-gray-100 border border-transparent focus:bg-white focus:border-cj-red rounded-lg outline-none"
                  rows={2}
                  placeholder="Explain steps to reduce probability or impact..."
                  value={riskMitigation}
                  onChange={(e) => setRiskMitigation(e.target.value)}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowRiskForm(false)} className="px-3.5 py-1.5 bg-cj-gray-100 hover:bg-cj-gray-200 text-cj-gray-800 rounded-lg text-xs font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-cj-blue hover:bg-cj-blue/90 text-white rounded-lg text-xs font-semibold shadow cursor-pointer">Register Risk</button>
              </div>
            </form>
          )}

          {/* Risks Table */}
          <div className="bg-white border border-cj-gray-200 rounded-2xl shadow-soft overflow-hidden">
            <table className="min-w-full divide-y divide-cj-gray-200">
              <thead className="bg-cj-gray-100/50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="py-3.5 pl-6 pr-3 text-left">Code</th>
                  <th className="px-3 py-3.5 text-left">Description</th>
                  <th className="px-3 py-3.5 text-center">Prob/Imp</th>
                  <th className="px-3 py-3.5 text-center">Severity</th>
                  <th className="px-3 py-3.5 text-left">Mitigation Plan</th>
                  <th className="px-3 py-3.5 text-left">Owner</th>
                  <th className="px-3 py-3.5 text-center">Strategy</th>
                  <th className="px-3 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-cj-gray-100">
                {projectRisks.map((r) => (
                  <tr key={r.id} className="hover:bg-cj-gray-100/10 text-xs">
                    <td className="py-4 pl-6 pr-3 font-bold text-cj-gray-800">{r.code}</td>
                    <td className="px-3 py-4 font-medium text-cj-gray-800 max-w-[200px]">{r.description}</td>
                    <td className="px-3 py-4 text-center font-extrabold text-cj-gray-700">{r.probability} × {r.impact}</td>
                    <td className="px-3 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                        r.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                        r.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                        r.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {r.severity}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-gray-500 max-w-[220px]">{r.mitigation}</td>
                    <td className="px-3 py-4 font-bold text-cj-gray-800">{r.ownerName}</td>
                    <td className="px-3 py-4 text-center"><span className="text-[10px] bg-cj-blue/5 text-cj-blue px-2 py-0.5 rounded font-bold">{r.responseStrategy}</span></td>
                    <td className="px-3 py-4 text-center">
                      <button
                        onClick={() => handleToggleRiskStatus(r.id)}
                        disabled={isReadOnly}
                        className={`px-2 py-0.5 rounded-full font-black text-[9px] uppercase cursor-pointer select-none ${
                          r.status === 'Closed' ? 'bg-green-100 text-green-700' :
                          r.status === 'Mitigated' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-600'
                        }`}
                      >
                        {r.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Issue Actions header */}
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider">Blocking Project Issues</h3>
            {!isReadOnly && (
              <button
                onClick={() => setShowIssueForm(!showIssueForm)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-cj-blue hover:bg-cj-blue/90 text-white rounded-lg text-xs font-semibold shadow-sm cursor-pointer transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Log Issue</span>
              </button>
            )}
          </div>

          {/* Add Issue Form */}
          {showIssueForm && (
            <form onSubmit={handleAddIssue} className="p-5 bg-white border border-cj-gray-200 rounded-2xl shadow-soft space-y-4 animate-scale-in">
              <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider">Log Blocking Issue</h3>
              
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Issue Description</label>
                <textarea
                  required
                  className="w-full text-xs p-2.5 bg-cj-gray-100 border border-transparent focus:bg-white focus:border-cj-red rounded-lg outline-none"
                  rows={2}
                  placeholder="Explain current problem..."
                  value={issueDesc}
                  onChange={(e) => setIssueDesc(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Priority</label>
                  <select
                    className="w-full text-xs p-2 bg-cj-gray-100 border border-transparent rounded-lg cursor-pointer"
                    value={issuePriority}
                    onChange={(e) => setIssuePriority(e.target.value as any)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Issue Owner</label>
                  <select
                    className="w-full text-xs p-2 bg-cj-gray-100 border border-transparent rounded-lg cursor-pointer"
                    value={issueOwner}
                    onChange={(e) => setIssueOwner(e.target.value)}
                  >
                    {mockUsers.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Target Resolution Date</label>
                  <input
                    type="date"
                    required
                    className="w-full text-xs p-1.5 bg-cj-gray-100 border border-transparent rounded-lg focus:bg-white"
                    value={issueTargetDate}
                    onChange={(e) => setIssueTargetDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Root Cause Analysis</label>
                  <textarea
                    required
                    className="w-full text-xs p-2.5 bg-cj-gray-100 border border-transparent focus:bg-white focus:border-cj-red rounded-lg outline-none"
                    rows={2}
                    placeholder="Why did this issue occur?"
                    value={issueRoot}
                    onChange={(e) => setIssueRoot(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Corrective Action Plan</label>
                  <textarea
                    required
                    className="w-full text-xs p-2.5 bg-cj-gray-100 border border-transparent focus:bg-white focus:border-cj-red rounded-lg outline-none"
                    rows={2}
                    placeholder="Steps to resolve the block..."
                    value={issueAction}
                    onChange={(e) => setIssueAction(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowIssueForm(false)} className="px-3.5 py-1.5 bg-cj-gray-100 hover:bg-cj-gray-200 text-cj-gray-800 rounded-lg text-xs font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-cj-blue hover:bg-cj-blue/90 text-white rounded-lg text-xs font-semibold shadow cursor-pointer">Log Issue</button>
              </div>
            </form>
          )}

          {/* Issues Table */}
          <div className="bg-white border border-cj-gray-200 rounded-2xl shadow-soft overflow-hidden">
            <table className="min-w-full divide-y divide-cj-gray-200">
              <thead className="bg-cj-gray-100/50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="py-3.5 pl-6 pr-3 text-left">Code</th>
                  <th className="px-3 py-3.5 text-left">Issue</th>
                  <th className="px-3 py-3.5 text-center">Priority</th>
                  <th className="px-3 py-3.5 text-left">Root Cause</th>
                  <th className="px-3 py-3.5 text-left">Corrective Action</th>
                  <th className="px-3 py-3.5 text-left">Target Date</th>
                  <th className="px-3 py-3.5 text-left">Owner</th>
                  <th className="px-3 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-cj-gray-100">
                {projectIssues.map((i) => (
                  <tr key={i.id} className="hover:bg-cj-gray-100/10 text-xs">
                    <td className="py-4 pl-6 pr-3 font-bold text-cj-gray-800">{i.code}</td>
                    <td className="px-3 py-4 font-medium text-cj-gray-800 max-w-[200px]">{i.description}</td>
                    <td className="px-3 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                        i.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                        i.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                        'bg-cj-blue/5 text-cj-blue'
                      }`}>
                        {i.priority}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-gray-500 max-w-[200px]">{i.rootCause}</td>
                    <td className="px-3 py-4 text-gray-500 max-w-[200px]">{i.correctiveAction}</td>
                    <td className="px-3 py-4 font-medium text-cj-gray-800">{i.targetDate}</td>
                    <td className="px-3 py-4 font-bold text-cj-gray-800">{i.ownerName}</td>
                    <td className="px-3 py-4 text-center">
                      <button
                        onClick={() => handleToggleIssueStatus(i.id)}
                        disabled={isReadOnly}
                        className={`px-2 py-0.5 rounded-full font-black text-[9px] uppercase cursor-pointer select-none ${
                          i.status === 'Closed' ? 'bg-green-100 text-green-700' :
                          i.status === 'Resolved' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-600'
                        }`}
                      >
                        {i.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
