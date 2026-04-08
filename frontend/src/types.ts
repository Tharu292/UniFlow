// src/types.ts

// Existing interfaces (unchanged)
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

// ======================
// NEW FORUM & GAMIFICATION TYPES
// ======================

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  name?: string;                    // Virtual full name (firstName + lastName)
  email: string;
  role: "student" | "admin";
  
  // Profile fields
  contactNumber?: string;
  address?: string;
  faculty?: string;
  semester?: string;
  year?: string;
  
  // Gamification fields
  points: number;
  rank: string;
  badges: string[];
  
  // Optional timestamps
  firstLogin?: string | Date;
  lastLogin?: string | Date;
  
  // For backward compatibility with old code
  verified?: boolean;
  status?: string;
}

export interface Question {
  _id: string;
  title: string;
  description: string;
  user: User | string;              // Can be populated User or just ID
  createdAt: string;
  updatedAt: string;
}

export interface Answer {
  _id: string;
  content: string;
  votes: number;
  question: string;
  user: User;              // Populated user with rank, name, etc.
  voters: string[];                 // Array of user IDs who voted
  createdAt: string;
  updatedAt: string;
}

// Leaderboard specific (simplified)
export interface LeaderboardUser {
  _id: string;
  name: string;
  rank: string;
  points: number;
  badges: string[];
}

// Optional: Forum stats for future use
export interface ForumStats {
  totalQuestions: number;
  totalAnswers: number;
  totalUsers: number;
}