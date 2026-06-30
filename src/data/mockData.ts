export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'Administrator' | 'PMO' | 'Project Manager' | 'Department Head' | 'Team Leader' | 'Member' | 'Viewer';
  department: string;
  avatar: string;
  password?: string;
}

export interface ResourceAllocation {
  userId: string;
  userName: string;
  department: string;
  capacityHours: number; // e.g., 40 hours/week
  allocatedHours: number;
  projects: { projectId: string; projectName: string; hours: number }[];
  availabilityStatus: 'Available' | 'Optimal' | 'Overloaded';
}

export interface Project {
  id: string;
  code: string;
  name: string;
  businessUnit: 'CJ Foods Vietnam' | 'CJ Cau Tre' | 'CJ Minh Dat';
  department: 'Sales' | 'Marketing' | 'Supply Chain' | 'Finance' | 'HR' | 'Manufacturing' | 'R&D' | 'Digital Transformation' | 'PMO';
  sponsor: string;
  pm: string;
  pmId: string;
  objective: string;
  businessJustification: string;
  scope: string;
  outOfScope: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  riskLevel: 'Low' | 'Medium' | 'High';
  strategicAlignment: 'Market Leadership' | 'Cost Optimization' | 'Digital Acceleration' | 'Product Innovation';
  status: 'Draft' | 'Planning' | 'Active' | 'Review' | 'Completed' | 'On Hold' | 'Cancelled';
  startDate: string;
  endDate: string;
  actualFinishDate?: string;
  budget: number; // in Million VND
  actualCost: number;
  progress: number; // 0 to 100
  type: 'Product Launch' | 'Trade Marketing' | 'Sales RTM' | 'Supply Chain' | 'General';
  stageGate?: 'Idea' | 'Feasibility' | 'Development' | 'Launch' | 'Post-launch';
  launchReadinessScore?: number; // 0-100
}

export interface Task {
  id: string;
  projectId: string;
  parentId: string | null;
  title: string;
  description: string;
  picId: string;
  picName: string;
  coOwnerId?: string;
  coOwnerName?: string;
  startDate: string;
  dueDate: string;
  durationDays: number;
  dependencies: string[];
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  progress: number;
  status: 'Backlog' | 'Planning' | 'To Do' | 'In Progress' | 'Review' | 'Blocked' | 'Completed';
  estimatedHours: number;
  actualHours: number;
  raci: 'R' | 'A' | 'C' | 'I';
  checklist: { id: string; text: string; done: boolean }[];
  approvals: { id: string; approverId: string; approverName: string; status: 'Pending' | 'Approved' | 'Rejected' | 'Returned'; comment?: string }[];
}

export interface Risk {
  id: string;
  projectId: string;
  code: string;
  description: string;
  probability: number; // 1-5
  impact: number; // 1-5
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  ownerName: string;
  mitigation: string;
  responseStrategy: 'Avoid' | 'Mitigate' | 'Transfer' | 'Accept';
  status: 'Open' | 'Mitigated' | 'Closed';
}

export interface Issue {
  id: string;
  projectId: string;
  code: string;
  description: string;
  ownerName: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  rootCause: string;
  correctiveAction: string;
  targetDate: string;
  status: 'Open' | 'Resolved' | 'Closed';
}

export interface ChangeRequest {
  id: string;
  projectId: string;
  code: string;
  title: string;
  description: string;
  businessImpact: string;
  costImpact: number; // in Million VND
  status: 'Draft' | 'Under Review' | 'Approved' | 'Rejected' | 'Returned';
  requestedBy: string;
  requestedDate: string;
  approvalHistory: { step: string; actor: string; action: string; date: string; comment?: string }[];
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  name: string;
  folder: 'Project Charter' | 'Stage-Gate Art' | 'POSM & Designs' | 'Financials' | 'Meeting Minutes' | 'General';
  version: string;
  updatedBy: string;
  updatedAt: string;
  size: string;
  status: 'Draft' | 'Approved' | 'Pending Review';
  fileUrl: string;
}

export interface Meeting {
  id: string;
  projectId: string;
  title: string;
  date: string;
  time: string;
  agenda: string[];
  minutes: string;
  decisions: string[];
  actionItems: { text: string; picName: string; deadline: string; status: 'Pending' | 'Done' }[];
}

export interface AuditLog {
  id: string;
  projectId: string;
  timestamp: string;
  userName: string;
  action: string;
  fieldName?: string;
  oldValue?: string;
  newValue?: string;
}

