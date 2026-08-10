interface User {
  id: string;
  name: string;
  email: string;
}

interface BaseResume {
  id: string;
  userId: string;
  content: string;
  fileName: string;
  origianlFileUrl: string;
  createdAt: string;
}

interface Application {
  id?: string;
  userId?: string;
  baseResumeId?: string;
  companyName: string;
  roleTitle: string;
  location: string;
  jobUrl?: string;
  jobDescription: string;
  applicationChannel?: string;
  applicationStatus: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface EditSuggestion {
  id: string;
  applicationId: string;
  section: string;
  beforeText: string;
  afterText: string;
  reason: string;
  editType: string;
  orderIndex: number;
}

type ApplicationStatus =
  | 'APPLIED'
  | 'HEARD_BACK'
  | 'REJECTED'
  | 'GHOSTED'
  | 'PROCESSING'
  | 'DRAFT';

export type {
  User,
  BaseResume,
  Application,
  EditSuggestion,
  ApplicationStatus,
};
