// src/types.ts

export interface Task {
  id: string;
  title: string;
  type: 'assignment' | 'exam' | 'project' | 'quiz' | 'presentation';
  dueDate: string;
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
  description: string;
  type: "PDF" | "Video" | "Image" | "Link";
  
  // File upload (from students)
  fileUrl?: string;
  fileName?: string;
  
  // Direct URL (mainly from admin)
  url?: string;

  fileSize?: string;
  subject: string;                    // ← Important: use subject, not module
  
  uploadedBy: string;
  uploadedById?: string;
  
  downloads: number;
  status: "pending" | "approved" | "rejected";
  
  tags: string[];
  
  // Target Audience fields
  targetAudience: "All Students" | "By Faculty" | "By Semester" | "By Year";
  targetFaculty?: string;
  targetSemester?: string;
  targetYear?: string;

  createdAt: string;
  updatedAt: string;
}