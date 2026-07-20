import type { User } from "@/types";

export const mockIncharges: User[] = [
  { id: "in1", username: "bilal", name: "Bilal Ahmed", email: "bilal@imd.edu", role: "incharge", department: "Main Library", createdAt: "2024-02-15", active: true },
  { id: "in2", username: "hina", name: "Hina Malik", email: "hina@imd.edu", role: "incharge", department: "Science Wing", createdAt: "2024-03-01", active: true },
  { id: "in3", username: "usman", name: "Usman Tariq", email: "usman@imd.edu", role: "incharge", department: "Humanities Wing", createdAt: "2024-03-14", active: false },
  { id: "in4", username: "nadia", name: "Nadia Rehman", email: "nadia@imd.edu", role: "incharge", department: "Digital Archives", createdAt: "2024-04-02", active: true },
  { id: "in5", username: "farhan", name: "Farhan Iqbal", email: "farhan@imd.edu", role: "incharge", department: "Reference Section", createdAt: "2024-05-20", active: true },
];
