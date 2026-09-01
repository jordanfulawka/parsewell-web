interface User {
  id: string;
  name: string;
  email: string;
  exp: string;
}

interface BaseResume {
  id: string;
  userId: string;
  content: string;
  fileName: string;
  originalFileUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface Application {
  id?: string;
  userId?: string;
  baseResumeId?: string;
  companyName: string;
  roleTitle: string;
  location: string;
  jobURL?: string;
  jobDescription: string;
  applicationChannel?: string;
  applicationStatus?: string;
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

interface ReturnedCoverLetter {
  content: string;
}

type ApplicationStatus =
  | 'APPLIED'
  | 'HEARD_BACK'
  | 'REJECTED'
  | 'GHOSTED'
  | 'PROCESSING'
  | 'DRAFT'
  | 'SUMMARY';

export type {
  User,
  BaseResume,
  Application,
  EditSuggestion,
  ApplicationStatus,
  ReturnedCoverLetter,
};