// ---------------- MOCK DATA SEED ----------------

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Hailp',
    username: 'hailp',
    email: 'hailp@cj.net',
    role: 'Administrator',
    department: 'Digital Transformation',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    password: 'Coke@2025'
  },
  {
    id: 'u2',
    name: 'Nguyễn Tuấn Đạt',
    username: 'dat.nt',
    email: 'dat.nt@cj.net',
    role: 'Department Head',
    department: 'Sales',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    password: 'CJ@2026'
  },
  {
    id: 'u3',
    name: 'Lê Phúc Hải',
    username: 'hai.lp',
    email: 'hai.lp@cj.net',
    role: 'Project Manager',
    department: 'Sales',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    password: 'CJ@2026'
  },
  {
    id: 'u4',
    name: 'Nguyễn Minh Hiền',
    username: 'hien.nm',
    email: 'hien.nm@cj.net',
    role: 'Team Leader',
    department: 'Digital Transformation',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    password: 'CJ@2026'
  },
  {
    id: 'u5',
    name: 'Ms. Hương',
    username: 'huong.sales',
    email: 'huong.sales@cj.net',
    role: 'Project Manager',
    department: 'Sales',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    password: 'CJ@2026'
  },
  {
    id: 'u6',
    name: 'Ms. Tú',
    username: 'tu.sales',
    email: 'tu.sales@cj.net',
    role: 'Member',
    department: 'Sales',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    password: 'CJ@2026'
  },
  {
    id: 'u7',
    name: 'Ms. Vi',
    username: 'vi.support',
    email: 'vi.support@cj.net',
    role: 'Member',
    department: 'Digital Transformation',
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&auto=format&fit=crop&q=80',
    password: 'CJ@2026'
  },
  {
    id: 'u8',
    name: 'Ms. Bông',
    username: 'bong.support',
    email: 'bong.support@cj.net',
    role: 'Member',
    department: 'Digital Transformation',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100&auto=format&fit=crop&q=80',
    password: 'CJ@2026'
  },
  {
    id: 'u9',
    name: 'Ms. Hạnh',
    username: 'hanh.process',
    email: 'hanh.process@cj.net',
    role: 'Member',
    department: 'Finance',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&auto=format&fit=crop&q=80',
    password: 'CJ@2026'
  },
  {
    id: 'u10',
    name: 'Ms. Vi - Trade',
    username: 'vi.trade',
    email: 'vi.trade@cj.net',
    role: 'Member',
    department: 'Marketing',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    password: 'CJ@2026'
  },
  {
    id: 'u11',
    name: 'B2B Sales Manager',
    username: 'b2b.manager',
    email: 'b2b.manager@cj.net',
    role: 'Project Manager',
    department: 'Sales',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    password: 'CJ@2026'
  }
];

