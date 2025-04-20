
export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type Status = 'todo' | 'in-progress' | 'done';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  projectId: string;
  dueDate?: Date;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  color: string;
}
