interface User {
  id: string;
  name: string;
  email: string;
}

interface BaseResume {
  id: string;
  userId: string;
  content: string;
  origianlFileUrl: string;
  createdAt: string;
  updatedAt: string;
}

export type { User, BaseResume };