export const mockProjects: Project[] = [
  {
    id: 'p1',
    code: 'CJ-DMS-B2B',
    name: 'Dự án DMS B2B',
    businessUnit: 'CJ Foods Vietnam',
    department: 'Sales',
    sponsor: 'Nguyễn Tuấn Đạt',
    pm: 'Lê Phúc Hải',
    pmId: 'u3',
    objective: 'Triển khai hệ thống quản trị nhà phân phối (DMS) B2B nhằm tự động hóa quy trình quản lý đơn hàng, công nợ và tồn kho của nhà phân phối trên toàn quốc.',
    businessJustification: 'Hệ thống DMS cũ hoạt động thủ công gây trễ đơn hàng 24h và thất thoát dữ liệu tồn kho. DMS B2B mới dự kiến giảm chi phí vận hành 15% và đồng bộ dữ liệu Realtime.',
    scope: 'Thiết lập luồng đơn hàng, kết nối dữ liệu tồn kho, phân quyền người dùng và tích hợp hóa đơn điện tử.',
    outOfScope: 'Tích hợp kênh bán lẻ trực tuyến (B2C), nâng cấp cơ sở hạ tầng mạng tại văn phòng nhà phân phối.',
    priority: 'Critical',
    riskLevel: 'Medium',
    strategicAlignment: 'Digital Acceleration',
    status: 'Active',
    startDate: '2026-06-08',
    endDate: '2026-09-30',
    budget: 3500, // Million VND
    actualCost: 1420,
    progress: 58,
    type: 'Sales RTM',
    stageGate: 'Development',
    launchReadinessScore: 72
  },
  {
    id: 'p2',
    code: 'CJ-GOLD-OUT',
    name: 'Golden Outlet',
    businessUnit: 'CJ Foods Vietnam',
    department: 'Sales',
    sponsor: 'Nguyễn Tuấn Đạt',
    pm: 'Nguyễn Minh Hiền',
    pmId: 'u4',
    objective: 'Phân khúc và tối ưu hóa tuyến bán hàng cho 1000 điểm bán trọng điểm (Golden Outlet) thuộc kênh GT và MT khu vực miền Nam.',
    businessJustification: 'Nhóm cửa hàng trọng điểm đóng góp 60% doanh thu nhưng tần suất viếng thăm chưa tối ưu, tỷ lệ rớt đơn hàng còn ở mức 22%.',
    scope: 'Outlet mapping, đo lường KPI trưng bày, xây dựng call cycle mới trên ứng dụng SFE.',
    outOfScope: 'Thiết kế chương trình khuyến mãi Tết, sản xuất POSM.',
    priority: 'High',
    riskLevel: 'Low',
    strategicAlignment: 'Market Leadership',
    status: 'Planning',
    startDate: '2026-07-01',
    endDate: '2026-12-31',
    budget: 1800,
    actualCost: 100,
    progress: 10,
    type: 'Sales RTM'
  },
  {
    id: 'p3',
    code: 'CJ-CR-DMS-2026',
    name: 'CR DMS 2026',
    businessUnit: 'CJ Foods Vietnam',
    department: 'Sales',
    sponsor: 'Nguyễn Tuấn Đạt',
    pm: 'Lê Phúc Hải',
    pmId: 'u3',
    objective: 'Xử lý các yêu cầu thay đổi (CR) phát sinh trong quá trình vận hành hệ thống DMS phiên bản năm 2026, bao gồm tối ưu hóa báo cáo SFE.',
    businessJustification: 'Yêu cầu quản lý phân vùng bán hàng của ASM/RSM thay đổi liên tục đòi hỏi các điều chỉnh linh hoạt trên ERP và DMS.',
    scope: 'Phân tích thiết kế luồng phê duyệt CR, cập nhật mã nguồn phân hệ báo cáo, kiểm thử tích hợp.',
    outOfScope: 'Phát triển module tính lương thưởng hoa hồng cho nhân viên bán hàng.',
    priority: 'Medium',
    riskLevel: 'High',
    strategicAlignment: 'Cost Optimization',
    status: 'Active',
    startDate: '2026-03-01',
    endDate: '2026-10-31',
    budget: 1200,
    actualCost: 450,
    progress: 40,
    type: 'Sales RTM'
  }
];

