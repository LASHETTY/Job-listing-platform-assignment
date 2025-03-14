
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { useJobs } from "@/context/job-context";
import MainLayout from "@/components/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Edit2, Trash2, Clock, MapPin, BadgeCheck, BookmarkPlus } from "lucide-react";
import { JobListing, JobType, WorkLocation } from "@/types";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const { user } = useAuth();
  const { getUserJobs, getUserBookmarks, deleteJob } = useJobs();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Get user's job listings and bookmarks
  const userJobs = getUserJobs();
  const userBookmarks = getUserBookmarks();

  const handleDelete = async (id: string) => {
    try {
      setIsDeleting(id);
      await deleteJob(id);
    } catch (error) {
      console.error(error);
      // The toast is already handled in the job context
    } finally {
      setIsDeleting(null);
    }
  };

  // Function to render job type badge
  const renderJobTypeBadge = (jobType: JobType) => {
    let color;
    switch (jobType) {
      case "full-time":
        color = "bg-blue-100 text-blue-800";
        break;
      case "part-time":
        color = "bg-purple-100 text-purple-800";
        break;
      case "contract":
        color = "bg-amber-100 text-amber-800";
        break;
      case "internship":
        color = "bg-green-100 text-green-800";
        break;
      default:
        color = "bg-gray-100 text-gray-800";
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{jobType.replace("-", " ")}</span>;
  };

  // Function to render work location badge
  const renderWorkLocationBadge = (workLocation: WorkLocation) => {
    let color;
    switch (workLocation) {
      case "remote":
        color = "bg-emerald-100 text-emerald-800";
        break;
      case "in-office":
        color = "bg-indigo-100 text-indigo-800";
        break;
      case "hybrid":
        color = "bg-teal-100 text-teal-800";
        break;
      default:
        color = "bg-gray-100 text-gray-800";
    }
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{workLocation.replace("-", " ")}</span>;
  };

  // Function to render job card
  const renderJobCard = (job: JobListing, isPosted: boolean) => (
    <Card key={job.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            {job.companyLogoUrl ? (
              <img 
                src={job.companyLogoUrl} 
                alt={job.companyName} 
                className="h-10 w-10 object-contain rounded-md"
              />
            ) : (
              <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                {job.companyName.charAt(0)}
              </div>
            )}
            <div>
              <CardTitle className="text-lg">{job.position}</CardTitle>
              <CardDescription className="text-sm">{job.companyName}</CardDescription>
            </div>
          </div>
          {isPosted && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate(`/jobs/edit/${job.id}`)}
              >
                <Edit2 className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => handleDelete(job.id)}
                disabled={isDeleting === job.id}
              >
                {isDeleting === job.id ? (
                  <span className="animate-spin mr-1">⟳</span>
                ) : (
                  <Trash2 className="h-4 w-4 mr-1" />
                )}
                Delete
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="py-2">
        <div className="flex flex-wrap gap-2 mb-2">
          <div className="flex items-center text-sm text-gray-600">
            <BadgeCheck className="h-4 w-4 mr-1" />
            ${job.monthlySalary.toLocaleString()}/month
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            {job.location}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {renderJobTypeBadge(job.jobType)}
          {renderWorkLocationBadge(job.workLocation)}
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {job.skills.slice(0, 5).map((skill, index) => (
            <span 
              key={index} 
              className="px-2 py-1 text-xs bg-gray-100 rounded-full"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="px-2 py-1 text-xs bg-gray-100 rounded-full">
              +{job.skills.length - 5} more
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={() => navigate(`/jobs/${job.id}`)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );

  return (
    <MainLayout>
      <div className="container px-4 sm:px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={() => navigate('/jobs/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        </div>

        <Tabs defaultValue="myJobs">
          <TabsList className="mb-6">
            <TabsTrigger value="myJobs">My Posted Jobs</TabsTrigger>
            <TabsTrigger value="savedJobs">Saved Jobs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="myJobs">
            {userJobs.length > 0 ? (
              <div>
                {userJobs.map(job => renderJobCard(job, true))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-2">No jobs posted yet</h3>
                <p className="text-gray-500 mb-4">Start by posting your first job listing</p>
                <Button onClick={() => navigate('/jobs/new')}>
                  <Plus className="mr-2 h-4 w-4" />
                  Post a Job
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="savedJobs">
            {userBookmarks.length > 0 ? (
              <div>
                {userBookmarks.map(job => renderJobCard(job, false))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-2">No saved jobs</h3>
                <p className="text-gray-500 mb-4">Browse jobs and bookmark the ones you're interested in</p>
                <Button variant="outline" onClick={() => navigate('/jobs')}>
                  <BookmarkPlus className="mr-2 h-4 w-4" />
                  Browse Jobs
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
