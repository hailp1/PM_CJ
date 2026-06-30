'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Bot, X, Send, Sparkles, AlertTriangle, FileText, Check } from 'lucide-react';

export default function AIAssistant() {
  const { projects, activeProjectId, tasks, resources } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string; isCode?: boolean }[]>([
    {
      sender: 'ai',
      text: 'Chào bạn! Tôi là **CJ ProjectHub AI**. Tôi có thể hỗ trợ tạo điều lệ dự án, phân tích rủi ro, dự đoán tiến độ và viết báo cáo tóm tắt. Bạn hãy chọn một tác vụ nhanh bên dưới hoặc đặt câu hỏi.'
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleCommandTrigger = (cmd: string) => {
    setIsThinking(true);
    setMessages(prev => [...prev, { sender: 'user', text: `Run command: ${cmd}` }]);

    setTimeout(() => {
      setIsThinking(false);
      let responseText = '';

      if (cmd === 'Generate Charter') {
        responseText = `### 📋 PROJECT CHARTER SPECIFICATION (AI GENERATED)
**Project Title**: CJ Bibigo Premium Mandu Launch 2026  
**Strategic Alignment**: Product Innovation  

#### 1. Scope Statement & Business Justification
*   **Target Category**: Premium frozen appetizers, targeting urban Millennial/Gen-Z demographics in Hanoi and HCMC.
*   **Justification**: Expected margin increase of 35% over standard lines. Taps into premium HORECA channels and modern trade listings.

#### 2. Project Milestone Baseline
*   **Gate 1 (Idea)**: Passed. Recipes finalized.
*   **Gate 2 (Feasibility)**: Passed. Packaging BOM margins approved.
*   **Gate 3 (Development)**: In Progress. Trial scheduled.
*   **Gate 4 (Launch)**: Baseline target scheduled for September 2026.

#### 3. Budget Limits
*   **Authorized Baseline budget**: 4,500M VND.
*   **Projected EAC (Estimate at Completion)**: 4,450M VND (CPI = 1.05).`;
      } else if (cmd === 'Suggest Risks') {
        responseText = `### ⚠️ RISK RECOMMENDATIONS FOR THIS LIFE-CYCLE
Based on active project data, SFE metrics, and supply chain readiness indices:

1.  **Cold Chain logistics delay (Critical)**:
    *   *Cause*: Port congestion affecting refrigeration unit imports.
    *   *Mitigation*: Pre-book customs agents and source certified regional distributors for secondary cold trucks.
2.  **Trade Marketing execution bottlenecks (High)**:
    *   *Cause*: Design agency delivery delays during high seasonal peaks (Tet preparation).
    *   *Mitigation*: Move artwork deadline 2 weeks earlier and sign off draft guidelines.`;
      } else if (cmd === 'Draft Summary') {
        responseText = `### 📊 EXECUTIVE STEERING COMMITTEE SUMMARY
**Project Status**: Active | **Overall Progress**: ${activeProject.progress}%  

*   **SPI (Schedule Index)**: 0.94 (Behind baseline target by 5 days).
*   **CPI (Cost Index)**: 1.02 (Under budget limits).
*   **Critical Path Alert**: Sensory panel is completed, but packaging film supplier printing calibration is currently delayed at trial stage.
*   **Recommendation**: Approve Change Request CR-002 to move launch event to AEON Mall Tan Phu to save 50M VND and improve launch readiness.`;
      } else {
        responseText = `I have analyzed your query for project: **${activeProject.name}**. Let me know how I can detail this further.`;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
    }, 1200);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userQ = query;
    setMessages(prev => [...prev, { sender: 'user', text: userQ }]);
    setQuery('');
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Tôi đã ghi nhận yêu cầu: "${userQ}". Tôi đề xuất thực hiện phân tích tóm tắt rủi ro hoặc tạo dự thảo báo cáo cho dự án **${activeProject.name}**.`
        }
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full cj-gradient-red-orange text-white shadow-lg flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-all z-50 animate-bounce"
        title="CJ ProjectHub AI Assistant"
      >
        {isOpen ? <X className="h-5.5 w-5.5" /> : <Bot className="h-5.5 w-5.5" />}
      </button>

      {/* AI Assistant Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-96 h-[480px] bg-white border border-cj-gray-200 rounded-2xl shadow-lg flex flex-col z-50 overflow-hidden animate-scale-in">
          
          {/* Header */}
          <div className="p-4 cj-gradient-red-orange text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider">CJ Foods AI Assistant</h3>
                <span className="text-[9px] font-semibold text-white/80">Active Context: {activeProject.code}</span>
              </div>
            </div>
            <Sparkles className="h-4.5 w-4.5 text-yellow-300 animate-pulse" />
          </div>

          {/* Quick Commands Bar */}
          <div className="p-2 border-b bg-cj-gray-100/50 flex space-x-1.5 overflow-x-auto select-none">
            {['Generate Charter', 'Suggest Risks', 'Draft Summary'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleCommandTrigger(cmd)}
                className="shrink-0 px-2.5 py-1 bg-white hover:bg-cj-gray-100 border rounded-lg text-[9px] font-extrabold text-cj-gray-800 transition-all cursor-pointer shadow-xs"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-3 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-cj-blue text-white rounded-br-none'
                      : 'bg-cj-gray-100 text-cj-gray-800 rounded-bl-none border'
                  }`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {/* Styled markdown support for bullet lists */}
                  {m.text.split('\n').map((line, lIdx) => {
                    if (line.startsWith('**') || line.startsWith('###')) {
                      return <p key={lIdx} className="font-extrabold text-cj-gray-800">{line.replace(/\*\*|###/g, '')}</p>;
                    }
                    if (line.startsWith('*')) {
                      return <li key={lIdx} className="ml-3 font-semibold text-cj-gray-700">{line.replace(/^\*\s*/, '')}</li>;
                    }
                    return <p key={lIdx}>{line}</p>;
                  })}
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="flex justify-start">
                <div className="bg-cj-gray-100 p-3 rounded-2xl rounded-bl-none text-xs text-gray-500 italic flex items-center space-x-1.5 border">
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200" />
                  </div>
                  <span>CJ AI is compiling data...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 border-t bg-cj-gray-100/50 flex space-x-2">
            <input
              type="text"
              placeholder="Ask AI e.g. Predict delay for launch..."
              className="flex-1 text-xs px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-cj-red"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="p-2 cj-gradient-red-orange text-white rounded-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