export const mockTasks: Task[] = [
  // --- PROJECT 1: Dự án DMS B2B (Integrated Actual Deployment plan) ---
  
  // Phase 1: Preparation Phase (WBS Parent)
  {
    id: 't1_prep',
    projectId: 'p1',
    parentId: null,
    title: 'Giai đoạn Chuẩn bị (Preparation Phase)',
    description: 'Khảo sát, thảo luận luồng nghiệp vụ nội bộ và chuẩn bị dữ liệu Master Data.',
    picId: 'u5',
    picName: 'Ms. Hương',
    startDate: '2026-06-08',
    dueDate: '2026-07-03',
    durationDays: 25,
    dependencies: [],
    priority: 'High',
    progress: 95,
    status: 'In Progress',
    estimatedHours: 240,
    actualHours: 230,
    raci: 'A',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_1',
    projectId: 'p1',
    parentId: 't1_prep',
    title: '1st discussion WS internal sales teamB2B',
    description: 'Thảo luận nội bộ thiết lập quy trình triển khai B2B.',
    picId: 'u11',
    picName: 'B2B Sales Manager',
    startDate: '2026-06-08',
    dueDate: '2026-06-25',
    durationDays: 17,
    dependencies: [],
    priority: 'Medium',
    progress: 100,
    status: 'Completed',
    estimatedHours: 40,
    actualHours: 40,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_2',
    projectId: 'p1',
    parentId: 't1_prep',
    title: 'Lên plan và mức độ ưu tiên cho các NPP theo batch',
    description: 'Phân loại các cụm nhà phân phối triển khai thí điểm.',
    picId: 'u11',
    picName: 'B2B Sales Manager',
    startDate: '2026-06-08',
    dueDate: '2026-06-19',
    durationDays: 11,
    dependencies: ['t1_1'],
    priority: 'Medium',
    progress: 100,
    status: 'Completed',
    estimatedHours: 24,
    actualHours: 20,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_3',
    projectId: 'p1',
    parentId: 't1_prep',
    title: 'Chuẩn bị các nền tảng hạ tầng cho batch 1',
    description: 'Đảm bảo môi trường kết nối mạng, server cho Batch 1.',
    picId: 'u4',
    picName: 'Nguyễn Minh Hiền',
    startDate: '2026-06-10',
    dueDate: '2026-06-30',
    durationDays: 20,
    dependencies: [],
    priority: 'High',
    progress: 100,
    status: 'Completed',
    estimatedHours: 48,
    actualHours: 46,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_4',
    projectId: 'p1',
    parentId: 't1_prep',
    title: 'Chuẩn bị giá bán theo từng NPP (nếu có)',
    description: 'Thống nhất cơ chế giá riêng biệt cho từng đối tác.',
    picId: 'u11',
    picName: 'B2B Sales Manager',
    startDate: '2026-06-15',
    dueDate: '2026-06-30',
    durationDays: 15,
    dependencies: [],
    priority: 'Medium',
    progress: 100,
    status: 'Completed',
    estimatedHours: 30,
    actualHours: 32,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_5',
    projectId: 'p1',
    parentId: 't1_prep',
    title: 'Chuẩn bị các CTKM (nếu có)',
    description: 'Lên danh sách khuyến mãi tích hợp.',
    picId: 'u11',
    picName: 'B2B Sales Manager',
    coOwnerId: 'u10',
    coOwnerName: 'Ms. Vi - Trade',
    startDate: '2026-06-15',
    dueDate: '2026-06-30',
    durationDays: 15,
    dependencies: [],
    priority: 'Medium',
    progress: 100,
    status: 'Completed',
    estimatedHours: 30,
    actualHours: 28,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_6',
    projectId: 'p1',
    parentId: 't1_prep',
    title: 'List down danh sách SKU B2B bán',
    description: 'Danh mục mặt hàng B2B chính thức đưa lên hệ thống.',
    picId: 'u11',
    picName: 'B2B Sales Manager',
    startDate: '2026-06-20',
    dueDate: '2026-07-01',
    durationDays: 11,
    dependencies: [],
    priority: 'Medium',
    progress: 90,
    status: 'In Progress',
    estimatedHours: 20,
    actualHours: 18,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_7',
    projectId: 'p1',
    parentId: 't1_prep',
    title: 'Cung cấp danh sách NPP B2B',
    description: 'Bàn giao dữ liệu danh sách mã nhà phân phối.',
    picId: 'u11',
    picName: 'B2B Sales Manager',
    startDate: '2026-06-20',
    dueDate: '2026-07-01',
    durationDays: 11,
    dependencies: [],
    priority: 'Medium',
    progress: 90,
    status: 'In Progress',
    estimatedHours: 20,
    actualHours: 18,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_8',
    projectId: 'p1',
    parentId: 't1_prep',
    title: 'Cung cấp bảng giá bán sell in và sell out',
    description: 'Thiết lập bảng giá tiêu chuẩn kênh B2B.',
    picId: 'u10',
    picName: 'Ms. Vi - Trade',
    coOwnerId: 'u11',
    coOwnerName: 'B2B Sales Manager',
    startDate: '2026-06-20',
    dueDate: '2026-07-01',
    durationDays: 11,
    dependencies: [],
    priority: 'High',
    progress: 90,
    status: 'In Progress',
    estimatedHours: 30,
    actualHours: 25,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_9',
    projectId: 'p1',
    parentId: 't1_prep',
    title: 'Tạo new SKU trên DMS',
    description: 'Khai báo mã hàng hóa trên môi trường DMS.',
    picId: 'u9',
    picName: 'Ms. Hạnh',
    startDate: '2026-07-01',
    dueDate: '2026-07-03',
    durationDays: 2,
    dependencies: ['t1_6'],
    priority: 'Medium',
    progress: 0,
    status: 'To Do',
    estimatedHours: 16,
    actualHours: 0,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_10',
    projectId: 'p1',
    parentId: 't1_prep',
    title: 'Tạo code NPP B2B',
    description: 'Cài đặt mã định danh nhà phân phối.',
    picId: 'u9',
    picName: 'Ms. Hạnh',
    startDate: '2026-07-01',
    dueDate: '2026-07-03',
    durationDays: 2,
    dependencies: ['t1_7'],
    priority: 'Medium',
    progress: 0,
    status: 'To Do',
    estimatedHours: 16,
    actualHours: 0,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_11',
    projectId: 'p1',
    parentId: 't1_prep',
    title: 'Cài giá bán sell in và sell out (exclude Khuyến mãi)',
    description: 'Nhập liệu biểu giá chính thức không tính chiết khấu.',
    picId: 'u9',
    picName: 'Ms. Hạnh',
    startDate: '2026-07-01',
    dueDate: '2026-07-03',
    durationDays: 2,
    dependencies: ['t1_8'],
    priority: 'Medium',
    progress: 0,
    status: 'To Do',
    estimatedHours: 16,
    actualHours: 0,
    raci: 'R',
    checklist: [],
    approvals: []
  },

  // Phase 2: Execution Phase (WBS Parent)
  {
    id: 't1_exec',
    projectId: 'p1',
    parentId: null,
    title: 'Giai đoạn Triển khai (Execution Phase)',
    description: 'Chạy thử nghiệm Pilot, nạp dữ liệu MCP, đào tạo NPP và go-live.',
    picId: 'u6',
    picName: 'Ms. Tú',
    startDate: '2026-07-01',
    dueDate: '2026-07-31',
    durationDays: 30,
    dependencies: ['t1_prep'],
    priority: 'Critical',
    progress: 42,
    status: 'In Progress',
    estimatedHours: 400,
    actualHours: 150,
    raci: 'A',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_12',
    projectId: 'p1',
    parentId: 't1_exec',
    title: 'Workshop Kick Off & Pilot Batch 1 (5 Dist)',
    description: 'Khởi động dự án và chạy pilot thí điểm tại 5 nhà phân phối đầu tiên.',
    picId: 'u6',
    picName: 'Ms. Tú',
    startDate: '2026-07-01',
    dueDate: '2026-07-10',
    durationDays: 9,
    dependencies: [],
    priority: 'Critical',
    progress: 80,
    status: 'In Progress',
    estimatedHours: 60,
    actualHours: 45,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_13',
    projectId: 'p1',
    parentId: 't1_exec',
    title: 'Import MCP vào hệ thống',
    description: 'Nạp tuyến bán hàng. Batch 1: 6/7; Batch 2: 10/7; Batch 3: 3/8.',
    picId: 'u4',
    picName: 'Nguyễn Minh Hiền',
    startDate: '2026-07-01',
    dueDate: '2026-07-06',
    durationDays: 5,
    dependencies: [],
    priority: 'High',
    progress: 60,
    status: 'In Progress',
    estimatedHours: 40,
    actualHours: 25,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_14',
    projectId: 'p1',
    parentId: 't1_exec',
    title: 'Import giá, CTKM (bao gồm cả tặng hàng + discount)',
    description: 'Nạp biểu giá và danh mục khuyến mãi tặng kèm.',
    picId: 'u10',
    picName: 'Ms. Vi - Trade',
    startDate: '2026-07-01',
    dueDate: '2026-07-06',
    durationDays: 5,
    dependencies: [],
    priority: 'High',
    progress: 50,
    status: 'In Progress',
    estimatedHours: 32,
    actualHours: 16,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_15',
    projectId: 'p1',
    parentId: 't1_exec',
    title: 'Request tạo tài khoản cho các batch tháng 7',
    description: 'Mở tài khoản sử dụng. Yêu cầu: đủ kế toán + SM học DMS, máy tính/wifi sẵn sàng, tồn kho có hàng go-live.',
    picId: 'u4',
    picName: 'Nguyễn Minh Hiền',
    coOwnerId: 'u1',
    coOwnerName: 'Hailp',
    startDate: '2026-06-25',
    dueDate: '2026-07-01',
    durationDays: 6,
    dependencies: [],
    priority: 'High',
    progress: 100,
    status: 'Completed',
    estimatedHours: 20,
    actualHours: 20,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_16',
    projectId: 'p1',
    parentId: 't1_exec',
    title: 'Tổ chức training cho HO - B2B',
    description: 'Đào tạo sử dụng cho nhân sự khối văn phòng.',
    picId: 'u3',
    picName: 'Lê Phúc Hải',
    startDate: '2026-07-01',
    dueDate: '2026-07-06',
    durationDays: 5,
    dependencies: [],
    priority: 'High',
    progress: 0,
    status: 'To Do',
    estimatedHours: 20,
    actualHours: 0,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_17',
    projectId: 'p1',
    parentId: 't1_exec',
    title: 'Tổ chức training cho các NPP batch 1',
    description: 'Đào tạo kỹ năng vận hành thực tế cho Batch 1.',
    picId: 'u3',
    picName: 'Lê Phúc Hải',
    startDate: '2026-07-05',
    dueDate: '2026-07-07',
    durationDays: 2,
    dependencies: [],
    priority: 'Critical',
    progress: 0,
    status: 'To Do',
    estimatedHours: 16,
    actualHours: 0,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_18',
    projectId: 'p1',
    parentId: 't1_exec',
    title: 'Tổ chức training cho các NPP batch 2',
    description: 'Đào tạo kỹ năng vận hành thực tế cho Batch 2.',
    picId: 'u3',
    picName: 'Lê Phúc Hải',
    startDate: '2026-07-10',
    dueDate: '2026-07-14',
    durationDays: 4,
    dependencies: [],
    priority: 'High',
    progress: 0,
    status: 'To Do',
    estimatedHours: 16,
    actualHours: 0,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_19',
    projectId: 'p1',
    parentId: 't1_exec',
    title: 'WS batch 2',
    description: 'Họp chuẩn bị triển khai cụm NPP đợt 2.',
    picId: 'u6',
    picName: 'Ms. Tú',
    startDate: '2026-07-10',
    dueDate: '2026-07-20',
    durationDays: 10,
    dependencies: [],
    priority: 'Medium',
    progress: 0,
    status: 'To Do',
    estimatedHours: 24,
    actualHours: 0,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_20',
    projectId: 'p1',
    parentId: 't1_exec',
    title: 'Cut off data distributor Batch 1',
    description: 'Chuyển đổi và khóa sổ dữ liệu cũ để đưa Batch 1 lên hệ thống mới.',
    picId: 'u4',
    picName: 'Nguyễn Minh Hiền',
    startDate: '2026-07-08',
    dueDate: '2026-07-15',
    durationDays: 7,
    dependencies: ['t1_17'],
    priority: 'High',
    progress: 0,
    status: 'To Do',
    estimatedHours: 32,
    actualHours: 0,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_21',
    projectId: 'p1',
    parentId: 't1_exec',
    title: 'Cut off data distributor Batch 2 (target 1/8)',
    description: 'Khóa sổ chuyển đổi dữ liệu cho Batch 2.',
    picId: 'u4',
    picName: 'Nguyễn Minh Hiền',
    startDate: '2026-07-01',
    dueDate: '2026-07-28',
    durationDays: 27,
    dependencies: [],
    priority: 'High',
    progress: 10,
    status: 'In Progress',
    estimatedHours: 40,
    actualHours: 4,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_22',
    projectId: 'p1',
    parentId: 't1_exec',
    title: 'Chuẩn bị Headcount vận hành payment sell out',
    description: 'Sắp xếp nhân sự kế toán thanh toán cho NPP.',
    picId: 'u9',
    picName: 'Ms. Hạnh',
    startDate: '2026-07-01',
    dueDate: '2026-07-11',
    durationDays: 10,
    dependencies: [],
    priority: 'Medium',
    progress: 0,
    status: 'To Do',
    estimatedHours: 24,
    actualHours: 0,
    raci: 'R',
    checklist: [],
    approvals: []
  },

  // Phase 3: Support Phase (WBS Parent)
  {
    id: 't1_support',
    projectId: 'p1',
    parentId: null,
    title: 'Giai đoạn Hỗ trợ Vận hành (Support Phase)',
    description: 'Hỗ trợ kỹ thuật sau golive, triển khai NPP Batch 3 và xử lý phát sinh.',
    picId: 'u8',
    picName: 'Ms. Bông',
    startDate: '2026-07-06',
    dueDate: '2026-09-30',
    durationDays: 86,
    dependencies: ['t1_exec'],
    priority: 'High',
    progress: 5,
    status: 'In Progress',
    estimatedHours: 300,
    actualHours: 15,
    raci: 'A',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_23',
    projectId: 'p1',
    parentId: 't1_support',
    title: 'Hỗ trợ vận hành sau triển khai',
    description: 'Bám sát và xử lý sự cố hàng ngày tại các NPP đã golive.',
    picId: 'u4',
    picName: 'Nguyễn Minh Hiền',
    coOwnerId: 'u7',
    coOwnerName: 'Ms. Vi',
    startDate: '2026-07-06',
    dueDate: '2026-09-15',
    durationDays: 71,
    dependencies: [],
    priority: 'High',
    progress: 10,
    status: 'In Progress',
    estimatedHours: 120,
    actualHours: 12,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_24',
    projectId: 'p1',
    parentId: 't1_support',
    title: 'Imp batch 3 & new distributor (when have)',
    description: 'Nhập liệu và golive cụm NPP Batch 3 cùng các NPP phát sinh mới.',
    picId: 'u4',
    picName: 'Nguyễn Minh Hiền',
    startDate: '2026-08-01',
    dueDate: '2026-09-30',
    durationDays: 60,
    dependencies: [],
    priority: 'Medium',
    progress: 0,
    status: 'To Do',
    estimatedHours: 80,
    actualHours: 0,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_25',
    projectId: 'p1',
    parentId: 't1_support',
    title: 'Tổ chức training cho các NPP batch 3',
    description: 'Đào tạo kỹ năng vận hành cho NPP Batch 3 từ tháng 8.',
    picId: 'u3',
    picName: 'Lê Phúc Hải',
    startDate: '2026-08-01',
    dueDate: '2026-08-10',
    durationDays: 9,
    dependencies: [],
    priority: 'Medium',
    progress: 0,
    status: 'To Do',
    estimatedHours: 16,
    actualHours: 0,
    raci: 'R',
    checklist: [],
    approvals: []
  },
  {
    id: 't1_26',
    projectId: 'p1',
    parentId: 't1_support',
    title: 'Support operation (Overall support)',
    description: 'Hỗ trợ tổng thể quy trình thanh toán, đặt hàng.',
    picId: 'u8',
    picName: 'Ms. Bông',
    startDate: '2026-08-01',
    dueDate: '2026-08-31',
    durationDays: 30,
    dependencies: [],
    priority: 'Medium',
    progress: 0,
    status: 'To Do',
    estimatedHours: 60,
    actualHours: 0,
    raci: 'R',
    checklist: [],
    approvals: []
  }
];

