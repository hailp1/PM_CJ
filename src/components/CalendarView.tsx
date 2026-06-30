'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Gift, Trophy, Star } from 'lucide-react';

export default function CalendarView() {
  const { tasks, meetings } = useApp();
  const [view, setView] = useState<'Month' | 'Week'>('Month');
  
  // Hardcoded mockup events for June 2026
  const events = [
    { date: '2026-06-01', label: 'Children Day (Company Holiday)', type: 'holiday', icon: Star },
    { date: '2026-06-10', label: 'Sensory Panel Testing (Milestone)', type: 'milestone', icon: Trophy },
    { date: '2026-06-18', label: 'Minh Trans Birthday', type: 'birthday', icon: Gift },
    { date: '2026-06-25', label: 'Weekly Sync: Color mismatches (Meeting)', type: 'meeting', icon: CalendarIcon },
    { date: '2026-06-30', label: 'Artwork V4 Approval Deadline (Task Due)', type: 'task-due', icon: CalendarIcon }
  ];

  // Calendar cells generation for June 2026 (June 2026 starts on Monday, ends on Tuesday)
  const daysInJune = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-06-${String(dayNum).padStart(2, '0')}`;
    const dayEvents = events.filter(e => e.date === dateStr);
    return {
      day: dayNum,
      dateStr,
      events: dayEvents
    };
  });

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-[calc(100vh-64px)] w-full">
      {/* Title Header */}
      <div className="flex justify-between items-center border-b border-cj-gray-200/80 pb-4">
        <div>
          <span className="text-[10px] text-cj-red font-bold uppercase tracking-wider block bg-cj-red/5 px-2 py-0.5 rounded-full w-max">
            PMBOK Communications & Calendar
          </span>
          <h1 className="text-xl font-extrabold text-cj-gray-800 mt-1">Project Scheduling Calendar</h1>
          <p className="text-xs text-gray-500">Consolidated calendar view depicting task deadlines, milestones, company holidays, and training sessions.</p>
        </div>

        {/* View Switcher */}
        <div className="flex bg-white border border-cj-gray-200 rounded-xl p-1 shadow-sm">
          {['Month', 'Week'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v as any)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer ${
                view === v ? 'bg-cj-blue text-white shadow-sm' : 'text-gray-500 hover:text-cj-gray-800'
              }`}
            >
              {v} View
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid month header */}
      <div className="bg-white border border-cj-gray-200 rounded-2xl shadow-soft p-5 space-y-4">
        <div className="flex justify-between items-center select-none pb-2 border-b border-cj-gray-100">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-cj-blue" />
            <span className="font-extrabold text-sm text-cj-gray-800">June 2026</span>
          </div>
          <div className="flex space-x-1">
            <button className="p-1 rounded hover:bg-cj-gray-100 cursor-pointer border"><ChevronLeft className="h-4 w-4 text-gray-500" /></button>
            <button className="p-1 rounded hover:bg-cj-gray-100 cursor-pointer border"><ChevronRight className="h-4 w-4 text-gray-500" /></button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 text-center text-[10px] font-black text-gray-400 uppercase tracking-wider">
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>

        {/* Month grid cells */}
        <div className="grid grid-cols-7 gap-2">
          {/* Mock offset spacing since June 1, 2026 is Monday */}
          {daysInJune.map((cell) => (
            <div
              key={cell.day}
              className={`min-h-[90px] bg-cj-gray-100/30 hover:bg-cj-gray-100/60 border border-cj-gray-200/50 rounded-xl p-2.5 flex flex-col justify-between transition-colors ${
                cell.dateStr === '2026-06-30' ? 'ring-2 ring-cj-red/25 border-cj-red/40 bg-cj-red/2' : ''
              }`}
            >
              <span className={`text-[10px] font-black ${
                cell.dateStr === '2026-06-30' ? 'text-cj-red' : 'text-cj-gray-800'
              }`}>{cell.day}</span>
              
              <div className="space-y-1 mt-1 flex-1 flex flex-col justify-end">
                {cell.events.map((e, idx) => {
                  const Icon = e.icon;
                  return (
                    <div
                      key={idx}
                      className={`p-1 rounded text-[8px] font-bold flex items-center space-x-1 ${
                        e.type === 'holiday' ? 'bg-purple-100 text-purple-700' :
                        e.type === 'milestone' ? 'bg-yellow-100 text-yellow-700 font-extrabold' :
                        e.type === 'birthday' ? 'bg-pink-100 text-pink-700' :
                        e.type === 'meeting' ? 'bg-cj-blue/10 text-cj-blue' :
                        'bg-red-50 text-cj-red'
                      }`}
                    >
                      <Icon className="h-2.5 w-2.5 shrink-0" />
                      <span className="truncate w-full block">{e.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
