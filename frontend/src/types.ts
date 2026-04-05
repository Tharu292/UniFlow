// src/types.ts

export interface Task {
  id: string;
  title: string;
  type: 'assignment' | 'exam' | 'project' | 'quiz' | 'presentation';
  dueDate: string;           // ISO string (e.g. "2026-03-10T14:30:00")
  priority: 'low' | 'medium' | 'high';
  description: string;
  resourceLink?: string;
  module?: string;
  semester?: string;
  completed: boolean;
}

export interface Resource {
  _id: string;
  title: string;
  fileName: string;
  fileUrl:string;
  module?: string;
  semester?: string;
  year?: string;
  tags: string[];
  description?: string;
  createdBy?: string; 
}