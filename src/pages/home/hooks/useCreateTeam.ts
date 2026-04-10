import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { createTeam } from "@/apis/teams";
import type { ApiResponse } from "@/types/auth";
import type { CreateTeamResult } from "@/types/team";

export const useCreateTeam = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: ({ name }: { name: string }) => createTeam({ name }),
    onSuccess: (_result: CreateTeamResult) => {
      // TODO: 팀 목록 쿼리 무효화 또는 팀 페이지로 이동
    },
    onError: (error: unknown) => {
      if (isAxiosError<ApiResponse<unknown>>(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            "팀 생성에 실패했습니다. 다시 시도해주세요.",
        );
        return;
      }
      setErrorMessage("팀 생성에 실패했습니다. 다시 시도해주세요.");
    },
  });

  return {
    createTeam: (name: string) => {
      setErrorMessage(null);
      mutation.mutate({ name });
    },
    isPending: mutation.isPending,
    errorMessage,
  };
};
