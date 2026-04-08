import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/apis/auth";
import { ROUTES } from "@/constants/endpoint";
import type { ApiResponse, LoginResult } from "@/types/auth";

export const useLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (result: LoginResult) => {
      localStorage.setItem("accessToken", result.accessToken);
      navigate(ROUTES.APP_ROOT);
    },
    onError: (error: unknown) => {
      if (isAxiosError<ApiResponse<unknown>>(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            "로그인에 실패했습니다. 다시 시도해주세요.",
        );
        return;
      }
      setErrorMessage("로그인에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    loginMutation.mutate({ email, password });
  };

  return {
    email,
    password,
    errorMessage,
    setEmail,
    setPassword,
    handleSubmit,
    isPending: loginMutation.isPending,
  };
};
