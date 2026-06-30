'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  User,
  Project,
  Task,
  Risk,
  Issue,
  ChangeRequest,
  ProjectDocument,
  Meeting,
  AuditLog,
  ResourceAllocation,
  mockUsers,
  mockProjects,
  mockTasks,
  mockRisks,
  mockIssues,
  mockChangeRequests,
  mockDocuments,
  mockMeetings,
  mockResourceAllocations,
  mockAuditLogs
} from '../data/mockData';
import { translations } from '../data/translations';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  risks: Risk[];
  setRisks: React.Dispatch<React.SetStateAction<Risk[]>>;
  issues: Issue[];
  setIssues: React.Dispatch<React.SetStateAction<Issue[]>>;
  changeRequests: ChangeRequest[];
  setChangeRequests: React.Dispatch<React.SetStateAction<ChangeRequest[]>>;
  documents: ProjectDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<ProjectDocument[]>>;
  meetings: Meeting[];
  setMeetings: React.Dispatch<React.SetStateAction<Meeting[]>>;
  resources: ResourceAllocation[];
  setResources: React.Dispatch<React.SetStateAction<ResourceAllocation[]>>;
  auditLogs: AuditLog[];
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditLog[]>>;
  notifications: { id: string; text: string; time: string; read: boolean; type: string }[];
  addNotification: (text: string, type: string) => void;
  markNotificationsRead: () => void;
  logAction: (projectId: string, action: string, fieldName?: string, oldValue?: string, newValue?: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  language: 'EN' | 'VI' | 'KO';
  setLanguage: (lang: 'EN' | 'VI' | 'KO') => void;
  t: (key: string) => string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [activeProjectId, setActiveProjectId] = useState<string>('p1');
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [risks, setRisks] = useState<Risk[]>(mockRisks);
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>(mockChangeRequests);
  const [documents, setDocuments] = useState<ProjectDocument[]>(mockDocuments);
  const [meetings, setMeetings] = useState<Meeting[]>(mockMeetings);
  const [resources, setResources] = useState<ResourceAllocation[]>(mockResourceAllocations);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [language, setLanguage] = useState<'EN' | 'VI' | 'KO'>('EN');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const [notifications, setNotifications] = useState<
    { id: string; text: string; time: string; read: boolean; type: string }[]
  >([
    { id: 'n1', text: 'Ms. Hương requested review on Artwork V4', time: '10m ago', read: false, type: 'approval' },
    { id: 'n2', text: 'Dự án DMS B2B - Import MCP milestone is 100% complete', time: '1h ago', read: false, type: 'milestone' },
    { id: 'n3', text: 'Issue ISS-001: Connection failure at Hiep Phuoc warehouse reported', time: '2h ago', read: true, type: 'issue' }
  ]);

  // Load state on mount (Supabase or localStorage)
  useEffect(() => {
    const initData = async () => {
      if (isSupabaseConfigured()) {
        try {
          console.log('Supabase detected! Loading real-time database state...');
          
          const { data: projData } = await supabase.from('projects').select('*');
          if (projData && projData.length > 0) setProjects(projData);

          const { data: taskData } = await supabase.from('tasks').select('*');
          if (taskData) setTasks(taskData);

          const { data: riskData } = await supabase.from('risks').select('*');
          if (riskData) setRisks(riskData);

          const { data: resData } = await supabase.from('resources').select('*');
          if (resData && resData.length > 0) setResources(resData);

          const { data: crData } = await supabase.from('change_requests').select('*');
          if (crData) setChangeRequests(crData);

          const { data: docData } = await supabase.from('documents').select('*');
          if (docData) setDocuments(docData);

          const { data: meetData } = await supabase.from('meetings').select('*');
          if (meetData) setMeetings(meetData);

        } catch (err) {
          console.error('Failed to load from Supabase:', err);
        }
      } else {
        // Fallback to localStorage
        try {
          const storedProjects = localStorage.getItem('cj_projects');
          if (storedProjects) setProjects(JSON.parse(storedProjects));
          
          const storedTasks = localStorage.getItem('cj_tasks');
          if (storedTasks) setTasks(JSON.parse(storedTasks));


          const storedRisks = localStorage.getItem('cj_risks');
          if (storedRisks) setRisks(JSON.parse(storedRisks));

          const storedIssues = localStorage.getItem('cj_issues');
          if (storedIssues) setIssues(JSON.parse(storedIssues));

          const storedCR = localStorage.getItem('cj_changeRequests');
          if (storedCR) setChangeRequests(JSON.parse(storedCR));

          const storedDocs = localStorage.getItem('cj_documents');
          if (storedDocs) setDocuments(JSON.parse(storedDocs));

          const storedMeetings = localStorage.getItem('cj_meetings');
          if (storedMeetings) setMeetings(JSON.parse(storedMeetings));

          const storedResources = localStorage.getItem('cj_resources');
          if (storedResources) setResources(JSON.parse(storedResources));

          const storedLogs = localStorage.getItem('cj_auditLogs');
          if (storedLogs) setAuditLogs(JSON.parse(storedLogs));
        } catch (err) {
          console.error('Error loading config from localStorage:', err);
        }
      }

      // Local session states
      try {
        const storedUser = localStorage.getItem('cj_currentUser');
        if (storedUser) setCurrentUser(JSON.parse(storedUser));

        const storedLogin = localStorage.getItem('cj_isLoggedIn');
        if (storedLogin) setIsLoggedIn(JSON.parse(storedLogin));

        const storedLang = localStorage.getItem('cj_language') as 'EN' | 'VI' | 'KO';
        if (storedLang) setLanguage(storedLang);

        const storedNotifications = localStorage.getItem('cj_notifications');
        if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
      } catch (e) {
        console.error('Session load error:', e);
      }
    };

    initData();
  }, []);

  // Save states to local/Supabase database on change
  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.from('projects').upsert(projects).then(({ error }) => {
        if (error) console.error('Error upserting projects:', error);
      });
    } else {
      localStorage.setItem('cj_projects', JSON.stringify(projects));
    }
  }, [projects]);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.from('tasks').upsert(tasks).then(({ error }) => {
        if (error) console.error('Error upserting tasks:', error);
      });
    } else {
      localStorage.setItem('cj_tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.from('risks').upsert(risks).then(({ error }) => {
        if (error) console.error('Error upserting risks:', error);
      });
    } else {
      localStorage.setItem('cj_risks', JSON.stringify(risks));
    }
  }, [risks]);

  useEffect(() => {
    localStorage.setItem('cj_issues', JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.from('change_requests').upsert(changeRequests).then(({ error }) => {
        if (error) console.error('Error upserting changeRequests:', error);
      });
    } else {
      localStorage.setItem('cj_changeRequests', JSON.stringify(changeRequests));
    }
  }, [changeRequests]);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.from('documents').upsert(documents).then(({ error }) => {
        if (error) console.error('Error upserting documents:', error);
      });
    } else {
      localStorage.setItem('cj_documents', JSON.stringify(documents));
    }
  }, [documents]);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.from('meetings').upsert(meetings).then(({ error }) => {
        if (error) console.error('Error upserting meetings:', error);
      });
    } else {
      localStorage.setItem('cj_meetings', JSON.stringify(meetings));
    }
  }, [meetings]);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.from('resources').upsert(resources).then(({ error }) => {
        if (error) console.error('Error upserting resources:', error);
      });
    } else {
      localStorage.setItem('cj_resources', JSON.stringify(resources));
    }
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('cj_auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('cj_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('cj_currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cj_isLoggedIn', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('cj_language', language);
  }, [language]);

  // Synchronize deletions (UX Upgrades)
  const prevTasksRef = useRef<Task[]>(tasks);
  useEffect(() => {
    if (isSupabaseConfigured() && prevTasksRef.current.length > tasks.length) {
      const currentIds = new Set(tasks.map(t => t.id));
      const deleted = prevTasksRef.current.filter(t => !currentIds.has(t.id));
      deleted.forEach(async (t) => {
        await supabase.from('tasks').delete().eq('id', t.id);
      });
    }
    prevTasksRef.current = tasks;
  }, [tasks]);

  const prevProjectsRef = useRef<Project[]>(projects);
  useEffect(() => {
    if (isSupabaseConfigured() && prevProjectsRef.current.length > projects.length) {
      const currentIds = new Set(projects.map(p => p.id));
      const deleted = prevProjectsRef.current.filter(p => !currentIds.has(p.id));
      deleted.forEach(async (p) => {
        await supabase.from('projects').delete().eq('id', p.id);
      });
    }
    prevProjectsRef.current = projects;
  }, [projects]);

  const prevRisksRef = useRef<Risk[]>(risks);
  useEffect(() => {
    if (isSupabaseConfigured() && prevRisksRef.current.length > risks.length) {
      const currentIds = new Set(risks.map(r => r.id));
      const deleted = prevRisksRef.current.filter(r => !currentIds.has(r.id));
      deleted.forEach(async (r) => {
        await supabase.from('risks').delete().eq('id', r.id);
      });
    }
    prevRisksRef.current = risks;
  }, [risks]);

  const addNotification = (text: string, type: string) => {
    const newNotif = {
      id: Math.random().toString(36).substr(2, 9),
      text,
      time: 'Just now',
      read: false,
      type
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const logAction = (projectId: string, action: string, fieldName?: string, oldValue?: string, newValue?: string) => {
    const newLog: AuditLog = {
      id: Math.random().toString(36).substr(2, 9),
      projectId,
      timestamp: new Date().toLocaleString('sv-SE').slice(0, 16).replace('T', ' '),
      userName: currentUser.name,
      action,
      fieldName,
      oldValue,
      newValue
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Synchronize project completion progress based on child task completion percentage
  useEffect(() => {
    let changed = false;
    const newProjects = projects.map((proj) => {
      const projTasks = tasks.filter((t) => t.projectId === proj.id && t.parentId === null);
      if (projTasks.length > 0) {
        const avgProgress = Math.round(
          projTasks.reduce((acc, task) => acc + task.progress, 0) / projTasks.length
        );
        if (proj.progress !== avgProgress) {
          changed = true;
          return { ...proj, progress: avgProgress };
        }
      }
      return proj;
    });

    if (changed) {
      setProjects(newProjects);
    }
  }, [tasks]);

  const t = (key: string): string => {
    const langDict = translations[language] || translations.EN;
    return (langDict as any)[key] || (translations.EN as any)[key] || key;
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        projects,
        setProjects,
        activeProjectId,
        setActiveProjectId,
        tasks,
        setTasks,
        risks,
        setRisks,
        issues,
        setIssues,
        changeRequests,
        setChangeRequests,
        documents,
        setDocuments,
        meetings,
        setMeetings,
        resources,
        setResources,
        auditLogs,
        setAuditLogs,
        notifications,
        addNotification,
        markNotificationsRead,
        logAction,
        isLoggedIn,
        setIsLoggedIn,
        language,
        setLanguage,
        t,
        mobileMenuOpen,
        setMobileMenuOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
