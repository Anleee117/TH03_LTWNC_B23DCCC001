export type UserRole = 'admin' | 'user';

export type Role = 'guest' | 'user' | 'admin';

export type Action = 'view' | 'mark_complete' | 'create' | 'delete';

export interface Subject {
  slug: string;
  code: string;
  name: string;
  description: string;
  teacher: string;
  credits: number;
}

export interface Deadline {
  id: string;
  title: string;
  description: string;
  subjectSlug: string;
  subjectCode: string;
  subjectName: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  type: string;
}

export interface UserAccount {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: UserRole;
}
