
import { useParams, useNavigate } from "react-router-dom";
import { useJobs } from "@/context/job-context";
import { useAuth } from "@/context/auth-context";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  MapPin,
  Clock,
  Calendar,
  BookmarkPlus,
  BookmarkCheck,
  Edit,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getJobById, isBookmarked, toggleBookmark, deleteJob } = useJobs();
  const { user } = useAuth();

  const job = getJobById(id || "");
  const bookmarked = job ? isBookmarked(job.id) : false;
  const isOwner = user && job && user.id === job.userId;

  if (!job) {
    return (
      <MainLayout>
        <div className="container px-4 sm:px-6 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Job Not Found</h1>
          <p className="mb-8">
            The job listing you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/jobs")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Jobs
          </Button>
        </div>
      </MainLayout>
    );
  }

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "full-time":
        return "bg-blue-100 text-blue-800";
      case "part-time":
        return "bg-green-100 text-green-800";
      case "internship":
        return "bg-purple-100 text-purple-800";
      case "contract":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLocationTypeColor = (type: string) => {
    switch (type) {
      case "remote":
        return "bg-teal-100 text-teal-800";
      case "in-office":
        return "bg-pink-100 text-pink-800";
      case "hybrid":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleBookmarkToggle = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    await toggleBookmark(job.id);
  };

  const handleDelete = async () => {
    await deleteJob(job.id);
    navigate("/dashboard");
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 py-8">
        <div className="container px-4 sm:px-6">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 sm:p-8 border-b">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex gap-4 items-start">
                  <div className="h-16 w-16 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center shrink-0">
                    {job.companyLogoUrl ? (
                      <img
                        src={job.companyLogoUrl}
                        alt={job.companyName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Building className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{job.position}</h1>
                    <p className="text-lg text-gray-600">{job.companyName}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className={getJobTypeColor(job.jobType)}
                      >
                        {job.jobType.replace("-", " ")}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={getLocationTypeColor(job.workLocation)}
                      >
                        {job.workLocation.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  {isOwner ? (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/jobs/edit/${job.id}`)}
                      >
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently
                              delete this job listing.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                              className="bg-destructive text-destructive-foreground"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ) : (
                    <Button
                      variant={bookmarked ? "outline" : "default"}
                      onClick={handleBookmarkToggle}
                      className={bookmarked ? "border-primary" : ""}
                    >
                      {bookmarked ? (
                        <>
                          <BookmarkCheck className="mr-2 h-4 w-4 text-primary" />
                          Bookmarked
                        </>
                      ) : (
                        <>
                          <BookmarkPlus className="mr-2 h-4 w-4" />
                          Bookmark
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{formatSalary(job.monthlySalary)}/month</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                  <span>
                    Posted{" "}
                    {formatDistanceToNow(new Date(job.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <section>
                  <h2 className="text-xl font-semibold mb-4">Job Description</h2>
                  <div
                    className="job-description prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                </section>

                <section>
                  <h2 className="text-xl font-semibold mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm py-1"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </section>

                {job.additionalInfo && (
                  <section>
                    <h2 className="text-xl font-semibold mb-4">
                      Additional Information
                    </h2>
                    <p className="text-gray-600">{job.additionalInfo}</p>
                  </section>
                )}
              </div>

              <div className="space-y-6">
                <section className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">About the Company</h2>
                  <p className="text-gray-600 mb-4">{job.aboutCompany}</p>
                </section>

                <section className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4">Job Details</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Job Type</span>
                      <span className="font-medium capitalize">
                        {job.jobType.replace("-", " ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Work Location</span>
                      <span className="font-medium capitalize">
                        {job.workLocation.replace("-", " ")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Posted On</span>
                      <span className="font-medium">
                        {format(new Date(job.createdAt), "MMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobDetail;
