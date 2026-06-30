'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ProjectDocument, Meeting } from '@/data/mockData';
import {
  Folder,
  FileSpreadsheet,
  FileText,
  FileImage,
  Plus,
  Eye,
  Calendar,
  Clock,
  CheckCircle,
  X,
  Search
} from 'lucide-react';

export default function DocsMeetingsView() {
  const {
    documents,
    setDocuments,
    meetings,
    setMeetings,
    activeProjectId,
    currentUser,
    logAction
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'docs' | 'meetings'>('docs');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Preview modal state
  const [previewDoc, setPreviewDoc] = useState<ProjectDocument | null>(null);

  // Forms states
  const [showDocForm, setShowDocForm] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocFolder, setNewDocFolder] = useState<ProjectDocument['folder']>('General');
  
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [meetTitle, setMeetTitle] = useState('');
  const [meetDate, setMeetDate] = useState('2026-06-30');
  const [meetTime, setMeetTime] = useState('10:00 - 11:00');
  const [meetAgenda, setMeetAgenda] = useState('');
  const [meetDecisions, setMeetDecisions] = useState('');

  const projectDocs = documents.filter((d) => d.projectId === activeProjectId && d.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const projectMeetings = meetings.filter((m) => m.projectId === activeProjectId);

  const getDocIcon = (name: string) => {
    if (name.endsWith('.xlsx')) return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
    if (name.endsWith('.png') || name.endsWith('.jpg')) return <FileImage className="h-5 w-5 text-purple-600" />;
    return <FileText className="h-5 w-5 text-cj-blue" />;
  };

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser.role === 'Viewer') {
      alert('Unauthorized: Viewers cannot upload files.');
      return;
    }

    const newDoc: ProjectDocument = {
      id: 'd_' + Math.random().toString(36).substr(2, 9),
      projectId: activeProjectId,
      name: newDocName,
      folder: newDocFolder,
      version: '1.0',
      updatedBy: currentUser.name,
      updatedAt: new Date().toISOString().split('T')[0],
      size: '2.5 MB',
      status: 'Pending Review',
      fileUrl: '#'
    };

    setDocuments((prev) => [...prev, newDoc]);
    setShowDocForm(false);
    setNewDocName('');
    logAction(activeProjectId, `Uploaded document: "${newDocName}"`);
  };

  const handleCreateMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser.role === 'Viewer') {
      alert('Unauthorized: Viewers cannot create meeting minutes.');
      return;
    }

    const newMeeting: Meeting = {
      id: 'm_' + Math.random().toString(36).substr(2, 9),
      projectId: activeProjectId,
      title: meetTitle,
      date: meetDate,
      time: meetTime,
      agenda: meetAgenda.split('\n').filter(Boolean),
      minutes: 'Meeting notes finalized. Actions items generated below.',
      decisions: meetDecisions.split('\n').filter(Boolean),
      actionItems: []
    };

    setMeetings((prev) => [...prev, newMeeting]);
    setShowMeetingForm(false);
    setMeetTitle('');
    setMeetAgenda('');
    setMeetDecisions('');
    logAction(activeProjectId, `Logged meeting minutes: "${meetTitle}"`);
  };

  const handleApproveDoc = (docId: string) => {
    if (currentUser.role === 'Viewer') return;
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status: 'Approved' } : d))
    );
    if (previewDoc?.id === docId) {
      setPreviewDoc((prev) => (prev ? { ...prev, status: 'Approved' } : null));
    }
    logAction(activeProjectId, `Approved document ID ${docId}`);
  };

  const isReadOnly = currentUser.role === 'Viewer';

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-[calc(100vh-64px)] w-full">
      {/* Title Header */}
      <div className="flex justify-between items-center border-b border-cj-gray-200/80 pb-4">
        <div>
          <span className="text-[10px] text-cj-red font-bold uppercase tracking-wider block bg-cj-red/5 px-2 py-0.5 rounded-full w-max">
            PMBOK Communications & Artifacts
          </span>
          <h1 className="text-xl font-extrabold text-cj-gray-800 mt-1">Document Center & Meetings Log</h1>
          <p className="text-xs text-gray-500">Manage project deliverables documentation, version history, and organize meeting agendas/action items.</p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center bg-white border border-cj-gray-200 rounded-xl p-1 shadow-sm">
          <button
            onClick={() => setActiveSubTab('docs')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'docs' ? 'bg-cj-blue text-white shadow-sm' : 'text-gray-500 hover:text-cj-gray-800'
            }`}
          >
            Documents Center
          </button>
          <button
            onClick={() => setActiveSubTab('meetings')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'meetings' ? 'bg-cj-blue text-white shadow-sm' : 'text-gray-500 hover:text-cj-gray-800'
            }`}
          >
            Meeting Notes
          </button>
        </div>
      </div>

      {activeSubTab === 'docs' ? (
        <div className="space-y-5 animate-fade-in">
          {/* Docs Actions header */}
          <div className="flex justify-between items-center">
            {/* Search filter */}
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Filter documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border rounded-lg focus:border-cj-red outline-none"
              />
            </div>

            {!isReadOnly && (
              <button
                onClick={() => setShowDocForm(!showDocForm)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-cj-blue hover:bg-cj-blue/90 text-white rounded-lg text-xs font-semibold shadow shadow-sm cursor-pointer transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Upload Document</span>
              </button>
            )}
          </div>

          {/* Doc Upload Form */}
          {showDocForm && (
            <form onSubmit={handleUploadDoc} className="p-5 bg-white border border-cj-gray-200 rounded-2xl shadow-soft space-y-4 animate-scale-in">
              <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider">Simulate Uploading Document</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">File Name (with extension)</label>
                  <input
                    type="text"
                    required
                    className="w-full text-xs p-2.5 bg-cj-gray-100 border border-transparent focus:bg-white focus:border-cj-red rounded-lg outline-none"
                    placeholder="e.g. Artwork_Premium_Mandu_V4.png"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Repository Folder</label>
                  <select
                    className="w-full text-xs p-2.5 bg-cj-gray-100 border border-transparent rounded-lg cursor-pointer"
                    value={newDocFolder}
                    onChange={(e) => setNewDocFolder(e.target.value as any)}
                  >
                    <option value="Project Charter">Project Charter</option>
                    <option value="Stage-Gate Art">Stage-Gate Art</option>
                    <option value="POSM & Designs">POSM & Designs</option>
                    <option value="Financials">Financials</option>
                    <option value="Meeting Minutes">Meeting Minutes</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowDocForm(false)} className="px-3.5 py-1.5 bg-cj-gray-100 hover:bg-cj-gray-200 text-cj-gray-800 rounded-lg text-xs font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-cj-blue hover:bg-cj-blue/90 text-white rounded-lg text-xs font-semibold shadow cursor-pointer">Upload File</button>
              </div>
            </form>
          )}

          {/* Folders & Documents Matrix list */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Left folder checklist quick filter */}
            <div className="space-y-1.5 bg-white p-4 border border-cj-gray-200 rounded-2xl shadow-soft">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Repository Folders</span>
              {['Project Charter', 'Stage-Gate Art', 'POSM & Designs', 'Financials', 'Meeting Minutes', 'General'].map((f) => (
                <div
                  key={f}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-cj-gray-100/40 text-xs font-bold text-cj-gray-700 cursor-pointer transition-colors"
                >
                  <Folder className="h-4 w-4 text-cj-orange" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Right: Docs List */}
            <div className="md:col-span-3 bg-white border border-cj-gray-200 rounded-2xl shadow-soft overflow-hidden">
              <table className="min-w-full divide-y divide-cj-gray-200">
                <thead className="bg-cj-gray-100/50 text-[10px] font-bold uppercase text-gray-500 tracking-wider">
                  <tr>
                    <th className="py-3 pl-6 pr-3 text-left">Document Name</th>
                    <th className="px-3 py-3 text-left">Folder</th>
                    <th className="px-3 py-3 text-center">Version</th>
                    <th className="px-3 py-3 text-left">Modified</th>
                    <th className="px-3 py-3 text-center">Status</th>
                    <th className="px-3 py-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cj-gray-100">
                  {projectDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-cj-gray-100/10 text-xs">
                      <td className="py-3.5 pl-6 pr-3 font-bold text-cj-gray-800">
                        <div className="flex items-center space-x-2">
                          {getDocIcon(doc.name)}
                          <span>{doc.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3.5 text-gray-500 font-semibold">{doc.folder}</td>
                      <td className="px-3 py-3.5 text-center font-extrabold text-cj-blue">v{doc.version}</td>
                      <td className="px-3 py-3.5 text-gray-500">
                        <p className="font-bold text-cj-gray-700">{doc.updatedBy}</p>
                        <p className="text-[10px]">{doc.updatedAt} • {doc.size}</p>
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] uppercase ${
                          doc.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-50 text-yellow-600'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-3 py-3.5 text-center">
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          className="text-cj-blue hover:text-cj-blue/80 p-1 rounded hover:bg-cj-blue/5 transition-all cursor-pointer"
                        >
                          <Eye className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Office Preview Modal Overlay */}
          {previewDoc && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
              <div className="bg-white rounded-2xl shadow-soft border border-cj-gray-200 max-w-2xl w-full overflow-hidden animate-scale-in">
                
                {/* Header */}
                <div className="p-4 border-b bg-cj-gray-100/50 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {getDocIcon(previewDoc.name)}
                    <span className="font-bold text-sm text-cj-gray-800">{previewDoc.name}</span>
                  </div>
                  <button onClick={() => setPreviewDoc(null)} className="text-gray-400 hover:text-cj-red transition-all cursor-pointer">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Simulated Viewer Body */}
                <div className="p-6 space-y-4">
                  <div className="h-64 bg-cj-gray-100/50 rounded-xl border border-dashed border-cj-gray-200 flex flex-col items-center justify-center text-center">
                    <FileText className="h-12 w-12 text-cj-blue/30 mb-2" />
                    <p className="text-xs font-bold text-cj-gray-800">Microsoft Office 365 / PDF Preview Service</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Authorised connection secure tunnel session active.</p>
                    <div className="mt-4 p-3 bg-white rounded-lg border text-left max-w-md">
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Document Metadata</p>
                      <p className="text-xs mt-1 text-cj-gray-800"><b>Version:</b> {previewDoc.version} | <b>Updated:</b> {previewDoc.updatedAt}</p>
                      <p className="text-xs text-cj-gray-800"><b>Approver:</b> PMO steering committee validation required.</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-cj-gray-100 pt-4">
                    <div className="text-xs">
                      <span>Status: <b className="text-cj-blue">{previewDoc.status}</b></span>
                    </div>

                    <div className="flex space-x-2">
                      {previewDoc.status !== 'Approved' && !isReadOnly && (
                        <button
                          onClick={() => handleApproveDoc(previewDoc.id)}
                          className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-xs shadow cursor-pointer transition-colors"
                        >
                          Approve Sign-off
                        </button>
                      )}
                      <button
                        onClick={() => setPreviewDoc(null)}
                        className="px-3.5 py-1.5 bg-cj-gray-100 hover:bg-cj-gray-200 text-cj-gray-800 rounded-lg text-xs font-semibold cursor-pointer"
                      >
                        Close Preview
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {/* Meetings Actions Header */}
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider">Minutes of Meeting (MoM)</h3>
            {!isReadOnly && (
              <button
                onClick={() => setShowMeetingForm(!showMeetingForm)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-cj-blue hover:bg-cj-blue/90 text-white rounded-lg text-xs font-semibold shadow shadow-sm cursor-pointer transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Log Meeting Notes</span>
              </button>
            )}
          </div>

          {/* Add Meeting Form */}
          {showMeetingForm && (
            <form onSubmit={handleCreateMeeting} className="p-5 bg-white border border-cj-gray-200 rounded-2xl shadow-soft space-y-4 animate-scale-in">
              <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider">Log Minutes of Meeting</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Meeting Title</label>
                  <input
                    type="text"
                    required
                    className="w-full text-xs p-2.5 bg-cj-gray-100 border border-transparent focus:bg-white focus:border-cj-red rounded-lg outline-none"
                    placeholder="e.g. Stage 2 Gate Feasibility Sign-off Sync..."
                    value={meetTitle}
                    onChange={(e) => setMeetTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      className="w-full text-xs p-1.5 bg-cj-gray-100 border border-transparent rounded-lg focus:bg-white"
                      value={meetDate}
                      onChange={(e) => setMeetDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Time</label>
                    <input
                      type="text"
                      required
                      className="w-full text-xs p-1.5 bg-cj-gray-100 border border-transparent rounded-lg focus:bg-white"
                      value={meetTime}
                      onChange={(e) => setMeetTime(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Agenda Points (One per line)</label>
                  <textarea
                    required
                    className="w-full text-xs p-2.5 bg-cj-gray-100 border border-transparent focus:bg-white rounded-lg outline-none"
                    rows={3}
                    placeholder="Agenda 1&#10;Agenda 2"
                    value={meetAgenda}
                    onChange={(e) => setMeetAgenda(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Decisions Made (One per line)</label>
                  <textarea
                    required
                    className="w-full text-xs p-2.5 bg-cj-gray-100 border border-transparent focus:bg-white rounded-lg outline-none"
                    rows={3}
                    placeholder="Decision 1&#10;Decision 2"
                    value={meetDecisions}
                    onChange={(e) => setMeetDecisions(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowMeetingForm(false)} className="px-3.5 py-1.5 bg-cj-gray-100 hover:bg-cj-gray-200 text-cj-gray-800 rounded-lg text-xs font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-cj-blue hover:bg-cj-blue/90 text-white rounded-lg text-xs font-semibold shadow cursor-pointer">Log Meeting Minutes</button>
              </div>
            </form>
          )}

          {/* Meetings List */}
          <div className="space-y-5">
            {projectMeetings.map((meet) => (
              <div key={meet.id} className="bg-white border border-cj-gray-200 rounded-2xl shadow-soft p-5 space-y-4">
                <div className="flex justify-between items-start border-b border-cj-gray-100 pb-3">
                  <div>
                    <h4 className="font-black text-sm text-cj-gray-800">{meet.title}</h4>
                    <div className="flex items-center space-x-3 text-[10px] text-gray-500 mt-1 font-semibold">
                      <span className="flex items-center"><Calendar className="h-3.5 w-3.5 text-gray-400 mr-1" />{meet.date}</span>
                      <span className="flex items-center"><Clock className="h-3.5 w-3.5 text-gray-400 mr-1" />{meet.time}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                  {/* Left: Agenda & Minutes */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-500 font-bold uppercase text-[9px] tracking-wider mb-1">Meeting Agenda</p>
                      <ul className="list-disc pl-4 space-y-1 text-cj-gray-800 font-medium">
                        {meet.agenda.map((a, idx) => <li key={idx}>{a}</li>)}
                      </ul>
                    </div>

                    <div>
                      <p className="text-gray-500 font-bold uppercase text-[9px] tracking-wider mb-1">Summary Minutes</p>
                      <p className="text-cj-gray-800 bg-cj-gray-100/40 p-2.5 rounded-lg border border-cj-gray-100">{meet.minutes}</p>
                    </div>
                  </div>

                  {/* Right: Decisions */}
                  <div>
                    <p className="text-gray-500 font-bold uppercase text-[9px] tracking-wider mb-1">Key Decisions Made</p>
                    <ul className="space-y-1.5">
                      {meet.decisions.map((d, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-cj-gray-800 font-semibold">
                          <CheckCircle className="h-4.5 w-4.5 text-green-500 shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
