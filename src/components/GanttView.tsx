'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Task } from '@/data/mockData';
import { Calendar, ChevronRight, ZoomIn, Milestone, ArrowRight } from 'lucide-react';

type ZoomLevel = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly';

export default function GanttView() {
  const { tasks, activeProjectId } = useApp();
  const [zoom, setZoom] = useState<ZoomLevel>('Weekly');

  const projectTasks = tasks.filter((t) => t.projectId === activeProjectId);

  // Zoom configurations
  const getTimelineHeaders = () => {
    switch (zoom) {
      case 'Daily':
        return Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
      case 'Weekly':
        return Array.from({ length: 12 }, (_, i) => `W${i + 1}`);
      case 'Monthly':
        return ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
      case 'Quarterly':
        return ['2026 Q1', '2026 Q2', '2026 Q3', '2026 Q4'];
    }
  };

  const headers = getTimelineHeaders();

  // Simple mock coordinates generator for Gantt bars
  const getBarOffsets = (task: Task) => {
    // Generate horizontal start and width % based on task dates relative to overall project dates
    // For p1 (Start: Feb, End: Sept)
    const startDate = new Date(task.startDate);
    const projStart = new Date('2026-02-01');
    const projEnd = new Date('2026-09-30');
    
    const totalDuration = projEnd.getTime() - projStart.getTime();
    const taskStartOffset = startDate.getTime() - projStart.getTime();
    
    // Percentage offsets
    const leftPct = Math.max(0, Math.min(90, (taskStartOffset / totalDuration) * 100));
    const widthPct = Math.max(8, Math.min(80, (task.durationDays * 24 * 3600 * 1000 / totalDuration) * 100));

    return {
      left: `${leftPct}%`,
      width: `${widthPct}%`
    };
  };

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-[calc(100vh-64px)] w-full">
      {/* Header Controls */}
      <div className="flex justify-between items-center border-b border-cj-gray-200/80 pb-4">
        <div>
          <span className="text-[10px] text-cj-red font-bold uppercase tracking-wider block bg-cj-red/5 px-2 py-0.5 rounded-full w-max">
            PMBOK Schedule Management
          </span>
          <h1 className="text-xl font-extrabold text-cj-gray-800 mt-1">Interactive Gantt Chart & Schedule</h1>
          <p className="text-xs text-gray-500">Visualize schedule baseline, dependencies, critical paths, and track milestone deviations.</p>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center bg-white border border-cj-gray-200 rounded-xl p-1 shadow-sm">
          {(['Daily', 'Weekly', 'Monthly', 'Quarterly'] as ZoomLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setZoom(level)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                zoom === level
                  ? 'bg-cj-blue text-white shadow-sm'
                  : 'text-gray-500 hover:text-cj-gray-800 hover:bg-cj-gray-100'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* Gantt Matrix Visualization */}
      <div className="bg-white border border-cj-gray-200/80 rounded-2xl shadow-soft overflow-hidden flex flex-col">
        
        {/* Timeline Header Row */}
        <div className="flex bg-cj-gray-100/50 border-b border-cj-gray-200 text-[10px] font-bold text-gray-500 uppercase tracking-wider select-none">
          {/* Tasks Sidebar column header */}
          <div className="w-64 border-r border-cj-gray-200 p-3 shrink-0">WBS Task Element</div>
          
          {/* Horizontal Timeline cells */}
          <div className="flex-1 flex min-w-[500px]">
            {headers.map((h, idx) => (
              <div
                key={idx}
                className="flex-1 text-center py-3 border-r border-cj-gray-200 last:border-0"
              >
                {h}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Rows */}
        <div className="divide-y divide-cj-gray-100 overflow-y-auto">
          {projectTasks.length > 0 ? (
            projectTasks.map((t) => {
              const offsets = getBarOffsets(t);
              const isCritical = t.priority === 'Critical';
              const isMilestone = t.checklist.length > 0 && t.title.toLowerCase().includes('phase');

              return (
                <div key={t.id} className="flex hover:bg-cj-gray-100/20 transition-colors items-center h-14">
                  {/* Left Column task descriptor */}
                  <div className="w-64 border-r border-cj-gray-200 p-3 shrink-0 text-xs flex flex-col justify-center">
                    <span className="font-bold text-cj-gray-800 truncate">{t.title}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5 truncate">PIC: {t.picName} ({t.raci})</span>
                  </div>

                  {/* Right Column Timeline bar chart */}
                  <div className="flex-1 min-w-[500px] h-full relative flex items-center px-4 bg-[linear-gradient(to_right,#f3f4f6_1px,transparent_1px)] bg-[size:calc(100%/12)_100%]">
                    {/* Gantt Bar */}
                    <div
                      className="absolute h-6 rounded-md shadow-sm flex items-center justify-between px-2 text-[9px] font-extrabold text-white transition-all overflow-hidden"
                      style={{
                        left: offsets.left,
                        width: offsets.width,
                        background: isCritical
                          ? 'linear-gradient(90deg, #e21e26 0%, #f37021 100%)'
                          : 'linear-gradient(90deg, #0055a5 0%, #3b82f6 100%)'
                      }}
                    >
                      {/* Completed overlay bar */}
                      <div
                        className="absolute left-0 top-0 bottom-0 bg-black/15 pointer-events-none"
                        style={{ width: `${t.progress}%` }}
                      />
                      
                      <span className="z-10 truncate">{t.progress}%</span>
                      {isMilestone && <Milestone className="h-3 w-3 shrink-0 z-10 text-yellow-300 animate-pulse ml-1" />}
                    </div>

                    {/* Critical Path Mock Vector Lines */}
                    {t.dependencies.length > 0 && (
                      <div className="absolute top-1/2 left-[10%] h-px bg-cj-orange border-t border-dashed border-cj-orange z-20 w-max flex items-center">
                        <ArrowRight className="h-3 w-3 text-cj-orange shrink-0 -mt-1.5" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-xs text-gray-400">
              No task lines registered. Create tasks in the WBS module.
            </div>
          )}
        </div>
      </div>

      {/* Baseline controls & statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-4 rounded-xl border border-cj-gray-200/60 shadow-soft">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Baseline Variance</span>
          <span className="text-lg font-black text-green-600 mt-1 block">0 Days Slippage</span>
          <p className="text-[10px] text-gray-500 mt-1">Schedule execution matching baseline trajectory.</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-cj-gray-200/60 shadow-soft">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Critical Path Tasks</span>
          <span className="text-lg font-black text-cj-red mt-1 block">
            {projectTasks.filter((t) => t.priority === 'Critical').length} Critical Elements
          </span>
          <p className="text-[10px] text-gray-500 mt-1">Elements directly impacting launch release date.</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-cj-gray-200/60 shadow-soft">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Target Milestones</span>
          <span className="text-lg font-black text-cj-blue mt-1 block">4 Active Milestones</span>
          <p className="text-[10px] text-gray-500 mt-1">Reflecting stage-gate exit points reviews.</p>
        </div>
      </div>

    </div>
  );
}
