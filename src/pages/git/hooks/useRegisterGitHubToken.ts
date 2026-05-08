import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { registerGitHubToken } from "@/apis/git";
import type { ApiResponse } from "@/types/auth";
import type { GitHubTokenResult } from "@/types/git";

interface UseRegisterGitHubTokenOptions {
  onSuccess?: (result: GitHubTokenResult) => void;
}

export const useRegisterGitHubToken = (
  options?: UseRegisterGitHubTokenOptions,
) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (accessToken: string) => registerGitHubToken(accessToken),
    onSuccess: (result: GitHubTokenResult) => {
      options?.onSuccess?.(result);
    },
    onError: (error: unknown) => {
      if (isAxiosError<ApiResponse<unknown>>(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            "토큰 등록에 실패했습니다. 다시 시도해주세요.",
        );
        return;
      }

      setErrorMessage("토큰 등록에 실패했습니다. 다시 시도해주세요.");
    },
  });

  return {
    registerGitHubToken: (accessToken: string) => {
      setErrorMessage(null);
      mutation.mutate(accessToken);
    },
    isPending: mutation.isPending,
    errorMessage,
  };
};