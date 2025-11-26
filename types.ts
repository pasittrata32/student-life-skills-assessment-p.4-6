
export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  classLevel: string; // e.g., "ป.4/1"
  number: string;
  isAssessed: boolean;
  score?: number;
  percentage?: number;
  evaluationLevel?: string; // ดีเยี่ยม, ดี, พอใช้, ปรับปรุง
  assessmentDate?: string;
  rawScores?: Record<number, number>; // questionId -> score
  strengths?: string;
  improvements?: string;
  teacherName?: string;
}

export interface Teacher {
  id: string;
  name: string;
  username: string;
  password?: string;
  classLevel: string;
}

export interface Question {
  id: number;
  text: string;
}

export interface AssessmentCategory {
  id: number;
  title: string;
  questions: Question[];
}

export interface SchoolInfo {
  name: string;
  district: string;
  province: string;
}

export enum ViewState {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  ASSESSMENT = 'ASSESSMENT',
}
