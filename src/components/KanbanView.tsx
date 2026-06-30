'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Task, mockUsers } from '@/data/mockData';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  User,
  MoreVertical,
  Plus
} from 'lucide-react';

const COLUMNS: { id: Task['status']; label: string; color: string }[] = [
  { id: 'Backlog', label: 'Backlog', color: 'bg-gray-100 border-t-gray-400' },
  { id: 'Planning', label: 'Planning', color: 'bg-cj-orange/5 border-t-cj-orange' },
  { id: 'To Do', label: 'To Do', color: 'bg-cj-blue/5 border-t-cj-blue' },
  { id: 'In Progress', label: 'In Progress', color: 'bg-blue-50 border-t-blue-500' },
  { id: 'Review', label: 'Review', color: 'bg-yellow-50 border-t-yellow-500' },
  { id: 'Blocked', label: 'Blocked', color: 'bg-red-50 border-t-cj-red' },
  { id: 'Completed', label: 'Completed', color: 'bg-green-50 border-t-green-500' }
];

export default function KanbanView() {
  const { tasks, setTasks, activeProjectId, currentUser, logAction } = useApp();

  const projectTasks = tasks.filter((t) => t.projectId === activeProjectId);

  const moveTask = (taskId: string, direction: 'prev' | 'next') => {
    if (currentUser.role === 'Viewer') {
      alert('Unauthorized: Viewers cannot move tasks on the Kanban board.');
      return;
    }

    const taskIndex = tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) return;

    const currentTask = tasks[taskIndex];
    const currentStatusIdx = COLUMNS.findIndex((c) => c.id === currentTask.status);

    let newStatusIdx = currentStatusIdx;
    if (direction === 'prev' && currentStatusIdx > 0) {
      newStatusIdx -= 1;
    } else if (direction === 'next' && currentStatusIdx < COLUMNS.length - 1) {
      newStatusIdx += 1;
    }

    if (newStatusIdx === currentStatusIdx) return;

    const newStatus = COLUMNS[newStatusIdx].id;
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = {
      ...currentTask,
      status: newStatus,
      // Auto mark progress 100 if completed
      progress: newStatus === 'Completed' ? 100 : currentTask.progress === 100 ? 80 : currentTask.progress
    };

    setTasks(updatedTasks);
    logAction(
      activeProjectId,
      `Moved task "${currentTask.title}" from ${currentTask.status} to ${newStatus}`
    );
  };

  const isReadOnly = currentUser.role === 'Viewer';

  return (
    <div className="space-y-6 p-6 h-[calc(100vh-64px)] w-full flex flex-col">
      {/* Title Controls */}
      <div className="flex justify-between items-center border-b border-cj-gray-200/80 pb-4 shrink-0">
        <div>
          <span className="text-[10px] text-cj-red font-bold uppercase tracking-wider block bg-cj-red/5 px-2 py-0.5 rounded-full w-max">
            PMBOK Executing Phase
          </span>
          <h1 className="text-xl font-extrabold text-cj-gray-800 mt-1">Agile Kanban Board</h1>
          <p className="text-xs text-gray-500">Track task states and visual bottlenecks dynamically across columns.</p>
        </div>
      </div>

      {/* Kanban Board columns scrollable container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden flex space-x-4 pb-4">
        {COLUMNS.map((col) => {
          const colTasks = projectTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className={`w-72 shrink-0 rounded-2xl border border-cj-gray-200/80 p-4 flex flex-col h-full bg-white`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-cj-gray-100">
                <div className="flex items-center space-x-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${
                    col.id === 'Completed' ? 'bg-green-500' :
                    col.id === 'Blocked' ? 'bg-cj-red' :
                    col.id === 'In Progress' ? 'bg-blue-500' : 'bg-gray-400'
                  }`} />
                  <span className="font-bold text-xs text-cj-gray-800">{col.label}</span>
                  <span className="text-[10px] text-gray-500 font-bold bg-cj-gray-100 px-2 py-0.5 rounded-full">
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Tasks List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colTasks.map((task) => {
                  const checkDone = task.checklist.filter(c => c.done).length;
                  const checkTotal = task.checklist.length;
                  
                  return (
                    <div
                      key={task.id}
                      className="bg-white border border-cj-gray-200 hover:border-cj-gray-200 shadow-soft p-3.5 rounded-xl space-y-3 transition-all animate-slide-up select-none"
                    >
                      <div className="flex justify-between items-start">
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                          task.priority === 'Critical' ? 'bg-red-100 text-red-600' :
                          task.priority === 'High' ? 'bg-orange-100 text-orange-600' : 'bg-cj-blue/5 text-cj-blue'
                        }`}>
                          {task.priority} Priority
                        </span>
                        
                        <div className="flex items-center space-x-1">
                          {!isReadOnly && (
                            <>
                              <button
                                onClick={() => moveTask(task.id, 'prev')}
                                className="p-1 text-gray-400 hover:text-cj-blue hover:bg-cj-gray-100 rounded cursor-pointer"
                                title="Move Left"
                              >
                                <ArrowLeft className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => moveTask(task.id, 'next')}
                                className="p-1 text-gray-400 hover:text-cj-blue hover:bg-cj-gray-100 rounded cursor-pointer"
                                title="Move Right"
                              >
                                <ArrowRight className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <h4 className="text-xs font-black text-cj-gray-800 leading-snug">{task.title}</h4>
                      <p className="text-[10px] text-gray-500 leading-normal line-clamp-2">{task.description}</p>

                      {/* Checklist Counter */}
                      {checkTotal > 0 && (
                        <div className="flex items-center space-x-1.5 text-[9px] text-gray-500 bg-cj-gray-100/50 p-1.5 rounded-md">
                          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          <span>Checklist: <b>{checkDone}/{checkTotal}</b> items</span>
                        </div>
                      )}

                      {/* Card Footer details */}
                      <div className="flex justify-between items-center pt-2.5 border-t border-cj-gray-100">
                        <div className="flex items-center space-x-1.5">
                          <User className="h-3.5 w-3.5 text-gray-400" />
                          <span className="text-[9px] font-bold text-cj-gray-700">{task.picName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-[8px] font-black text-cj-red bg-cj-red/5 px-1.5 py-0.5 rounded">
                            {task.raci}
                          </span>
                          <span className="text-[9px] font-bold text-cj-gray-800 bg-cj-gray-100 px-1.5 py-0.5 rounded">
                            {task.progress}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {colTasks.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-cj-gray-200/80 rounded-xl flex items-center justify-center text-[11px] text-gray-400 font-medium">
                    Empty Zone
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
