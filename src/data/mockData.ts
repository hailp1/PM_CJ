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
    department: 'Sales',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
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
    startDate: '2026-02-15',
    endDate: '2026-09-30',
    budget: 3500, // Million VND
    actualCost: 1420,
    progress: 55,
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
  // --- PROJECT 1: Dự án DMS B2B ---
  {
    id: 't1_1',
    projectId: 'p1',
    parentId: null,
    title: 'Phase 1: Khảo sát & Thiết kế hệ thống',
    description: 'Thu thập tài liệu quy trình bán hàng và thiết kế Database.',
    picId: 'u3',
    picName: 'Lê Phúc Hải',
    startDate: '2026-02-15',
    dueDate: '2026-04-15',
    durationDays: 59,
    dependencies: [],
    priority: 'High',
    progress: 100,
    status: 'Completed',
    estimatedHours: 160,
    actualHours: 172,
    raci: 'A',
    checklist: [
      { id: 'ck1', text: 'Khảo sát quy trình xử lý đơn hàng GT/MT', done: true },
      { id: 'ck2', text: 'Thống nhất cấu trúc bảng dữ liệu DMS', done: true },
      { id: 'ck3', text: 'Ký phê duyệt biên bản thiết kế tổng thể', done: true }
    ],
    approvals: []
  },
  {
    id: 't1_2',
    projectId: 'p1',
    parentId: 't1_1',
    title: 'Thống nhất API tích hợp dữ liệu tồn kho ERP',
    description: 'Xây dựng tài liệu đặc tả API kết nối tồn kho ERP SAP.',
    picId: 'u3',
    picName: 'Lê Phúc Hải',
    coOwnerId: 'u4',
    coOwnerName: 'Nguyễn Minh Hiền',
    startDate: '2026-03-01',
    dueDate: '2026-03-25',
    durationDays: 24,
    dependencies: [],
    priority: 'Medium',
    progress: 100,
    status: 'Completed',
    estimatedHours: 80,
    actualHours: 78,
    raci: 'R',
    checklist: [
      { id: 'ck4', text: 'Xác thực tài liệu SAP RFC', done: true },
      { id: 'ck5', text: 'Test thử nghiệm kết nối mạng nội bộ', done: true }
    ],
    approvals: [
      { id: 'ap1', approverId: 'u2', approverName: 'Nguyễn Tuấn Đạt', status: 'Approved', comment: 'Luồng truyền dữ liệu đáp ứng yêu cầu an toàn bảo mật.' }
    ]
  },
  {
    id: 't1_3',
    projectId: 'p1',
    parentId: null,
    title: 'Phase 2: Xây dựng Core module DMS B2B',
    description: 'Phát triển module đặt hàng, tồn kho và công nợ NPP.',
    picId: 'u3',
    picName: 'Lê Phúc Hải',
    startDate: '2026-04-16',
    dueDate: '2026-07-31',
    durationDays: 106,
    dependencies: ['t1_1'],
    priority: 'Critical',
    progress: 60,
    status: 'In Progress',
    estimatedHours: 420,
    actualHours: 240,
    raci: 'R',
    checklist: [
      { id: 'ck6', text: 'Coding API đặt hàng B2B', done: true },
      { id: 'ck7', text: 'Coding Module kiểm soát hạn mức công nợ', done: true },
      { id: 'ck8', text: 'Kết nối đồng bộ Realtime tồn kho nhà phân phối', done: false }
    ],
    approvals: []
  },
  {
    id: 't1_4',
    projectId: 'p1',
    parentId: 't1_3',
    title: 'Xây dựng hệ thống báo cáo sản lượng (SFE Dashboard)',
    description: 'Thiết kế giao diện báo cáo doanh số Realtime cho ASM.',
    picId: 'u4',
    picName: 'Nguyễn Minh Hiền',
    startDate: '2026-06-01',
    dueDate: '2026-07-15',
    durationDays: 44,
    dependencies: [],
    priority: 'High',
    progress: 45,
    status: 'In Progress',
    estimatedHours: 120,
    actualHours: 58,
    raci: 'R',
    checklist: [
      { id: 'ck9', text: 'Xác nhận KPI đo lường cho ASM', done: true },
      { id: 'ck10', text: 'Thiết kế biểu đồ SVG hiển thị tuyến bán hàng', done: false }
    ],
    approvals: []
  },

  // --- PROJECT 2: Golden Outlet ---
  {
    id: 't2_1',
    projectId: 'p2',
    parentId: null,
    title: 'Xác định tiêu chí phân loại Golden Outlet',
    description: 'Lọc danh sách 1000 cửa hàng bán lẻ có doanh số cao nhất.',
    picId: 'u4',
    picName: 'Nguyễn Minh Hiền',
    startDate: '2026-07-01',
    dueDate: '2026-07-20',
    durationDays: 19,
    dependencies: [],
    priority: 'High',
    progress: 0,
    status: 'Planning',
    estimatedHours: 60,
    actualHours: 0,
    raci: 'A',
    checklist: [
      { id: 'ck2_1', text: 'Trích xuất dữ liệu sản lượng GT lịch sử', done: false },
      { id: 'ck2_2', text: 'Đánh giá chỉ số phủ hàng của đối thủ', done: false }
    ],
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
    description: 'Kênh truyền internet tại tổng kho Hiep Phuoc bị mất kết nối gây tắc nghẽn đơn hàng chiều ngày 25/06.',
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
    allocatedHours: 38,
    projects: [
      { projectId: 'p1', projectName: 'DMS B2B', hours: 15 },
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
