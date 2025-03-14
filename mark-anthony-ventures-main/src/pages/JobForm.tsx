
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useJobs } from "@/context/job-context";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { JobType, WorkLocation } from "@/types";

const JobForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { createJob, updateJob, getJobById } = useJobs();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    companyName: "",
    companyLogoUrl: "",
    position: "",
    monthlySalary: "",
    jobType: "" as JobType,
    workLocation: "" as WorkLocation,
    location: "",
    description: "",
    aboutCompany: "",
    skills: "",
    additionalInfo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const job = getJobById(id);
      if (job) {
        setFormData({
          companyName: job.companyName,
          companyLogoUrl: job.companyLogoUrl,
          position: job.position,
          monthlySalary: job.monthlySalary.toString(),
          jobType: job.jobType,
          workLocation: job.workLocation,
          location: job.location,
          description: job.description,
          aboutCompany: job.aboutCompany,
          skills: job.skills.join(", "),
          additionalInfo: job.additionalInfo || "",
        });
      } else {
        toast.error("Job not found");
        navigate("/dashboard");
      }
    }
  }, [id, isEditing, getJobById, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Basic validation
      if (
        !formData.companyName ||
        !formData.position ||
        !formData.monthlySalary ||
        !formData.jobType ||
        !formData.workLocation ||
        !formData.location ||
        !formData.description ||
        !formData.aboutCompany ||
        !formData.skills
      ) {
        toast.error("Please fill in all required fields");
        return;
      }

      // Validate salary is a number
      const salary = parseFloat(formData.monthlySalary);
      if (isNaN(salary) || salary <= 0) {
        toast.error("Please enter a valid salary");
        return;
      }

      // Format skills as array
      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s);

      // Create job object
      const jobData = {
        companyName: formData.companyName,
        companyLogoUrl: formData.companyLogoUrl,
        position: formData.position,
        monthlySalary: salary,
        jobType: formData.jobType as JobType,
        workLocation: formData.workLocation as WorkLocation,
        location: formData.location,
        description: formData.description,
        aboutCompany: formData.aboutCompany,
        skills: skillsArray,
        additionalInfo: formData.additionalInfo,
      };

      if (isEditing) {
        await updateJob(id, jobData);
        toast.success("Job updated successfully");
        navigate(`/jobs/${id}`);
      } else {
        const newJob = await createJob(jobData);
        toast.success("Job created successfully");
        navigate(`/jobs/${newJob.id}`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container px-4 sm:px-6 py-8">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">
            {isEditing ? "Edit Job Listing" : "Create New Job Listing"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyLogoUrl">Company Logo URL</Label>
                <Input
                  id="companyLogoUrl"
                  name="companyLogoUrl"
                  value={formData.companyLogoUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Job Position *</Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="monthlySalary">Monthly Salary (USD) *</Label>
                <Input
                  id="monthlySalary"
                  name="monthlySalary"
                  type="number"
                  min="0"
                  value={formData.monthlySalary}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobType">Job Type *</Label>
                <Select
                  value={formData.jobType}
                  onValueChange={(value) =>
                    handleSelectChange("jobType", value)
                  }
                  required
                >
                  <SelectTrigger id="jobType">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workLocation">Work Location *</Label>
                <Select
                  value={formData.workLocation}
                  onValueChange={(value) =>
                    handleSelectChange("workLocation", value)
                  }
                  required
                >
                  <SelectTrigger id="workLocation">
                    <SelectValue placeholder="Select work location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="in-office">In-office</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, State, Country or 'Remote'"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="aboutCompany">About the Company *</Label>
              <Textarea
                id="aboutCompany"
                name="aboutCompany"
                value={formData.aboutCompany}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">
                Skills Required * (comma separated)
              </Label>
              <Input
                id="skills"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                placeholder="React, JavaScript, CSS, HTML, etc."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo">Additional Information</Label>
              <Textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⟳</span>
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : isEditing ? (
                  "Update Job"
                ) : (
                  "Create Job"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobForm;
