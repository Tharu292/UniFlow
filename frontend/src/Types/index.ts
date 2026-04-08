export interface User {
  _id: string;
  firstName?: string;
  lastName?: string;
  name: string;           // virtual from backend
  rank?: string;
  points?: number;
  badges?: string[];
}

export interface Question {
  _id: string;
  title: string;
  description: string;
  user: User;
}

export interface Answer {
  _id: string;
  content: string;
  votes: number;
  user: User;
}