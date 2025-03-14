
import { useJobs } from "@/context/job-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const JobSorter = () => {
  const { sortOption, setSortOption } = useJobs();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">Sort by:</span>
      <Select
        value={sortOption}
        onValueChange={(value) => setSortOption(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest First</SelectItem>
          <SelectItem value="oldest">Oldest First</SelectItem>
          <SelectItem value="salary-high">Highest Salary</SelectItem>
          <SelectItem value="salary-low">Lowest Salary</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default JobSorter;
