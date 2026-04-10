import { useQuery } from "@tanstack/react-query";
import { fetchTeams } from "@/apis/teams";

export const useTeams = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
  });
};
