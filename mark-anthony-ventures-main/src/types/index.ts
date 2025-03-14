
export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export type JobType = "full-time" | "part-time" | "internship" | "contract";
export type WorkLocation = "remote" | "in-office" | "hybrid";

export interface JobListing {
  id: string;
  userId: string;
  companyName: string;
  companyLogoUrl: string;
  position: string;
  monthlySalary: number;
  jobType: JobType;
  workLocation: WorkLocation;
  location: string;
  description: string;
  aboutCompany: string;
  skills: string[];
  additionalInfo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  jobId: string;
  createdAt: string;
}
