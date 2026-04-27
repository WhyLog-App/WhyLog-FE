import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { endMeeting } from "@/apis/meetings";

export const useEndMeeting = () => {
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (id: number) => endMeeting(id),
    onSuccess: () => navigate("/"),
    onError: () => navigate("/"),
  });
  return {
    endMeeting: mutation.mutate,
    isPending: mutation.isPending,
  };
};
