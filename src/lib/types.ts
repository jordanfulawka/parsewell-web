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

export type { User, BaseResume };
