
import { JobListing } from "@/types";
import { BookmarkPlus, BookmarkCheck, MapPin, Building, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useJobs } from "@/context/job-context";
import { useAuth } from "@/context/auth-context";
import { formatDistanceToNow } from "date-fns";

interface JobCardProps {
  job: JobListing;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const navigate = useNavigate();
  const { toggleBookmark, isBookmarked } = useJobs();
  const { user } = useAuth();
  
  const bookmarked = isBookmarked(job.id);

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    await toggleBookmark(job.id);
  };

  const getJobTypeColor = (type: string) => {
    switch(type) {
      case 'full-time': return 'bg-blue-100 text-blue-800';
      case 'part-time': return 'bg-green-100 text-green-800';
      case 'internship': return 'bg-purple-100 text-purple-800';
      case 'contract': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocationTypeColor = (type: string) => {
    switch(type) {
      case 'remote': return 'bg-teal-100 text-teal-800';
      case 'in-office': return 'bg-pink-100 text-pink-800';
      case 'hybrid': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 cursor-pointer"
      onClick={() => navigate(`/jobs/${job.id}`)}
    >
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className="hidden sm:block">
            <div className="h-12 w-12 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
              {job.companyLogoUrl ? (
                <img src={job.companyLogoUrl} alt={job.companyName} className="h-full w-full object-cover" />
              ) : (
                <Building className="h-6 w-6 text-gray-400" />
              )}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{job.position}</h3>
            <p className="text-gray-600">{job.companyName}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={handleBookmarkToggle}
          className="h-8 w-8"
        >
          {bookmarked ? (
            <BookmarkCheck className="h-5 w-5 text-primary" />
          ) : (
            <BookmarkPlus className="h-5 w-5" />
          )}
        </Button>
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <Badge variant="outline" className={getJobTypeColor(job.jobType)}>
          {job.jobType.replace('-', ' ')}
        </Badge>
        <Badge variant="outline" className={getLocationTypeColor(job.workLocation)}>
          {job.workLocation.replace('-', ' ')}
        </Badge>
        {job.monthlySalary && (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            {formatSalary(job.monthlySalary)}/month
          </Badge>
        )}
      </div>
      
      <div className="mt-4 flex flex-wrap items-center text-sm text-gray-500 gap-4">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex flex-wrap gap-1">
          {job.skills.slice(0, 5).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 5 && (
            <Badge variant="secondary" className="text-xs">
              +{job.skills.length - 5} more
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