export const mockRisks: Risk[] = [
  {
    id: 'r1',
    projectId: 'p1',
    code: 'RSK-001',
    description: 'Độ trễ đồng bộ tồn kho ERP của CJ Foods có thể làm sai lệch dữ liệu đặt hàng B2B.',
    probability: 3,
    impact: 4,
    severity: 'High',
    ownerName: 'Lê Phúc Hải',
    mitigation: 'Thiết lập cơ chế kiểm tra đệm tồn kho (Buffer stock) và đồng bộ định kỳ 15 phút.',
    responseStrategy: 'Mitigate',
    status: 'Open'
  },
  {
    id: 'r2',
    projectId: 'p1',
    code: 'RSK-002',
    description: 'Nhà phân phối kháng cự quy trình kê khai hóa đơn tài chính mới trên ứng dụng.',
    probability: 2,
    impact: 5,
    severity: 'High',
    ownerName: 'Nguyễn Tuấn Đạt',
    mitigation: 'Tổ chức các buổi tập huấn trực tiếp và ban hành chính sách hỗ trợ chiết khấu chuyển đổi số.',
    responseStrategy: 'Mitigate',
    status: 'Open'
  }
];

export const mockIssues: Issue[] = [
  {
    id: 'is1',
    projectId: 'p1',
    code: 'ISS-001',
    description: 'Kênh truyền internet tại tổng kho Hiep Phuoc bị mất kết nối gây tắc nghẽn đơn hàng.',
    ownerName: 'Hailp',
    priority: 'High',
    rootCause: 'Đường truyền cáp quang của nhà mạng gặp sự cố đứt ngoài phạm vi khu công nghiệp.',
    correctiveAction: 'Sử dụng thiết bị dự phòng 4G phát mạng khẩn cấp phục vụ cổng API truyền đơn.',
    targetDate: '2026-06-26',
    status: 'Resolved'
  }
];

