'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { mockUsers, Task } from '@/data/mockData';
import { HelpCircle, Shield, User, Circle } from 'lucide-react';

export default function RaciView() {
  const { tasks, activeProjectId } = useApp();

  const projectTasks = tasks.filter((t) => t.projectId === activeProjectId);

  // Return the RACI flag for a specific task and user
  const getRaciAssignment = (task: Task, userId: string) => {
    // If the user is the primary PIC (Responsible or Accountable depending on mapping)
    if (task.picId === userId) {
      return task.raci; // Use task's assigned RACI role
    }

    // Co-owner acts as Consulted or Informed
    if (task.coOwnerId === userId) {
      return 'C';
    }

    // Default RACI rules based on departments
    // If user is Shin Jae Ho (PMO/Admin) and is sponsor, they are Informed/Accountable
    if (userId === 'u1' && task.parentId === null) {
      return 'I';
    }

    return null;
  };

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-[calc(100vh-64px)] w-full">
      {/* Title Controls */}
      <div className="flex justify-between items-center border-b border-cj-gray-200/80 pb-4">
        <div>
          <span className="text-[10px] text-cj-red font-bold uppercase tracking-wider block bg-cj-red/5 px-2 py-0.5 rounded-full w-max">
            PMBOK Human Resource & Governance
          </span>
          <h1 className="text-xl font-extrabold text-cj-gray-800 mt-1">Responsibility Assignment Matrix (RACI)</h1>
          <p className="text-xs text-gray-500">Automatically map project stakeholders to tasks: Responsible (R), Accountable (A), Consulted (C), Informed (I).</p>
        </div>
      </div>

      {/* RACI Key / Guide */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white border border-cj-gray-200 rounded-xl shadow-soft">
        <div className="flex items-start space-x-2">
          <span className="w-6 h-6 rounded bg-red-100 text-cj-red font-black text-xs flex items-center justify-center shrink-0">R</span>
          <div>
            <p className="text-xs font-black text-cj-gray-800">Responsible</p>
            <p className="text-[10px] text-gray-500">The person who executes the work to complete the task.</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <span className="w-6 h-6 rounded bg-blue-100 text-cj-blue font-black text-xs flex items-center justify-center shrink-0">A</span>
          <div>
            <p className="text-xs font-black text-cj-gray-800">Accountable</p>
            <p className="text-[10px] text-gray-500">The person with final sign-off authority and answerable for quality.</p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <span className="w-6 h-6 rounded bg-orange-100 text-cj-orange font-black text-xs flex items-center justify-center shrink-0">C</span>
          <div>
            <p className="text-xs font-black text-cj-gray-800">Consulted</p>
            <p className="text-[10px] text-gray-500">Subject matter experts who provide input and support.</p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <span className="w-6 h-6 rounded bg-gray-100 text-gray-600 font-black text-xs flex items-center justify-center shrink-0">I</span>
          <div>
            <p className="text-xs font-black text-cj-gray-800">Informed</p>
            <p className="text-[10px] text-gray-500">Stakeholders kept updated on progress and results.</p>
          </div>
        </div>
      </div>

      {/* RACI Matrix Table */}
      <div className="bg-white border border-cj-gray-200 rounded-2xl shadow-soft overflow-hidden">
        <table className="min-w-full divide-y divide-cj-gray-200">
          <thead className="bg-cj-gray-100/50">
            <tr>
              <th scope="col" className="py-4 pl-6 pr-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider WBS-col">
                WBS Work Package
              </th>
              {mockUsers.map((user) => (
                <th key={user.id} scope="col" className="px-3 py-4 text-center text-xs font-extrabold text-cj-gray-800">
                  <div className="flex flex-col items-center space-y-1">
                    <img src={user.avatar} className="w-7 h-7 rounded-full border object-cover" alt={user.name} />
                    <span className="max-w-[80px] truncate">{user.name.split(' ').pop()}</span>
                    <span className="text-[9px] text-cj-red font-semibold uppercase">{user.role.slice(0, 5)}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-cj-gray-100">
            {projectTasks.map((t) => (
              <tr key={t.id} className="hover:bg-cj-gray-100/20 transition-colors">
                <td className="py-4 pl-6 pr-3 text-xs font-extrabold text-cj-gray-800">
                  {t.title}
                </td>
                {mockUsers.map((user) => {
                  const role = getRaciAssignment(t, user.id);
                  return (
                    <td key={user.id} className="px-3 py-4 text-center">
                      {role ? (
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg font-black text-xs border shadow-sm ${
                          role === 'R' ? 'bg-red-50 text-cj-red border-red-200' :
                          role === 'A' ? 'bg-blue-50 text-cj-blue border-blue-200' :
                          role === 'C' ? 'bg-orange-50 text-cj-orange border-orange-200' :
                          'bg-gray-50 text-gray-600 border-gray-200'
                        }`}>
                          {role}
                        </span>
                      ) : (
                        <Circle className="h-2 w-2 text-gray-200 mx-auto" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
