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
  Users,
  Edit,
  X,
  Save,
  Search,
  Check,
  Filter
} from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default function WBSView() {
  const { tasks, setTasks, activeProjectId, currentUser, logAction, t, language, projects } = useApp();
  const [expandedTasks, setExpandedTasks] = useState<{ [key: string]: boolean }>({
    't1_prep': true,
    't1_exec': true,
    't1_support': true
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

  // Task editing states
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editPicId, setEditPicId] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editProgress, setEditProgress] = useState(0);
  const [editStatus, setEditStatus] = useState<Task['status']>('To Do');
  const [editPriority, setEditPriority] = useState<Task['priority']>('Medium');
  const [editRaci, setEditRaci] = useState<Task['raci']>('R');

  // Filter states (UX Upgrade #4)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPicId, setFilterPicId] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const projectTasks = tasks.filter((t) => t.projectId === activeProjectId);

  const toggleExpand = (id: string) => {
    setExpandedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Build tree
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
    if (confirm(language === 'VI' ? 'Bạn có chắc chắn muốn xóa tác vụ này và các tác vụ con liên quan?' : (language === 'KO' ? '이 작업과 관련된 모든 하위 작업을 삭제하시겠습니까?' : 'Are you sure you want to delete this task and its related subtasks?'))) {
      setTasks((prev) => prev.filter((t) => t.id !== id && t.parentId !== id));
      logAction(activeProjectId, `Removed task and its children: ID ${id}`);
    }
  };

  const handleStartEdit = (task: Task) => {
    if (currentUser.role === 'Viewer') {
      alert('Unauthorized: Viewers cannot edit tasks.');
      return;
    }
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description);
    setEditPicId(task.picId);
    setEditStartDate(task.startDate);
    setEditDueDate(task.dueDate);
    setEditProgress(task.progress);
    setEditStatus(task.status);
    setEditPriority(task.priority);
    setEditRaci(task.raci);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    const matchedPic = mockUsers.find((u) => u.id === editPicId);

    setTasks((prev) =>
      prev.map((t) =>
        t.id === editingTask.id
          ? {
              ...t,
              title: editTitle,
              description: editDesc,
              picId: editPicId,
              picName: matchedPic ? matchedPic.name : t.picName,
              startDate: editStartDate,
              dueDate: editDueDate,
              durationDays: Math.ceil(
                (new Date(editDueDate).getTime() - new Date(editStartDate).getTime()) / (1000 * 3600 * 24)
              ) || 1,
              progress: editProgress,
              status: editStatus,
              priority: editPriority,
              raci: editRaci
            }
          : t
      )
    );

    setEditingTask(null);
    logAction(activeProjectId, `Updated WBS task: "${editTitle}" (Progress: ${editProgress}%, Status: ${editStatus})`);
  };

  // One-Click Checkbox Toggle Completion (UX Upgrade #3)
  const handleToggleComplete = (task: Task) => {
    if (currentUser.role === 'Viewer') {
      alert('Unauthorized: Viewers cannot modify tasks.');
      return;
    }

    const isCompleted = task.status === 'Completed';
    const newStatus = isCompleted ? 'To Do' : 'Completed';
    const newProgress = isCompleted ? 0 : 100;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? {
              ...t,
              status: newStatus,
              progress: newProgress
            }
          : t
      )
    );

    logAction(activeProjectId, `Quick toggle task complete: "${task.title}" to ${newStatus} (${newProgress}%)`);
  };

  // Filter and Search logic
  const isFiltered = searchQuery !== '' || filterPicId !== 'all' || filterStatus !== 'all';

  const filteredTasks = projectTasks.filter((t) => {
    const matchesSearch = searchQuery === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPic = filterPicId === 'all' || t.picId === filterPicId;
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;

    return matchesSearch && matchesPic && matchesStatus;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setFilterPicId('all');
    setFilterStatus('all');
  };

  // Export to Excel
  const handleExportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('WBS Hierarchy');

      worksheet.getRow(1).height = 18;
      worksheet.getRow(2).height = 18;
      worksheet.getRow(3).height = 18;
      worksheet.getRow(5).height = 25;

      try {
        const logoResponse = await fetch('/CJ_logo.png');
        const logoBlob = await logoResponse.blob();
        const logoArrayBuffer = await logoBlob.arrayBuffer();
        
        const imageId = workbook.addImage({
          buffer: logoArrayBuffer,
          extension: 'png',
        });
        
        worksheet.addImage(imageId, {
          tl: { col: 0.1, row: 0.2 },
          ext: { width: 100, height: 42 }
        });
      } catch (err) {
        console.error('Failed to load logo for Excel insert:', err);
      }

      worksheet.getCell('C2').value = 'CJ FOODS VIETNAM';
      worksheet.getCell('C2').font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FFE21E26' } };
      
      worksheet.getCell('C3').value = 'CJ ProjectHub - Executive WBS Export';
      worksheet.getCell('C3').font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FF595959' } };

      worksheet.getCell('A5').value = language === 'VI' ? 'CẤU TRÚC PHÂN RÃ CÔNG VIỆC (WBS)' : (language === 'KO' ? '작업 분할 구조도 (WBS)' : 'WORK BREAKDOWN STRUCTURE (WBS)');
      worksheet.getCell('A5').font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FF1F2937' } };

      worksheet.getCell('A6').value = `Project: ${activeProject.code} - ${activeProject.name}`;
      worksheet.getCell('A6').font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: 'FF595959' } };

      worksheet.getCell('A7').value = `Exported Date: ${new Date().toLocaleDateString()}  |  Project Manager: ${activeProject.pm}  |  Sponsor: ${activeProject.sponsor}`;
      worksheet.getCell('A7').font = { name: 'Segoe UI', size: 9, color: { argb: 'FF7F7F7F' } };

      worksheet.columns = [
        { header: 'WBS Element / Title', key: 'title', width: 45 },
        { header: 'Description', key: 'description', width: 35 },
        { header: 'Owner (PIC)', key: 'pic', width: 22 },
        { header: 'Start Date', key: 'startDate', width: 14 },
        { header: 'Due Date', key: 'dueDate', width: 14 },
        { header: 'Progress', key: 'progress', width: 12 },
        { header: 'Status', key: 'status', width: 16 },
        { header: 'RACI', key: 'raci', width: 10 }
      ];

      const headerRow = worksheet.getRow(9);
      headerRow.height = 26;
      headerRow.values = [
        language === 'VI' ? 'Tên công việc / Phân cấp' : (language === 'KO' ? '작업명 / 계층구조' : 'WBS Element / Title'),
        language === 'VI' ? 'Mô tả chi tiết' : (language === 'KO' ? '작업 설명' : 'Description'),
        language === 'VI' ? 'Người phụ trách (PIC)' : (language === 'KO' ? '담당자' : 'Owner (PIC)'),
        language === 'VI' ? 'Ngày bắt đầu' : (language === 'KO' ? '시작일' : 'Start Date'),
        language === 'VI' ? 'Ngày hạn chót' : (language === 'KO' ? '기한일' : 'Due Date'),
        language === 'VI' ? 'Tiến độ' : (language === 'KO' ? '진척도' : 'Progress'),
        language === 'VI' ? 'Trạng thái' : (language === 'KO' ? '상태' : 'Status'),
        'RACI'
      ];

      headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0055A5' } };
        cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = { top: { style: 'medium', color: { argb: 'FF003B75' } }, bottom: { style: 'medium', color: { argb: 'FF003B75' } } };
      });

      const getStatusDisplay = (status: string) => {
        if (language === 'VI') {
          if (status === 'Completed') return 'Hoàn thành';
          if (status === 'In Progress') return 'Đang chạy';
          if (status === 'Review') return 'Đang duyệt';
          if (status === 'Blocked') return 'Bị nghẽn';
          if (status === 'To Do') return 'Cần làm';
          if (status === 'Planning') return 'Kế hoạch';
        }
        if (language === 'KO') {
          if (status === 'Completed') return '완료';
          if (status === 'In Progress') return '진행중';
          if (status === 'Review') return '검토중';
          if (status === 'Blocked') return '지연됨';
          if (status === 'To Do') return '할 일';
          if (status === 'Planning') return '계획';
        }
        return status;
      };

      const writeTaskRow = (task: Task, depth: number) => {
        const row = worksheet.addRow([
          '   '.repeat(depth) + task.title,
          task.description,
          task.picName,
          task.startDate,
          task.dueDate,
          task.progress / 100,
          getStatusDisplay(task.status),
          task.raci
        ]);

        row.height = 22;
        row.outlineLevel = depth;

        row.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
        row.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
        row.getCell(3).alignment = { horizontal: 'left', vertical: 'middle' };
        row.getCell(4).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(6).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(7).alignment = { horizontal: 'center', vertical: 'middle' };
        row.getCell(8).alignment = { horizontal: 'center', vertical: 'middle' };

        row.getCell(6).numFmt = '0%';

        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            right: { style: 'thin', color: { argb: 'FFE0E0E0' } }
          };
          cell.font = { name: 'Segoe UI', size: 9.5, bold: depth === 0 };
        });

        if (depth === 0) {
          row.eachCell((cell) => {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F7FA' } };
          });
        }

        const statusCell = row.getCell(7);
        if (task.status === 'Completed') {
          statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2F0D9' } };
          statusCell.font = { color: { argb: 'FF385723' }, bold: true, name: 'Segoe UI', size: 9.5 };
        } else if (task.status === 'In Progress') {
          statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDEBF7' } };
          statusCell.font = { color: { argb: 'FF1F4E78' }, bold: true, name: 'Segoe UI', size: 9.5 };
        } else if (task.status === 'Blocked') {
          statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFCE4D6' } };
          statusCell.font = { color: { argb: 'FFC65911' }, bold: true, name: 'Segoe UI', size: 9.5 };
        }

        const raciCell = row.getCell(8);
        raciCell.font = { color: { argb: 'FFE21E26' }, bold: true, name: 'Segoe UI', size: 9.5 };
        
        const children = projectTasks.filter(t => t.parentId === task.id);
        children.forEach(child => writeTaskRow(child, depth + 1));
      };

      rootTasks.forEach(task => writeTaskRow(task, 0));

      const buffer = await workbook.xlsx.writeBuffer();
      const fileName = `${activeProject.code}_WBS_Export_${new Date().toISOString().slice(0, 10)}.xlsx`;
      saveAs(new Blob([buffer]), fileName);
      logAction(activeProjectId, `Exported WBS tree to Excel: ${fileName}`);
    } catch (err) {
      console.error('Excel export failed: ', err);
      alert('Failed to generate Excel export.');
    }
  };

  const isReadOnly = currentUser.role === 'Viewer';

  // Recursive Tree Node component
  const TreeNode = ({ task, depth = 0 }: { task: Task; depth: number }) => {
    const children = projectTasks.filter((t) => t.parentId === task.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedTasks[task.id];

    const getStatusStyle = (status: string) => {
      if (status === 'Completed') return 'bg-green-100 text-green-700';
      if (status === 'In Progress') return 'bg-cj-blue/10 text-cj-blue';
      if (status === 'Review') return 'bg-cj-orange/10 text-cj-orange';
      if (status === 'Blocked') return 'bg-red-100 text-red-600';
      return 'bg-gray-100 text-gray-500';
    };

    const getStatusDisplay = (status: string) => {
      if (language === 'VI') {
        if (status === 'Completed') return 'Hoàn thành';
        if (status === 'In Progress') return 'Đang chạy';
        if (status === 'Review') return 'Đang duyệt';
        if (status === 'Blocked') return 'Bị nghẽn';
        if (status === 'To Do') return 'Cần làm';
        if (status === 'Planning') return 'Kế hoạch';
        if (status === 'Backlog') return 'Tồn đọng';
      }
      if (language === 'KO') {
        if (status === 'Completed') return '완료';
        if (status === 'In Progress') return '진행중';
        if (status === 'Review') return '검토중';
        if (status === 'Blocked') return '지연됨';
        if (status === 'To Do') return '할 일';
        if (status === 'Planning') return '계획';
        if (status === 'Backlog') return '백로그';
      }
      return status;
    };

    return (
      <>
        <tr className="hover:bg-cj-gray-100/30 border-b border-cj-gray-100 transition-colors">
          <td className="py-3.5 pl-4 pr-3 text-xs" style={{ paddingLeft: `${depth * 20 + 16}px` }}>
            <div className="flex items-center space-x-2">
              {hasChildren ? (
                <button onClick={() => toggleExpand(task.id)} className="p-0.5 rounded hover:bg-cj-gray-200 cursor-pointer">
                  {isExpanded ? <ChevronDown className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                </button>
              ) : (
                <div className="w-5" />
              )}

              {/* Quick Completion Checkbox (UX Upgrade #3) */}
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => handleToggleComplete(task)}
                  className="hover:scale-110 transition-all cursor-pointer flex-shrink-0"
                  title={task.status === 'Completed' ? 'Mark Incomplete' : 'Mark Completed'}
                >
                  {task.status === 'Completed' ? (
                    <div className="w-4 h-4 rounded-full border border-cj-blue bg-cj-blue flex items-center justify-center text-white shadow-sm">
                      <Check className="w-2.5 h-2.5 stroke-[3px]" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 hover:border-cj-blue transition-colors bg-white" />
                  )}
                </button>
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
            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${getStatusStyle(task.status)}`}>
              {getStatusDisplay(task.status)}
            </span>
          </td>
          <td className="px-3 py-3.5 text-xs text-center">
            <span className="font-black text-cj-red bg-cj-red/5 px-2 py-0.5 rounded">{task.raci}</span>
          </td>
          <td className="px-3 py-3.5 text-xs text-center">
            {!isReadOnly && (
              <div className="flex items-center justify-center space-x-1">
                <button
                  onClick={() => handleStartEdit(task)}
                  className="text-gray-400 hover:text-cj-blue transition-colors cursor-pointer p-1 rounded hover:bg-cj-blue/5"
                  title={language === 'VI' ? 'Sửa tác vụ' : (language === 'KO' ? '작업 수정' : 'Edit Task')}
                >
                  <Edit className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-gray-400 hover:text-cj-red transition-colors cursor-pointer p-1 rounded hover:bg-red-50"
                  title={language === 'VI' ? 'Xóa tác vụ' : (language === 'KO' ? '작업 삭제' : 'Delete Task')}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
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

  // Status displays inside status filter
  const getStatusDisplayFilter = (status: string) => {
    if (language === 'VI') {
      if (status === 'Completed') return 'Hoàn thành';
      if (status === 'In Progress') return 'Đang chạy';
      if (status === 'Review') return 'Đang duyệt';
      if (status === 'Blocked') return 'Bị nghẽn';
      if (status === 'To Do') return 'Cần làm';
      if (status === 'Planning') return 'Kế hoạch';
      if (status === 'Backlog') return 'Tồn đọng';
    }
    if (language === 'KO') {
      if (status === 'Completed') return '완료';
      if (status === 'In Progress') return '진행중';
      if (status === 'Review') return '검토중';
      if (status === 'Blocked') return '지연됨';
      if (status === 'To Do') return '할 일';
      if (status === 'Planning') return '계획';
      if (status === 'Backlog') return '백로그';
    }
    return status;
  };

  return (
    <div className="space-y-6 p-6 overflow-y-auto h-[calc(100vh-64px)] w-full select-none">
      
      {/* Header section */}
      <div className="flex justify-between items-center border-b border-cj-gray-200 pb-4">
        <div>
          <span className="text-[10px] text-cj-red font-bold uppercase tracking-wider block bg-cj-red/5 px-2 py-0.5 rounded-full w-max">
            {language === 'VI' ? 'PMBOK Phân rã phạm vi' : (language === 'KO' ? 'PMBOK 범위 관리' : 'PMBOK Scope & WBS')}
          </span>
          <h1 className="text-xl font-extrabold text-cj-gray-800 mt-1">{t('menu_wbs')}</h1>
          <p className="text-xs text-gray-500">
            {language === 'VI' ? 'Phân rã phạm vi dự án thành các giai đoạn, sản phẩm bàn giao và gói công việc cụ thể.' : (language === 'KO' ? '프로젝트 범위를 단계, 인도물 및 작업 패키지로 계층화하여 세분화합니다.' : 'Deconstruct project scope into hierarchical phases, deliverables, and actionable work packages.')}
          </p>
        </div>

        {/* Buttons section */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportToExcel}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-cj-gray-200 hover:bg-cj-gray-100 text-cj-gray-800 rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <svg className="h-4 w-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><line x1="10" y1="9" x2="8" y2="9"></line></svg>
            <span>{language === 'VI' ? 'Xuất Excel' : (language === 'KO' ? '엑셀 내보내기' : 'Export to Excel')}</span>
          </button>

          {!isReadOnly && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-cj-blue hover:bg-cj-blue/95 text-white rounded-lg text-xs font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{language === 'VI' ? 'Thêm công việc WBS' : (language === 'KO' ? 'WBS 작업 추가' : 'Add WBS Task')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Filters Toolbelt (UX Upgrade #4) */}
      <div className="bg-white p-4 rounded-xl border border-cj-gray-200 shadow-sm flex max-md:flex-col items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Text Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder={language === 'VI' ? 'Tìm tên công việc...' : (language === 'KO' ? '작업명 검색...' : 'Search task title...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 bg-cj-gray-100/60 focus:bg-white border border-transparent focus:border-cj-gray-200 rounded-lg text-xs outline-none transition-all w-52 placeholder:text-gray-400 font-medium"
            />
          </div>

          {/* PIC Filter */}
          <div className="flex items-center space-x-1">
            <Filter className="h-3 w-3 text-gray-400" />
            <select
              className="text-xs p-1.5 bg-cj-gray-100/60 hover:bg-cj-gray-100 border border-transparent rounded-lg outline-none cursor-pointer font-bold text-cj-gray-700"
              value={filterPicId}
              onChange={(e) => setFilterPicId(e.target.value)}
            >
              <option value="all">{language === 'VI' ? 'Tất cả người phụ trách' : (language === 'KO' ? '전체 담당자' : 'All Owners')}</option>
              {mockUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1">
            <select
              className="text-xs p-1.5 bg-cj-gray-100/60 hover:bg-cj-gray-100 border border-transparent rounded-lg outline-none cursor-pointer font-bold text-cj-gray-700"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">{language === 'VI' ? 'Tất cả trạng thái' : (language === 'KO' ? '전체 상태' : 'All Statuses')}</option>
              {['Backlog', 'Planning', 'To Do', 'In Progress', 'Review', 'Blocked', 'Completed'].map(status => (
                <option key={status} value={status}>{getStatusDisplayFilter(status)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {isFiltered && (
          <button
            onClick={clearFilters}
            className="text-[10px] font-bold text-cj-red hover:underline cursor-pointer flex items-center space-x-1"
          >
            <X className="h-3 w-3" />
            <span>{language === 'VI' ? 'Xóa bộ lọc' : (language === 'KO' ? '필터 해제' : 'Clear Filters')}</span>
          </button>
        )}
      </div>

      {/* Task Creation Form Panel */}
      {showAddForm && (
        <form onSubmit={handleAddTask} className="p-5 bg-white border border-cj-gray-200 rounded-2xl shadow-soft space-y-4 animate-scale-in">
          <h3 className="text-xs font-bold text-cj-gray-800 uppercase tracking-wider">
            {language === 'VI' ? 'Khởi tạo phần tử WBS mới' : (language === 'KO' ? '새 WBS 작업 생성' : 'Add New WBS Task Element')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                {language === 'VI' ? 'Tiêu đề công việc' : (language === 'KO' ? '작업명' : 'Task Title')}
              </label>
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
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                {language === 'VI' ? 'Phần tử cha (WBS)' : (language === 'KO' ? '상위 WBS 요소' : 'Parent WBS Element')}
              </label>
              <select
                className="w-full text-xs p-2.5 bg-cj-gray-100 border border-transparent focus:bg-white focus:border-cj-red rounded-lg outline-none cursor-pointer"
                value={newParentId}
                onChange={(e) => setNewParentId(e.target.value)}
              >
                <option value="null">{language === 'VI' ? 'Không có (Cấp Giai đoạn/Phase)' : (language === 'KO' ? '없음 (상위 단계)' : 'None (Root Level Phase)')}</option>
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
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                {language === 'VI' ? 'Ngày bắt đầu' : (language === 'KO' ? '시작일' : 'Start Date')}
              </label>
              <input
                type="date"
                required
                className="w-full text-xs p-2 bg-cj-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-cj-red outline-none"
                value={newStartDate}
                onChange={(e) => setNewStartDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
                {language === 'VI' ? 'Ngày hoàn thành' : (language === 'KO' ? '기한일' : 'Due Date')}
              </label>
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
            <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">
              {language === 'VI' ? 'Mô tả ngắn' : (language === 'KO' ? '간략 설명' : 'Short Description')}
            </label>
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
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-cj-blue hover:bg-cj-blue/90 text-white rounded-lg text-xs font-semibold shadow cursor-pointer"
            >
              {language === 'VI' ? 'Tạo phần tử WBS' : (language === 'KO' ? 'WBS 요소 생성' : 'Create WBS Element')}
            </button>
          </div>
        </form>
      )}

      {/* Hierarchical WBS Table */}
      <div className="bg-white rounded-2xl border border-cj-gray-200/80 shadow-soft overflow-hidden">
        <table className="min-w-full divide-y divide-cj-gray-200">
          <thead className="bg-cj-gray-100/50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
            <tr>
              <th scope="col" className="py-3 pl-6 pr-3 text-left">{language === 'VI' ? 'Phân cấp WBS / Tên công việc' : (language === 'KO' ? '계층 구조 / 작업명' : 'Hierarchy element / Title')}</th>
              <th scope="col" className="px-3 py-3 text-left">{language === 'VI' ? 'Mô tả' : (language === 'KO' ? '설명' : 'Description')}</th>
              <th scope="col" className="px-3 py-3 text-left">{language === 'VI' ? 'Phụ trách (PIC)' : (language === 'KO' ? '담당자' : 'Owner (PIC)')}</th>
              <th scope="col" className="px-3 py-3 text-left">{language === 'VI' ? 'Thời hạn' : (language === 'KO' ? '일정' : 'Target Dates')}</th>
              <th scope="col" className="px-3 py-3 text-center">{language === 'VI' ? 'Tiến độ' : (language === 'KO' ? '진척도' : 'Progress')}</th>
              <th scope="col" className="px-3 py-3 text-center">{language === 'VI' ? 'Trạng thái' : (language === 'KO' ? '상태' : 'Status')}</th>
              <th scope="col" className="px-3 py-3 text-center">RACI</th>
              <th scope="col" className="px-3 py-3 text-center">{language === 'VI' ? 'Thao tác' : (language === 'KO' ? '관리' : 'Action')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-cj-gray-100">
            {isFiltered ? (
              filteredTasks.length > 0 ? (
                filteredTasks.map((t) => (
                  <TreeNode key={t.id} task={t} depth={0} />
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-xs text-gray-400">
                    {language === 'VI' ? 'Không tìm thấy công việc nào khớp với bộ lọc.' : (language === 'KO' ? '필터 조건에 부합하는 작업이 없습니다.' : 'No tasks match the active filters.')}
                  </td>
                </tr>
              )
            ) : rootTasks.length > 0 ? (
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

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <form onSubmit={handleSaveEdit} className="bg-white rounded-2xl shadow-lg border border-cj-gray-200 max-w-lg w-full overflow-hidden animate-scale-in">
            <div className="p-4 border-b bg-cj-gray-100/50 flex justify-between items-center">
              <span className="font-bold text-sm text-cj-gray-800">
                {language === 'VI' ? 'Cập nhật tiến độ & Trạng thái tác vụ' : (language === 'KO' ? '작업 진척도 및 상태 업데이트' : 'Update Task Progress & Status')}
              </span>
              <button type="button" onClick={() => setEditingTask(null)} className="text-gray-400 hover:text-cj-red transition-all cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">
                  {language === 'VI' ? 'Tiêu đề công việc' : (language === 'KO' ? '작업명' : 'Task Title')}
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2.5 bg-cj-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-cj-red outline-none"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1">Person In Charge (PIC)</label>
                  <select
                    className="w-full p-2.5 bg-cj-gray-100 border border-transparent rounded-lg cursor-pointer outline-none"
                    value={editPicId}
                    onChange={(e) => setEditPicId(e.target.value)}
                  >
                    {mockUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1">RACI Matrix</label>
                  <select
                    className="w-full p-2.5 bg-cj-gray-100 border border-transparent rounded-lg cursor-pointer outline-none"
                    value={editRaci}
                    onChange={(e) => setEditRaci(e.target.value as any)}
                  >
                    <option value="R">Responsible (R)</option>
                    <option value="A">Accountable (A)</option>
                    <option value="C">Consulted (C)</option>
                    <option value="I">Informed (I)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1">
                    {language === 'VI' ? 'Ngày bắt đầu' : (language === 'KO' ? '시작일' : 'Start Date')}
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full p-2 bg-cj-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-cj-red outline-none"
                    value={editStartDate}
                    onChange={(e) => setEditStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1">
                    {language === 'VI' ? 'Ngày hoàn thành' : (language === 'KO' ? '기한일' : 'Due Date')}
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full p-2 bg-cj-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-cj-red outline-none"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1">
                    {language === 'VI' ? 'Độ tiến độ (%)' : (language === 'KO' ? '진척률 (%)' : 'Progress (%)')}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    className="w-full p-2 bg-cj-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-cj-red outline-none text-right"
                    value={editProgress}
                    onChange={(e) => setEditProgress(Math.min(100, Math.max(0, Number(e.target.value))))}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-400 uppercase mb-1">
                    {language === 'VI' ? 'Trạng thái' : (language === 'KO' ? '상태' : 'Status')}
                  </label>
                  <select
                    className="w-full p-2.5 bg-cj-gray-100 border border-transparent rounded-lg cursor-pointer outline-none"
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                  >
                    <option value="Backlog">Backlog</option>
                    <option value="Planning">Planning</option>
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Review">Review</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-gray-400 uppercase mb-1">
                  {language === 'VI' ? 'Mô tả chi tiết' : (language === 'KO' ? '상세 설명' : 'Short Description')}
                </label>
                <textarea
                  className="w-full p-2.5 bg-cj-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-cj-red outline-none text-xs"
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 border-t bg-cj-gray-100/30 flex justify-end space-x-2">
              <button type="button" onClick={() => setEditingTask(null)} className="px-3.5 py-1.5 bg-cj-gray-100 hover:bg-cj-gray-200 text-cj-gray-800 rounded-lg text-xs font-semibold cursor-pointer">
                {t('cancel')}
              </button>
              <button type="submit" className="px-4 py-1.5 bg-cj-blue hover:bg-cj-blue/90 text-white rounded-lg text-xs font-semibold shadow cursor-pointer flex items-center space-x-1">
                <Save className="h-3.5 w-3.5" />
                <span>{language === 'VI' ? 'Lưu chỉnh sửa' : (language === 'KO' ? '수정사항 저장' : 'Save Changes')}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
