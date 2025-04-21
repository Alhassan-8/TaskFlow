export type Priority = "low" | "medium" | "high" | "urgent";
export type Status = "todo" | "in-progress" | "done";
export type ViewType = "list" | "board" | "calendar";

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  projectId: string;
  dueDate?: Date;
  createdAt: Date;
  parentId?: string;
  prerequisites?: string[];
  estimatedTime?: number;
  timeSpent?: number;
  checklist?: Task[];
  tags?: string[]; // Array of tag IDs
}

export interface Project {
  id: string;
  name: string;
  color: string;
  tags?: Tag[]; // Project-specific tags
}

export interface Template {
  id: string;
  name: string;
  title: string;
  description: string;
  priority: Priority;
  projectId: string;
  tags?: string[];
}
