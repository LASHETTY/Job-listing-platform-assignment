
import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { JobListing, Bookmark, JobType, WorkLocation } from "@/types";
import { mockJobListings, mockBookmarks } from "@/data/mockData";
import { useAuth } from "./auth-context";
import { toast } from "sonner";

interface JobContextType {
  jobs: JobListing[];
  filteredJobs: JobListing[];
  bookmarks: Bookmark[];
  isLoading: boolean;
  searchQuery: string;
  filters: {
    jobType: JobType[];
    workLocation: WorkLocation[];
    salaryMin?: number;
    salaryMax?: number;
    location: string;
  };
  sortOption: string;
  page: number;
  pageSize: number;
  totalPages: number;
  
  // Methods
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<JobContextType["filters"]>) => void;
  setSortOption: (sort: string) => void;
  setPage: (page: number) => void;
  createJob: (job: Omit<JobListing, "id" | "userId" | "createdAt" | "updatedAt">) => Promise<JobListing>;
  updateJob: (id: string, job: Partial<JobListing>) => Promise<JobListing>;
  deleteJob: (id: string) => Promise<void>;
  getJobById: (id: string) => JobListing | undefined;
  getUserJobs: () => JobListing[];
  toggleBookmark: (jobId: string) => Promise<void>;
  isBookmarked: (jobId: string) => boolean;
  getUserBookmarks: () => JobListing[];
}

const JobContext = createContext<JobContextType | null>(null);

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
};

export const JobProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobListing[]>([...mockJobListings]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([...mockBookmarks]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Search, filter and pagination state
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFiltersState] = useState<JobContextType["filters"]>({
    jobType: [],
    workLocation: [],
    location: "",
  });
  const [sortOption, setSortOption] = useState("newest");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Filtered and sorted jobs
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>([...jobs]);
  const [totalPages, setTotalPages] = useState(Math.ceil(jobs.length / pageSize));

  // Apply filters, search, and sorting
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      let result = [...jobs];
      
      // Apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(job => 
          job.position.toLowerCase().includes(query) ||
          job.companyName.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.skills.some(skill => skill.toLowerCase().includes(query))
        );
      }
      
      // Apply filters
      if (filters.jobType.length > 0) {
        result = result.filter(job => filters.jobType.includes(job.jobType));
      }
      
      if (filters.workLocation.length > 0) {
        result = result.filter(job => filters.workLocation.includes(job.workLocation));
      }
      
      if (filters.location) {
        result = result.filter(job => 
          job.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }
      
      if (filters.salaryMin !== undefined) {
        result = result.filter(job => job.monthlySalary >= (filters.salaryMin || 0));
      }
      
      if (filters.salaryMax !== undefined) {
        result = result.filter(job => job.monthlySalary <= (filters.salaryMax || Infinity));
      }
      
      // Apply sorting
      result = [...result].sort((a, b) => {
        switch (sortOption) {
          case "newest":
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case "oldest":
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case "salary-high":
            return b.monthlySalary - a.monthlySalary;
          case "salary-low":
            return a.monthlySalary - b.monthlySalary;
          default:
            return 0;
        }
      });
      
      setFilteredJobs(result);
      setTotalPages(Math.ceil(result.length / pageSize));
      setIsLoading(false);
    }, 500); // Simulate network delay
    
    return () => clearTimeout(timer);
  }, [jobs, searchQuery, filters, sortOption, pageSize]);

  const setFilters = (newFilters: Partial<JobContextType["filters"]>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  // Job CRUD operations
  const createJob = async (jobData: Omit<JobListing, "id" | "userId" | "createdAt" | "updatedAt">): Promise<JobListing> => {
    if (!user) throw new Error("You must be logged in to create a job");
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newJob: JobListing = {
        ...jobData,
        id: `job${jobs.length + 1}`,
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setJobs(prev => [newJob, ...prev]);
      toast.success("Job created successfully");
      return newJob;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create job");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateJob = async (id: string, jobData: Partial<JobListing>): Promise<JobListing> => {
    if (!user) throw new Error("You must be logged in to update a job");
    
    const jobToUpdate = jobs.find(job => job.id === id);
    if (!jobToUpdate) throw new Error("Job not found");
    
    if (jobToUpdate.userId !== user.id && user.role !== "admin") {
      throw new Error("You can only update your own job listings");
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedJob: JobListing = {
        ...jobToUpdate,
        ...jobData,
        updatedAt: new Date().toISOString(),
      };
      
      setJobs(prev => prev.map(job => job.id === id ? updatedJob : job));
      toast.success("Job updated successfully");
      return updatedJob;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update job");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteJob = async (id: string): Promise<void> => {
    if (!user) throw new Error("You must be logged in to delete a job");
    
    const jobToDelete = jobs.find(job => job.id === id);
    if (!jobToDelete) throw new Error("Job not found");
    
    if (jobToDelete.userId !== user.id && user.role !== "admin") {
      throw new Error("You can only delete your own job listings");
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove job
      setJobs(prev => prev.filter(job => job.id !== id));
      
      // Remove any bookmarks for this job
      setBookmarks(prev => prev.filter(bookmark => bookmark.jobId !== id));
      
      toast.success("Job deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete job");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getJobById = (id: string): JobListing | undefined => {
    return jobs.find(job => job.id === id);
  };

  const getUserJobs = (): JobListing[] => {
    if (!user) return [];
    return jobs.filter(job => job.userId === user.id);
  };

  // Bookmark operations
  const toggleBookmark = async (jobId: string): Promise<void> => {
    if (!user) throw new Error("You must be logged in to bookmark a job");
    
    const existingBookmark = bookmarks.find(
      bookmark => bookmark.jobId === jobId && bookmark.userId === user.id
    );
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (existingBookmark) {
        // Remove bookmark
        setBookmarks(prev => prev.filter(bookmark => bookmark.id !== existingBookmark.id));
        toast.success("Bookmark removed");
      } else {
        // Add bookmark
        const newBookmark: Bookmark = {
          id: `bookmark${bookmarks.length + 1}`,
          userId: user.id,
          jobId,
          createdAt: new Date().toISOString(),
        };
        setBookmarks(prev => [...prev, newBookmark]);
        toast.success("Job bookmarked");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update bookmark");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isBookmarked = (jobId: string): boolean => {
    if (!user) return false;
    return bookmarks.some(bookmark => bookmark.jobId === jobId && bookmark.userId === user.id);
  };

  const getUserBookmarks = (): JobListing[] => {
    if (!user) return [];
    
    const userBookmarkIds = bookmarks
      .filter(bookmark => bookmark.userId === user.id)
      .map(bookmark => bookmark.jobId);
    
    return jobs.filter(job => userBookmarkIds.includes(job.id));
  };

  return (
    <JobContext.Provider value={{
      jobs,
      filteredJobs,
      bookmarks,
      isLoading,
      searchQuery,
      filters,
      sortOption,
      page,
      pageSize,
      totalPages,
      setSearchQuery,
      setFilters,
      setSortOption,
      setPage,
      createJob,
      updateJob,
      deleteJob,
      getJobById,
      getUserJobs,
      toggleBookmark,
      isBookmarked,
      getUserBookmarks,
    }}>
      {children}
    </JobContext.Provider>
  );
};
