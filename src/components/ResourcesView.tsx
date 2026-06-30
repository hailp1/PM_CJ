'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldAlert, CheckCircle, AlertTriangle, Users } from 'lucide-react';

export default function ResourcesView() {
  const { resources } = useApp();

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-[calc(100vh-64px)] w-full">
      {/* Title Header */}
      <div className="flex justify-between items-center border-b border-cj-gray-200/80 pb-4">
        <div>
          <span className="text-[10px] text-cj-red font-bold uppercase tracking-wider block bg-cj-red/5 px-2 py-0.5 rounded-full w-max">
            PMBOK Resource Management
          </span>
          <h1 className="text-xl font-extrabold text-cj-gray-800 mt-1">Resource Capacity & Allocation</h1>
          <p className="text-xs text-gray-500">Monitor employee workload allocations, capture overload warnings, and manage resource availability constraints.</p>
        </div>
      </div>

      {/* Grid statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-4 rounded-xl border border-cj-gray-200/60 shadow-soft">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Team size</span>
          <span className="text-lg font-black text-cj-gray-800 mt-1 block">{resources.length} Members</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-cj-gray-200/60 shadow-soft">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Overloaded Resources</span>
          <span className="text-lg font-black text-cj-red mt-1 block">
            {resources.filter(r => r.availabilityStatus === 'Overloaded').length} Members
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-cj-gray-200/60 shadow-soft">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Optimal Allocation Rate</span>
          <span className="text-lg font-black text-green-600 mt-1 block">60% Optimized</span>
        </div>
      </div>

      {/* Allocations Table */}
      <div className="bg-white border border-cj-gray-200 rounded-2xl shadow-soft overflow-hidden">
        <table className="min-w-full divide-y divide-cj-gray-200">
          <thead className="bg-cj-gray-100/50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
            <tr>
              <th className="py-3.5 pl-6 pr-3 text-left">Employee Name</th>
              <th className="px-3 py-3.5 text-left">Department</th>
              <th className="px-3 py-3.5 text-center">Weekly Capacity</th>
              <th className="px-3 py-3.5 text-center">Allocated Hours</th>
              <th className="px-3 py-3.5 text-left">Active Projects</th>
              <th className="px-3 py-3.5 text-center">Allocation Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cj-gray-100 bg-white">
            {resources.map((res) => {
              const pct = Math.round((res.allocatedHours / res.capacityHours) * 100);
              
              return (
                <tr key={res.userId} className="hover:bg-cj-gray-100/10 text-xs">
                  <td className="py-4 pl-6 pr-3 font-bold text-cj-gray-800 flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-cj-blue/5 text-cj-blue flex items-center justify-center font-black">
                      {res.userName.charAt(0)}
                    </div>
                    <span>{res.userName}</span>
                  </td>
                  <td className="px-3 py-4 text-gray-500 font-bold">{res.department}</td>
                  <td className="px-3 py-4 text-center text-gray-500 font-semibold">{res.capacityHours}h</td>
                  <td className="px-3 py-4 text-center">
                    <span className="font-extrabold text-cj-gray-800">{res.allocatedHours}h</span>
                    <span className="text-[10px] text-gray-400 block">({pct}%)</span>
                  </td>
                  <td className="px-3 py-4 text-gray-500">
                    <div className="space-y-1">
                      {res.projects.map((p, idx) => (
                        <div key={idx} className="text-[10px] bg-cj-gray-100 border px-1.5 py-0.5 rounded font-semibold text-cj-gray-700 w-max">
                          {p.projectName}: {p.hours}h
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full font-black text-[9px] uppercase inline-flex items-center space-x-1 ${
                      res.availabilityStatus === 'Overloaded' ? 'bg-red-100 text-cj-red' :
                      res.availabilityStatus === 'Optimal' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {res.availabilityStatus === 'Overloaded' && <ShieldAlert className="h-3 w-3 mr-0.5" />}
                      {res.availabilityStatus === 'Optimal' && <CheckCircle className="h-3 w-3 mr-0.5" />}
                      <span>{res.availabilityStatus}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
