
import { useState } from "react";
import { JobType, WorkLocation } from "@/types";
import { useJobs } from "@/context/job-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const JobFilter = () => {
  const { 
    searchQuery, 
    setSearchQuery, 
    filters, 
    setFilters 
  } = useJobs();

  const [tempFilters, setTempFilters] = useState({
    ...filters,
  });

  const [salaryRange, setSalaryRange] = useState<[number, number]>([
    filters.salaryMin || 0,
    filters.salaryMax || 20000,
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleJobTypeChange = (type: JobType) => {
    const currentTypes = [...tempFilters.jobType];
    if (currentTypes.includes(type)) {
      setTempFilters({
        ...tempFilters,
        jobType: currentTypes.filter((t) => t !== type),
      });
    } else {
      setTempFilters({
        ...tempFilters,
        jobType: [...currentTypes, type],
      });
    }
  };

  const handleWorkLocationChange = (type: WorkLocation) => {
    const currentLocations = [...tempFilters.workLocation];
    if (currentLocations.includes(type)) {
      setTempFilters({
        ...tempFilters,
        workLocation: currentLocations.filter((t) => t !== type),
      });
    } else {
      setTempFilters({
        ...tempFilters,
        workLocation: [...currentLocations, type],
      });
    }
  };

  const handleSalaryRangeChange = (value: number[]) => {
    setSalaryRange([value[0], value[1]]);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempFilters({
      ...tempFilters,
      location: e.target.value,
    });
  };

  const applyFilters = () => {
    setFilters({
      ...tempFilters,
      salaryMin: salaryRange[0],
      salaryMax: salaryRange[1],
    });
  };

  const clearFilters = () => {
    setTempFilters({
      jobType: [],
      workLocation: [],
      location: "",
    });
    setSalaryRange([0, 20000]);
  };

  return (
    <div className="mb-6 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search for jobs, companies, or keywords..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>

      <div className="flex justify-between items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-sm">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                Filter jobs based on your preferences.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Job Type</h3>
                <div className="flex flex-col gap-2">
                  {["full-time", "part-time", "internship", "contract"].map(
                    (type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${type}`}
                          checked={tempFilters.jobType.includes(type as JobType)}
                          onCheckedChange={() =>
                            handleJobTypeChange(type as JobType)
                          }
                        />
                        <Label htmlFor={`type-${type}`} className="capitalize">
                          {type.replace("-", " ")}
                        </Label>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium">Work Location</h3>
                <div className="flex flex-col gap-2">
                  {["remote", "in-office", "hybrid"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={`work-${type}`}
                        checked={tempFilters.workLocation.includes(
                          type as WorkLocation
                        )}
                        onCheckedChange={() =>
                          handleWorkLocationChange(type as WorkLocation)
                        }
                      />
                      <Label htmlFor={`work-${type}`} className="capitalize">
                        {type.replace("-", " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Salary Range (Monthly)</h3>
                <Slider
                  min={0}
                  max={20000}
                  step={500}
                  value={salaryRange}
                  onValueChange={handleSalaryRangeChange}
                  className="pt-4"
                />
                <div className="flex justify-between text-sm">
                  <span>${salaryRange[0].toLocaleString()}</span>
                  <span>${salaryRange[1].toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="City, state, or country"
                  value={tempFilters.location}
                  onChange={handleLocationChange}
                />
              </div>
            </div>
            <SheetFooter className="sm:justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                <span>Clear Filters</span>
              </Button>
              <SheetClose asChild>
                <Button onClick={applyFilters}>Apply Filters</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default JobFilter;