export const mockChangeRequests: ChangeRequest[] = [
  {
    id: 'cr_req1',
    projectId: 'p1',
    code: 'CR-001',
    title: 'Tích hợp thanh toán số quét mã QR nhà phân phối',
    description: 'Hỗ trợ NPP thanh toán chuyển khoản nhanh qua mã VietQR trực tiếp tại màn hình giao nhận đơn hàng.',
    businessImpact: 'Giảm thời gian đối chiếu công nợ của nhân viên kế toán từ 2 ngày xuống 5 phút, thúc đẩy dòng tiền.',
    costImpact: 150, // 150 Million VND
    status: 'Under Review',
    requestedBy: 'Lê Phúc Hải',
    requestedDate: '2026-06-22',
    approvalHistory: [
      { step: 'PM Review', actor: 'Lê Phúc Hải', action: 'Approved', date: '2026-06-23', comment: 'Tính năng khả thi cao.' }
    ]
  }
];

export const mockDocuments: ProjectDocument[] = [
  {
    id: 'd1',
    projectId: 'p1',
    name: 'Project_Charter_DMS_B2B_Signed.pdf',
    folder: 'Project Charter',
    version: '1.0',
    updatedBy: 'Nguyễn Tuấn Đạt',
    updatedAt: '2026-02-18',
    size: '3.2 MB',
    status: 'Approved',
    fileUrl: '#'
  },
  {
    id: 'd2',
    projectId: 'p1',
    name: 'Technical_Architecture_DMS_API.xlsx',
    folder: 'General',
    version: '1.5',
    updatedBy: 'Lê Phúc Hải',
    updatedAt: '2026-04-10',
    size: '1.8 MB',
    status: 'Approved',
    fileUrl: '#'
  }
];

