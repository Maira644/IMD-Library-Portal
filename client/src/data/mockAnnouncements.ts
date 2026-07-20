import type { Announcement } from "@/types";

export const mockAnnouncements: Announcement[] = [
  {
    id: "a1",
    title: "Library Extended Hours during Finals",
    body: "The library will remain open until 11 PM from Dec 10 to Dec 22 to support students during final examinations.",
    pinned: true,
    createdBy: "Dr. Ayesha Khan",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
  },
  {
    id: "a2",
    title: "New Arrivals: 40+ Titles in Computer Science",
    body: "Explore the latest additions across AI, systems, and theory — now available in the digital catalog.",
    pinned: false,
    createdBy: "Bilal Ahmed",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: "a3",
    title: "Thesis Submission Deadline Reminder",
    body: "All graduating students must submit their final thesis PDFs to the library portal by the end of this month.",
    pinned: true,
    createdBy: "Dr. Ayesha Khan",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: "a4",
    title: "Workshop: Research & Citation Tools",
    body: "Join a hands-on workshop on Zotero and Mendeley next Friday at the Main Library Hall.",
    pinned: false,
    createdBy: "Bilal Ahmed",
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
];
