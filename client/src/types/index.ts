export type Role = "admin" | "incharge" | "student";

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  department?: string;
  createdAt: string;
  active: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher?: string;
  edition?: string;
  publicationYear?: number;
  category?: string;
  cabinetNo?: string;
  shelfNo?: string;
  keywords: string[];
  coverUrl?: string;
  pdfUrl?: string;
  physicalCopy: boolean;
  digitalCopy: boolean;
  uploadedBy: string;
  uploadDate: string;
  views: number;
}

export interface Thesis {
  id: string;
  title: string;
  studentNames: string[];
  supervisor: string;
  department: string;
  submissionYear: number;
  category: string;
  abstract: string;
  cabinetNo: string;
  shelfNo: string;
  keywords: string[];
  coverUrl?: string;
  pdfUrl?: string;
  uploadedBy: string;
  uploadDate: string;
  views: number;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  imageUrl?: string;
  pinned: boolean;
  expiresAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;

  count: number;

  bookCount: number;
  thesisCount: number;

  createdAt: string;
}

export interface SearchLog {
  keyword: string;
  timestamp: string;
}