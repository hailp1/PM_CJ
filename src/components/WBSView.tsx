'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Task, mockUsers } from '@/data/mockData';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Calendar,
  CheckCircle,
  HelpCircle,
  Users
} from 'lucide-react';

export default function WBSView() {
  const { tasks, setTasks, activeProjectId, currentUser, logAction } = useApp();
  const [expandedTasks, setExpandedTasks] = useState<{ [key: string]: boolean }>({
    't1_1': true,
    't1_3': true,
    't1_5': true
  });

  // Task creation states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPicId, setNewPicId] = useState(mockUsers[0].id);
  const [newParentId, setNewParentId] = useState<string>('null');
  const [newStartDate, setNewStartDate] = useState('2026-06-01');
  const [newDueDate, setNewDueDate] = useState('2026-06-30');
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [newRaci, setNewRaci] = useState<'R' | 'A' | 'C' | 'I'>('R');

  const projectTasks = tasks.filter((t) => t.projectId === activeProjectId);

  const toggleExpand = (id: string) => {
    setExpandedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Build hierarchically nested tree structure
  const buildTree = (parentId: string | null): Task[] => {
    return projectTasks.filter((t) => t.parentId === parentId);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUser.role === 'Viewer') {
      alert('Unauthorized: Viewers cannot create tasks.');
      return;
    }

    const matchedPic = mockUsers.find((u) => u.id === newPicId);

    const newTask: Task = {
      id: 't_' + Math.random().toString(36).substr(2, 9),
      projectId: activeProjectId,
      parentId: newParentId === 'null' ? null : newParentId,
      title: newTitle,
      description: newDesc,
      picId: newPicId,
      picName: matchedPic ? matchedPic.name : 'Unknown',
      startDate: newStartDate,
      dueDate: newDueDate,
      durationDays: Math.ceil(
        (new Date(newDueDate).getTime() - new Date(newStartDate).getTime()) / (1000 * 3600 * 24)
      ) || 1,
      dependencies: [],
      priority: newPriority,
      progress: 0,
      status: 'To Do',
      estimatedHours: 40,
      actualHours: 0,
      raci: newRaci,
      checklist: [],
      approvals: []
    };

    setTasks((prev) => [...prev, newTask]);
    setShowAddForm(false);
    setNewTitle('');
    setNewDesc('');
    logAction(activeProjectId, `Created WBS task: "${newTitle}"`);
  };

  const handleDeleteTask = (id: string) => {
    if (currentUser.role === 'Viewer') {
      alert('Unauthorized: Viewers cannot delete tasks.');
      return;
    }
    setTasks((prev) => prev.filter((t) => t.id !== id && t.parentId !== id));
    logAction(activeProjectId, `Removed task and its children: ID ${id}`);
  };

  const isReadOnly = currentUser.role === 'Viewer';

  // Recursive Tree Node component
  const TreeNode = ({ task, depth = 0 }: { task: Task; depth: number }) => {
    const children = projectTasks.filter((t) => t.parentId === task.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedTasks[task.id];

    return (
      <>
        <tr className="hover:bg-cj-gray-100/30 border-b border-cj-gray-100 transition-colors">
          <td className="py-3.5 pl-4 pr-3 text-xs" style={{ paddingLeft: `${depth * 20 + 16}px` }}>
            <div className="flex items-center space-x-1.5">
              {hasChildren ? (
                <button onClick={() => toggleExpand(task.id)} className="p-0.5 rounded hover:bg-cj-gray-200 cursor-pointer">
                  {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                </button>
              ) : (
                <div className="w-5" />
              )}
              <span className="font-extrabold text-cj-gray-800">{task.title}</span>
            </div>
          </td>
          <td className="px-3 py-3.5 text-xs text-gray-500 max-w-[200px] truncate">{task.description}</td>
          <td className="px-3 py-3.5 text-xs">
            <div className="flex items-center space-x-1">
              <Users className="h-3.5 w-3.5 text-gray-400" />
              <span className="font-bold text-cj-gray-700">{task.picName}</span>
            </div>
          </td>
          <td className="px-3 py-3.5 text-xs text-gray-500 font-medium">
            {task.startDate} ~ {task.dueDate}
          </td>
          <td className="px-3 py-3.5 text-xs font-black text-center text-cj-blue">{task.progress}%</td>
          <td className="px-3 py-3.5 text-xs text-center">
            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
              task.status === 'Completed' ? 'bg-green-100 text-green-700' :
              task.status === 'In Progress' ? 'bg-cj-blue/10 text-cj-blue' :
              task.status === 'Review' ? 'bg-cj-orange/10 text-cj-orange' :
              'bg-gray-100 text-gray-500'
            }`}>
              {task.status}
            </span>
          </td>
          <td className="px-3 py-3.5 text-xs text-center">
            <span className="font-black text-cj-red bg-cj-red/5 px-2 py-0.5 rounded">{task.raci}</span>
          </td>
          <td className="px-3 py-3.5 text-xs text-center">
            {!isReadOnly && (
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="text-gray-400 hover:text-cj-red transition-colors cursor-pointer p-1 rounded hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </td>
        </tr>
        {hasChildren && isExpanded && children.map((child) => (
          <TreeNode key={child.id} task={child} depth={depth + 1} />
        ))}
      </>
    );
  };

  const rootTasks = buildTree(null);

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-[calc(100vh-64px)] w-full">
      
      {/* Header section */}
      <div className="flex justify-between items-center border-b border-cj-gray-200 pb-4">
        <div>
          <span className="text-[10px] text-cj-red font-bold uppercase tracking-wider block bg-cj-red/5 px-2 py-0.5 rounded-full w-max">
            PMBOK Scope & WBS
          </span>
          <h1 className="text-xl font-extrabold text-cj-gray-800 mt-1">Work Breakdown Structure (WBS)</h1>
          <p className="text-xs text-gray-500">Deconstruct project scope into hierarchical phases, deliverables, and actionable work packages.</p>
        </div>

        {!isReadOnly && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-1 px-3 py-1.5 bg-cj-blue hover:bg-cj-blue/95 text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add WBS Task</span>
          </button>
        )}
      </div>

      {/* Task Creation Form Panel */}
      {showAddForm && (
        <form onSubmit={handleAddTask} className="p-5 bg-white border border-cj-gray-200 rounded-2xl shadow-soft space-y-4 animate-scale-in">
          <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider">Add New WBS Task Element</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Task Title</label>
              <input
                type="text"
                required
                className="w-full text-xs p-2.5 bg-cj-gray-100 border border-transparent focus:bg-white focus:border-cj-red rounded-lg outline-none transition-all"
                placeholder="e.g. Phase 5: Trial packaging design"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Parent WBS Element</label>
              <select
                className="w-full text-xs p-2.5 bg-cj-gray-100 border border-transparent focus:bg-white focus:border-cj-red rounded-lg outline-none cursor-pointer"
                value={newParentId}
                onChange={(e) => setNewParentId(e.target.value)}
              >
                <option value="null">None (Root Level Phase)</option>
                {projectTasks
                  .filter((t) => t.parentId === null)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Person In Charge (PIC)</label>
              <select
                className="w-full text-xs p-2.5 bg-cj-gray-100 border border-transparent focus:bg-white focus:border-cj-red rounded-lg outline-none cursor-pointer"
                value={newPicId}
                onChange={(e) => setNewPicId(e.target.value)}
              >
                {mockUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Start Date</label>
              <input
                type="date"
                required
                className="w-full text-xs p-2 bg-cj-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-cj-red outline-none"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Due Date</label>
              <input
                type="date"
                required
                className="w-full text-xs p-2 bg-cj-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-cj-red outline-none"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">RACI Matrix Assignment</label>
              <select
                className="w-full text-xs p-2.5 bg-cj-gray-100 border border-transparent focus:bg-white focus:border-cj-red rounded-lg outline-none cursor-pointer"
                value={newRaci}
                onChange={(e) => setNewRaci(e.target.value as any)}
              >
                <option value="R">Responsible (R)</option>
                <option value="A">Accountable (A)</option>
                <option value="C">Consulted (C)</option>
                <option value="I">Informed (I)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Short Description</label>
            <textarea
              className="w-full text-xs p-2 bg-cj-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-cj-red outline-none"
              rows={2}
              placeholder="Provide scope description or details..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3.5 py-1.5 bg-cj-gray-100 hover:bg-cj-gray-200 text-cj-gray-800 rounded-lg text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-cj-blue hover:bg-cj-blue/90 text-white rounded-lg text-xs font-semibold shadow cursor-pointer"
            >
              Create WBS Element
            </button>
          </div>
        </form>
      )}

      {/* Hierarchical WBS Table */}
      <div className="bg-white rounded-2xl border border-cj-gray-200/80 shadow-soft overflow-hidden">
        <table className="min-w-full divide-y divide-cj-gray-200">
          <thead className="bg-cj-gray-100/50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
            <tr>
              <th scope="col" className="py-3 pl-6 pr-3 text-left">Hierarchy element / Title</th>
              <th scope="col" className="px-3 py-3 text-left">Description</th>
              <th scope="col" className="px-3 py-3 text-left">Owner (PIC)</th>
              <th scope="col" className="px-3 py-3 text-left">Target Dates</th>
              <th scope="col" className="px-3 py-3 text-center">Progress</th>
              <th scope="col" className="px-3 py-3 text-center">Status</th>
              <th scope="col" className="px-3 py-3 text-center">RACI</th>
              <th scope="col" className="px-3 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-cj-gray-100">
            {rootTasks.length > 0 ? (
              rootTasks.map((t) => (
                <TreeNode key={t.id} task={t} depth={0} />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-8 text-xs text-gray-400">
                  No tasks found in WBS registry. Use the Add Task button to initialize elements.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