export const mockMeetings: Meeting[] = [
  {
    id: 'm1',
    projectId: 'p1',
    title: 'DMS B2B - Triển khai Coding & Kết nối tồn kho SAP',
    date: '2026-06-15',
    time: '09:00 - 11:30',
    agenda: [
      'Báo cáo tiến độ phân hệ đặt hàng',
      'Đánh giá kết quả kiểm thử API SAP',
      'Xử lý vấn đề đường truyền kho Hiep Phuoc'
    ],
    minutes: 'Buổi họp thống nhất các trường dữ liệu bắt buộc của SAP. Anh Đạt duyệt tích hợp thử nghiệm từ 20/06. Hải chịu trách nhiệm điều phối kỹ thuật với đối tác ERP.',
    decisions: [
      'Đồng ý sử dụng buffer stock 5% đối với các mặt hàng đông lạnh bán chạy.',
      'Sử dụng 4G dự phòng cho các điểm kho ngoại thành.'
    ],
    actionItems: [
      { text: 'Kiểm tra tốc độ kết xuất API SAP', picName: 'Lê Phúc Hải', deadline: '2026-06-22', status: 'Done' }
    ]
  }
];

export const mockResourceAllocations: ResourceAllocation[] = [
  {
    userId: 'u3',
    userName: 'Lê Phúc Hải',
    department: 'Sales',
    capacityHours: 40,
    allocatedHours: 35,
    projects: [
      { projectId: 'p1', projectName: 'DMS B2B', hours: 25 },
      { projectId: 'p3', projectName: 'CR DMS 2026', hours: 10 }
    ],
    availabilityStatus: 'Optimal'
  },
  {
    userId: 'u4',
    userName: 'Nguyễn Minh Hiền',
    department: 'Sales',
    capacityHours: 40,
    allocatedHours: 23,
    projects: [
      { projectId: 'p1', projectName: 'DMS B2B', hours: 0 },
      { projectId: 'p2', projectName: 'Golden Outlet', hours: 23 }
    ],
    availabilityStatus: 'Optimal'
  },
  {
    userId: 'u2',
    userName: 'Nguyễn Tuấn Đạt',
    department: 'Sales',
    capacityHours: 40,
    allocatedHours: 12,
    projects: [
      { projectId: 'p1', projectName: 'DMS B2B', hours: 5 },
      { projectId: 'p2', projectName: 'Golden Outlet', hours: 4 },
      { projectId: 'p3', projectName: 'CR DMS 2026', hours: 3 }
    ],
    availabilityStatus: 'Available'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'a1',
    projectId: 'p1',
    timestamp: '2026-02-15 08:30',
    userName: 'Nguyễn Tuấn Đạt',
    action: 'Khởi tạo dự án DMS B2B trên hệ thống'
  },
  {
    id: 'a2',
    projectId: 'p1',
    timestamp: '2026-03-25 14:00',
    userName: 'Lê Phúc Hải',
    action: 'Hoàn tất thiết kế API kết nối tồn kho'
  }
];
