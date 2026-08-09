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
  userId: string;
  baseResumeId: string;
  companyName: string;
  roleTitle: string;
  location: string;
  jobUrl: string;
  jobDescription: string;
  applicationChannel: string;
  applicationStatus: string;
  notes: string;
}

export type { User, BaseResume, Application };
