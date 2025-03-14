
import { useJobs } from "@/context/job-context";
import MainLayout from "@/components/layouts/MainLayout";
import JobCard from "@/components/JobCard";
import JobFilter from "@/components/JobFilter";
import JobSorter from "@/components/JobSorter";
import JobPagination from "@/components/JobPagination";
import { Button } from "@/components/ui/button";
import { Briefcase, Search } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { filteredJobs, isLoading, page, pageSize } = useJobs();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Calculate jobs for current page
  const paginatedJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize);

  return (
    <MainLayout>
      <section className="bg-gradient-to-r from-brand-blue to-brand-cyan py-16 text-white">
        <div className="container px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">
              Find Your Dream Job Today
            </h1>
            <p className="text-xl mb-6">
              Discover thousands of job opportunities with all the information you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-brand-blue hover:bg-gray-100"
                onClick={() => navigate('/jobs')}
              >
                <Search className="mr-2 h-5 w-5" />
                Search Jobs
              </Button>
              {user && (
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent text-white border-white hover:bg-white/10"
                  onClick={() => navigate('/jobs/new')}
                >
                  <Briefcase className="mr-2 h-5 w-5" />
                  Post a Job
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container px-4 sm:px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Job Listings</h2>
          
          <div className="max-w-4xl mx-auto">
            <JobFilter />
            
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">{filteredJobs.length} jobs found</p>
              <JobSorter />
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
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
                <p className="text-gray-500 mb-6">
                  Try adjusting your search filters or check back later for new opportunities.
                </p>
                <Button onClick={() => navigate('/jobs')}>View All Jobs</Button>
              </div>
            )}
            
            <JobPagination />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
