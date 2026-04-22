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

  fileUrl?: string;
  fileName?: string;

  url?: string;

  fileSize?: string;
  subject: string;

  uploadedBy: string;
  uploadedById?: string;

  downloads: number;
  status: "pending" | "approved" | "rejected";

  tags: string[];

  targetAudience: "All Students" | "By Faculty" | "By Semester" | "By Year";
  targetFaculty?: string;
  targetSemester?: string;
  targetYear?: string;

  createdAt: string;
  updatedAt: string;
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  role: "student" | "admin";

  contactNumber?: string;
  address?: string;
  faculty?: string;
  semester?: string;
  year?: string;

  points: number;
  rank: string;
  badges: string[];

  firstLogin?: string | Date;
  lastLogin?: string | Date;

  verified?: boolean;
  status?: string;
}

export interface Question {
  _id: string;
  title: string;
  description: string;
  user: User | string;
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  _id: string;
  content: string;
  votes: number;
  question: string;
  user: User;
  voters: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LeaderboardUser {
  _id: string;
  name: string;
  rank: string;
  points: number;
  badges: string[];
}

export interface ForumStats {
  totalQuestions: number;
  totalAnswers: number;
  totalUsers: number;
}