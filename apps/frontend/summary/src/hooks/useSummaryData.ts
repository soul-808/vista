import { useQuery } from "@tanstack/react-query";
import { summaryService } from "../api/summaryService";

export const useSummaryData = () => {
  return useQuery({
    queryKey: ["summaryData"],
    queryFn: () => summaryService.getSummaryData(),
    refetchInterval: 300000, // Refetch every 5 minutes
    staleTime: 60000, // Consider data stale after 1 minute
  });
};
