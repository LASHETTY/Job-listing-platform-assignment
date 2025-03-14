
import { useJobs } from "@/context/job-context";
import MainLayout from "@/components/layouts/MainLayout";
import JobCard from "@/components/JobCard";
import JobFilter from "@/components/JobFilter";
import JobSorter from "@/components/JobSorter";
import JobPagination from "@/components/JobPagination";
import { Briefcase } from "lucide-react";

const JobsList = () => {
  const { filteredJobs, isLoading, page, pageSize } = useJobs();
  
  // Calculate jobs for current page
  const paginatedJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize);

  return (
    <MainLayout>
      <div className="container px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">All Jobs</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-4">
            <JobFilter />
            
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">{filteredJobs.length} jobs found</p>
              <JobSorter />
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </div>
                ))}
              </div>
            ) : paginatedJobs.length > 0 ? (
              <div className="space-y-4">
                {paginatedJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium mb-2">No jobs found</h3>
                <p className="text-gray-500">
                  Try adjusting your search filters or check back later for new opportunities.
                </p>
              </div>
            )}
            
            <JobPagination />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobsList;
