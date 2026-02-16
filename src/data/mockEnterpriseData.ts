// Mock Enterprise Data for POC Demo
// Enterprise-level SaaS architecture with institutional models

export type EnterpriseType = 'hospital' | 'medical_school' | 'government' | 'individual';
export type EnterpriseRole = 'admin' | 'compliance_officer' | 'department_manager' | 'staff';

export interface Enterprise {
  id: string;
  name: string;
  type: EnterpriseType;
  domain: string;
  contactEmail: string;
  licenseSeats: number;
  usedSeats: number;
  createdAt: string;
  logoColor: string;
}

export interface Department {
  id: string;
  enterpriseId: string;
  name: string;
  description?: string;
}

export interface EnterpriseUser {
  id: string;
  email: string;
  name: string;
  enterpriseId: string;
  departmentIds: string[];
  role: EnterpriseRole;
  jobTitle?: string;
  isActive: boolean;
  lastAccess?: string;
}

export interface ComplianceCollection {
  id: string;
  name: string;
  description: string;
  category: 'perioperative' | 'anesthesia' | 'patient_safety' | 'surgical' | 'general';
  icon: string;
  bookIds: string[];
  isSystemBundle: boolean;
  enterpriseId?: string; // null for system bundles
}

export interface BookAccess {
  id: string;
  enterpriseId: string;
  bookId: string;
  accessLevel: 'full' | 'preview' | 'none';
  grantedAt: string;
  expiresAt?: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  enterpriseId: string;
  action: 'view_book' | 'view_chapter' | 'search' | 'download' | 'login' | 'logout' | 'access_collection';
  targetType?: 'book' | 'chapter' | 'collection' | 'search';
  targetId?: string;
  targetTitle?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

// Demo Enterprises
export const mockEnterprises: Enterprise[] = [
  {
    id: 'ent-metro-general',
    name: 'Metro General Hospital',
    type: 'hospital',
    domain: 'metrogeneral.org',
    contactEmail: 'admin@metrogeneral.org',
    licenseSeats: 250,
    usedSeats: 187,
    createdAt: '2024-01-15T00:00:00Z',
    logoColor: 'hsl(213 50% 35%)'
  },
  {
    id: 'ent-stanford-med',
    name: 'Stanford Medical School',
    type: 'medical_school',
    domain: 'stanford.edu',
    contactEmail: 'medlibrary@stanford.edu',
    licenseSeats: 500,
    usedSeats: 423,
    createdAt: '2023-09-01T00:00:00Z',
    logoColor: 'hsl(0 70% 45%)'
  },
  {
    id: 'ent-va-hospital',
    name: 'VA Medical Center - San Francisco',
    type: 'government',
    domain: 'va.gov',
    contactEmail: 'library.sf@va.gov',
    licenseSeats: 150,
    usedSeats: 98,
    createdAt: '2024-03-01T00:00:00Z',
    logoColor: 'hsl(220 60% 30%)'
  }
];

// Demo Departments
export const mockDepartments: Department[] = [
  // Metro General Hospital
  { id: 'dept-or', enterpriseId: 'ent-metro-general', name: 'Operating Room', description: 'Surgical services and perioperative care' },
  { id: 'dept-anesthesia', enterpriseId: 'ent-metro-general', name: 'Anesthesiology', description: 'Anesthesia and pain management' },
  { id: 'dept-icu', enterpriseId: 'ent-metro-general', name: 'Intensive Care Unit', description: 'Critical care services' },
  { id: 'dept-ed', enterpriseId: 'ent-metro-general', name: 'Emergency Department', description: 'Emergency medicine and trauma' },
  { id: 'dept-cardiology', enterpriseId: 'ent-metro-general', name: 'Cardiology', description: 'Cardiovascular medicine' },
  { id: 'dept-compliance', enterpriseId: 'ent-metro-general', name: 'Compliance & Risk', description: 'Risk management and regulatory compliance' },
  
  // Stanford Medical School
  { id: 'dept-clinical-ed', enterpriseId: 'ent-stanford-med', name: 'Clinical Education', description: 'Medical student training' },
  { id: 'dept-residency', enterpriseId: 'ent-stanford-med', name: 'Residency Programs', description: 'Graduate medical education' },
  { id: 'dept-research', enterpriseId: 'ent-stanford-med', name: 'Research', description: 'Clinical and basic research' },
  
  // VA Medical Center
  { id: 'dept-va-surgery', enterpriseId: 'ent-va-hospital', name: 'Surgical Services', description: 'Veteran surgical care' },
  { id: 'dept-va-medicine', enterpriseId: 'ent-va-hospital', name: 'Internal Medicine', description: 'General medicine services' }
];

// Demo Enterprise Users
export const mockEnterpriseUsers: EnterpriseUser[] = [
  // Metro General Hospital
  {
    id: 'user-admin-1',
    email: 'sarah.johnson@metrogeneral.org',
    name: 'Dr. Sarah Johnson',
    enterpriseId: 'ent-metro-general',
    departmentIds: ['dept-compliance'],
    role: 'admin',
    jobTitle: 'Chief Medical Officer',
    isActive: true,
    lastAccess: '2025-02-03T08:30:00Z'
  },
  {
    id: 'user-compliance-1',
    email: 'michael.chen@metrogeneral.org',
    name: 'Michael Chen, RN',
    enterpriseId: 'ent-metro-general',
    departmentIds: ['dept-compliance', 'dept-or'],
    role: 'compliance_officer',
    jobTitle: 'Compliance Manager',
    isActive: true,
    lastAccess: '2025-02-03T09:15:00Z'
  },
  {
    id: 'user-manager-1',
    email: 'lisa.williams@metrogeneral.org',
    name: 'Lisa Williams, BSN',
    enterpriseId: 'ent-metro-general',
    departmentIds: ['dept-or'],
    role: 'department_manager',
    jobTitle: 'OR Nurse Manager',
    isActive: true,
    lastAccess: '2025-02-02T16:45:00Z'
  },
  {
    id: 'user-staff-1',
    email: 'james.miller@metrogeneral.org',
    name: 'James Miller, RN',
    enterpriseId: 'ent-metro-general',
    departmentIds: ['dept-or'],
    role: 'staff',
    jobTitle: 'Perioperative Nurse',
    isActive: true,
    lastAccess: '2025-02-03T07:00:00Z'
  },
  {
    id: 'user-staff-2',
    email: 'emily.davis@metrogeneral.org',
    name: 'Emily Davis, CRNA',
    enterpriseId: 'ent-metro-general',
    departmentIds: ['dept-anesthesia'],
    role: 'staff',
    jobTitle: 'Nurse Anesthetist',
    isActive: true,
    lastAccess: '2025-02-03T06:30:00Z'
  },
  // Stanford Medical School
  {
    id: 'user-stanford-admin',
    email: 'robert.kim@stanford.edu',
    name: 'Dr. Robert Kim',
    enterpriseId: 'ent-stanford-med',
    departmentIds: ['dept-clinical-ed'],
    role: 'admin',
    jobTitle: 'Dean of Medical Education',
    isActive: true,
    lastAccess: '2025-02-02T14:00:00Z'
  }
];

// Compliance Collections (Curated Bundles)
export const mockComplianceCollections: ComplianceCollection[] = [
  {
    id: 'coll-periop',
    name: 'Perioperative Procedures',
    description: 'Essential protocols and guidelines for OR nursing staff covering surgical safety, sterile technique, and patient positioning',
    category: 'perioperative',
    icon: 'Scissors',
    bookIds: ['harrison-internal', 'periop-nursing'],
    isSystemBundle: true
  },
  {
    id: 'coll-anesthesia',
    name: 'Anesthesia Protocols',
    description: 'Comprehensive anesthesia guidelines including drug calculations, monitoring standards, and emergency procedures',
    category: 'anesthesia',
    icon: 'Syringe',
    bookIds: ['morgan-anesthesia', 'goldfrank-toxicology'],
    isSystemBundle: true
  },
  {
    id: 'coll-patient-safety',
    name: 'Patient Safety Standards',
    description: 'Critical patient safety protocols covering medication safety, fall prevention, and infection control',
    category: 'patient_safety',
    icon: 'ShieldCheck',
    bookIds: ['harrison-internal', 'acsm-guidelines', 'sabiston-surgery'],
    isSystemBundle: true
  },
  {
    id: 'coll-surgical',
    name: 'Surgical Services',
    description: 'Surgical techniques, pre/post-operative care, and complication management',
    category: 'surgical',
    icon: 'Stethoscope',
    bookIds: ['sabiston-surgery', 'braunwald-cardiology'],
    isSystemBundle: true
  },
  {
    id: 'coll-cardiac',
    name: 'Cardiac Care Protocols',
    description: 'Cardiovascular emergency management, ECG interpretation, and cardiac medication protocols',
    category: 'general',
    icon: 'Heart',
    bookIds: ['braunwald-cardiology', 'harrison-internal'],
    isSystemBundle: true
  },
  {
    id: 'coll-respiratory',
    name: 'Respiratory Care',
    description: 'Pulmonary protocols including ventilator management, airway procedures, and respiratory emergencies',
    category: 'general',
    icon: 'Wind',
    bookIds: ['fishman-pulmonary', 'harrison-internal'],
    isSystemBundle: true
  }
];

// Book Access by Enterprise
export const mockBookAccess: BookAccess[] = [
  // Metro General Hospital - Full access to most clinical books
  { id: 'ba-1', enterpriseId: 'ent-metro-general', bookId: 'harrison-internal', accessLevel: 'full', grantedAt: '2024-01-15T00:00:00Z' },
  { id: 'ba-2', enterpriseId: 'ent-metro-general', bookId: 'braunwald-cardiology', accessLevel: 'full', grantedAt: '2024-01-15T00:00:00Z' },
  { id: 'ba-3', enterpriseId: 'ent-metro-general', bookId: 'fishman-pulmonary', accessLevel: 'full', grantedAt: '2024-01-15T00:00:00Z' },
  { id: 'ba-4', enterpriseId: 'ent-metro-general', bookId: 'goldfrank-toxicology', accessLevel: 'full', grantedAt: '2024-01-15T00:00:00Z' },
  { id: 'ba-5', enterpriseId: 'ent-metro-general', bookId: 'sabiston-surgery', accessLevel: 'full', grantedAt: '2024-01-15T00:00:00Z' },
  { id: 'ba-6', enterpriseId: 'ent-metro-general', bookId: 'morgan-anesthesia', accessLevel: 'full', grantedAt: '2024-01-15T00:00:00Z' },
  
  // Stanford Medical School - Educational access
  { id: 'ba-7', enterpriseId: 'ent-stanford-med', bookId: 'harrison-internal', accessLevel: 'full', grantedAt: '2023-09-01T00:00:00Z' },
  { id: 'ba-8', enterpriseId: 'ent-stanford-med', bookId: 'braunwald-cardiology', accessLevel: 'full', grantedAt: '2023-09-01T00:00:00Z' },
  { id: 'ba-9', enterpriseId: 'ent-stanford-med', bookId: 'williams-endocrinology', accessLevel: 'full', grantedAt: '2023-09-01T00:00:00Z' },
  { id: 'ba-10', enterpriseId: 'ent-stanford-med', bookId: 'acsm-guidelines', accessLevel: 'full', grantedAt: '2023-09-01T00:00:00Z' },
  
  // VA Hospital - Government access
  { id: 'ba-11', enterpriseId: 'ent-va-hospital', bookId: 'harrison-internal', accessLevel: 'full', grantedAt: '2024-03-01T00:00:00Z' },
  { id: 'ba-12', enterpriseId: 'ent-va-hospital', bookId: 'sabiston-surgery', accessLevel: 'full', grantedAt: '2024-03-01T00:00:00Z' },
  { id: 'ba-13', enterpriseId: 'ent-va-hospital', bookId: 'goldfrank-toxicology', accessLevel: 'full', grantedAt: '2024-03-01T00:00:00Z' }
];

// Sample Audit Log Entries
export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-1',
    userId: 'user-staff-1',
    userName: 'James Miller, RN',
    enterpriseId: 'ent-metro-general',
    action: 'view_chapter',
    targetType: 'chapter',
    targetId: 'sabiston-ch12',
    targetTitle: 'Chapter 12: Surgical Hemostasis',
    timestamp: '2025-02-03T07:15:00Z',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'log-2',
    userId: 'user-staff-2',
    userName: 'Emily Davis, CRNA',
    enterpriseId: 'ent-metro-general',
    action: 'view_book',
    targetType: 'book',
    targetId: 'morgan-anesthesia',
    targetTitle: "Morgan & Mikhail's Clinical Anesthesiology",
    timestamp: '2025-02-03T06:45:00Z',
    ipAddress: '192.168.1.52'
  },
  {
    id: 'log-3',
    userId: 'user-compliance-1',
    userName: 'Michael Chen, RN',
    enterpriseId: 'ent-metro-general',
    action: 'access_collection',
    targetType: 'collection',
    targetId: 'coll-periop',
    targetTitle: 'Perioperative Procedures',
    timestamp: '2025-02-03T09:20:00Z',
    ipAddress: '192.168.1.10'
  },
  {
    id: 'log-4',
    userId: 'user-staff-1',
    userName: 'James Miller, RN',
    enterpriseId: 'ent-metro-general',
    action: 'search',
    targetType: 'search',
    metadata: { query: 'surgical site infection prevention', results: 12 },
    timestamp: '2025-02-03T07:30:00Z',
    ipAddress: '192.168.1.45'
  },
  {
    id: 'log-5',
    userId: 'user-manager-1',
    userName: 'Lisa Williams, BSN',
    enterpriseId: 'ent-metro-general',
    action: 'view_chapter',
    targetType: 'chapter',
    targetId: 'periop-ch8',
    targetTitle: 'Chapter 8: Patient Positioning',
    timestamp: '2025-02-02T16:50:00Z',
    ipAddress: '192.168.1.22'
  },
  {
    id: 'log-6',
    userId: 'user-admin-1',
    userName: 'Dr. Sarah Johnson',
    enterpriseId: 'ent-metro-general',
    action: 'login',
    timestamp: '2025-02-03T08:30:00Z',
    ipAddress: '192.168.1.5'
  }
];

