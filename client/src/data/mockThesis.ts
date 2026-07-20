import type { Thesis } from "@/types";

const rows = [
  ["Efficient Graph Neural Networks for Recommendation", "Ali Raza", "Dr. Ayesha Khan", "Computer Science"],
  ["Blockchain-based Secure Voting", "Hina Malik", "Dr. Usman Tariq", "Computer Science"],
  ["CFD Analysis of Wind Turbine Blades", "Ahmed Nasir", "Dr. Zainab Siddiqui", "Engineering"],
  ["Optimal Control of Distributed Systems", "Sara Ali", "Dr. Farhan Iqbal", "Mathematics"],
  ["Novel Catalysts for Green Chemistry", "Bilal Ahmed", "Dr. Nadia Rehman", "Physics"],
  ["Consumer Behavior in Emerging Markets", "Zara Sheikh", "Dr. Kamran Butt", "Business"],
  ["Postcolonial Themes in Modern Fiction", "Fatima Noor", "Dr. Imran Yousaf", "Literature"],
  ["Genomic Variation in South Asian Populations", "Umar Farooq", "Dr. Rabia Aslam", "Biology"],
  ["Reinforcement Learning for Autonomous Drones", "Hamza Sheikh", "Dr. Ayesha Khan", "Computer Science"],
  ["Structural Health Monitoring Using IoT", "Mahnoor Khan", "Dr. Zainab Siddiqui", "Engineering"],
  ["Historical Narratives of the Indus Valley", "Ayesha Tariq", "Dr. Imran Yousaf", "History"],
  ["Numerical Methods for PDEs", "Danish Ali", "Dr. Farhan Iqbal", "Mathematics"],
];

export const mockThesis: Thesis[] = rows.map((r, i) => ({
  id: `TH-${String(2001 + i).padStart(4, "0")}`,
  title: r[0],
  studentNames: [r[1]],
  supervisor: r[2],
  department: r[3],
  submissionYear: 2020 + (i % 6),
  category: r[3],
  abstract: `${r[0]} presents a novel investigation in the field of ${r[3]}. The work introduces methods, experiments and empirical results contributing to the body of research.`,
  keywords: [r[3].toLowerCase(), "research", "graduate", "thesis", "study"],
  coverUrl: `https://picsum.photos/seed/thesis${i}/400/560`,
  pdfUrl: i % 4 === 0 ? undefined : `https://example.com/thesis-${i}.pdf`,
  uploadedBy: "Bilal Ahmed",
  uploadDate: new Date(Date.now() - i * 86400000 * 5).toISOString(),
  views: 25 + ((i * 29) % 300),
}));
