import type { User } from "@/types";

export const mockUsers: (User & { password: string })[] = [
  {
    id: "u-admin",
    username: "admin",
    password: "admin123",
    name: "Dr. Ayesha Khan",
    email: "admin@imd.edu",
    role: "admin",
    department: "Administration",
    createdAt: "2024-01-01",
    active: true,
  },
  {
    id: "u-incharge",
    username: "incharge",
    password: "incharge123",
    name: "Bilal Ahmed",
    email: "incharge@imd.edu",
    role: "incharge",
    department: "Library Services",
    createdAt: "2024-02-15",
    active: true,
  },
  {
    id: "u-student",
    username: "student",
    password: "student123",
    name: "Sara Ali",
    email: "student@imd.edu",
    role: "student",
    department: "Computer Science",
    createdAt: "2024-09-01",
    active: true,
  },
];
