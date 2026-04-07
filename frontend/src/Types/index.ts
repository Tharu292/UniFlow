export interface User {
  _id: string;
  name: string;
  rank?: string;
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