// Usage Statistics for Dashboard
export interface UsageStats {
  totalViews: number;
  totalSearches: number;
  activeUsers: number;
  topBooks: { bookId: string; title: string; views: number }[];
  topSearches: { query: string; count: number }[];
  viewsByDepartment: { departmentId: string; departmentName: string; views: number }[];
  dailyActivity: { date: string; views: number; searches: number }[];
}

export const mockUsageStats: UsageStats = {
  totalViews: 15420,
  totalSearches: 8934,
  activeUsers: 187,
  topBooks: [
    { bookId: 'harrison-internal', title: "Harrison's Principles of Internal Medicine", views: 3245 },
    { bookId: 'sabiston-surgery', title: "Sabiston Textbook of Surgery", views: 2890 },
    { bookId: 'morgan-anesthesia', title: "Morgan & Mikhail's Clinical Anesthesiology", views: 2156 },
    { bookId: 'braunwald-cardiology', title: "Braunwald's Heart Disease", views: 1987 },
    { bookId: 'fishman-pulmonary', title: "Fishman's Pulmonary Diseases", views: 1654 }
  ],
  topSearches: [
    { query: 'surgical site infection', count: 234 },
    { query: 'malignant hyperthermia protocol', count: 189 },
    { query: 'blood transfusion guidelines', count: 156 },
    { query: 'airway management', count: 145 },
    { query: 'sepsis bundle', count: 132 }
  ],
  viewsByDepartment: [
    { departmentId: 'dept-or', departmentName: 'Operating Room', views: 4523 },
    { departmentId: 'dept-anesthesia', departmentName: 'Anesthesiology', views: 3890 },
    { departmentId: 'dept-icu', departmentName: 'Intensive Care Unit', views: 2987 },
    { departmentId: 'dept-ed', departmentName: 'Emergency Department', views: 2134 },
    { departmentId: 'dept-cardiology', departmentName: 'Cardiology', views: 1886 }
  ],
  dailyActivity: [
    { date: '2025-01-28', views: 1245, searches: 678 },
    { date: '2025-01-29', views: 1356, searches: 712 },
    { date: '2025-01-30', views: 1123, searches: 589 },
    { date: '2025-01-31', views: 1478, searches: 823 },
    { date: '2025-02-01', views: 1567, searches: 890 },
    { date: '2025-02-02', views: 1689, searches: 934 },
    { date: '2025-02-03', views: 1823, searches: 1012 }
  ]
};

// Compliance Status Indicators
export interface ComplianceStatus {
  category: string;
  status: 'compliant' | 'attention' | 'critical';
  completionRate: number;
  lastReviewDate: string;
  nextReviewDate: string;
}

export const mockComplianceStatus: ComplianceStatus[] = [
  {
    category: 'Perioperative Training',
    status: 'compliant',
    completionRate: 94,
    lastReviewDate: '2025-01-15',
    nextReviewDate: '2025-04-15'
  },
  {
    category: 'Anesthesia Protocols',
    status: 'compliant',
    completionRate: 89,
    lastReviewDate: '2025-01-20',
    nextReviewDate: '2025-04-20'
  },
  {
    category: 'Patient Safety Standards',
    status: 'attention',
    completionRate: 76,
    lastReviewDate: '2025-01-10',
    nextReviewDate: '2025-02-10'
  },
  {
    category: 'HIPAA Compliance',
    status: 'compliant',
    completionRate: 98,
    lastReviewDate: '2025-01-25',
    nextReviewDate: '2025-07-25'
  },
  {
    category: 'Medication Safety',
    status: 'critical',
    completionRate: 62,
    lastReviewDate: '2024-12-15',
    nextReviewDate: '2025-02-01'
  }
];
