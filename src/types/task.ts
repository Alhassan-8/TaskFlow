import { Priority, Status } from "./enums";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  projectId: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  // New fields for advanced features
  subtasks: Subtask[];
  dependencies: string[]; // IDs of tasks this task depends on
  assignedTo: string[]; // User IDs
  attachments: Attachment[];
  comments: Comment[];
  timeSpent: number; // in minutes
  estimatedTime: number; // in minutes
  recurrence: RecurrencePattern | null;
  templateId: string | null;
  archived: boolean;
  category: string;
  labels: string[];
  progress: number; // 0-100
  lastActivity: string;
  version: number;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  replies: Comment[];
}

export interface RecurrencePattern {
  type: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  daysOfWeek?: number[]; // For weekly recurrence
  dayOfMonth?: number; // For monthly recurrence
  month?: number; // For yearly recurrence
  endDate?: string;
  occurrences?: number;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  defaultPriority: Priority;
  defaultTags: string[];
  defaultCategory: string;
  defaultLabels: string[];
  defaultEstimatedTime: number;
  defaultSubtasks: Omit<Subtask, "id" | "createdAt" | "updatedAt">[];
  createdAt: string;
  updatedAt: string;
}
