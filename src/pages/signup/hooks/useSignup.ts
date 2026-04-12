import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "@/apis/auth";
import { ROUTES } from "@/constants/routes";
import type { ApiResponse, SignupResult } from "@/types/auth";
import { tokenStore } from "@/utils/tokenStore";

export const useSignup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: (result: SignupResult) => {
      tokenStore.setToken(result.access_token);
      navigate(ROUTES.APP_ROOT, { replace: true });
    },
    onError: (error: unknown) => {
      if (isAxiosError<ApiResponse<unknown>>(error)) {
        setErrorMessage(
          error.response?.data?.message ??
            "회원가입에 실패했습니다. 다시 시도해주세요.",
        );
        return;
      }
      setErrorMessage("회원가입에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const validate = () => {
    if (!name.trim()) return "이름을 입력해 주세요.";
    if (!email.trim()) return "이메일을 입력해 주세요.";
    if (!password.trim()) return "비밀번호를 입력해 주세요.";
    if (password.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
    if (password !== confirmPassword) return "비밀번호가 일치하지 않습니다.";
    return null;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    const validationError = validate();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    signupMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      password,
    });
  };

  return {
    name,
    email,
    password,
    confirmPassword,
    errorMessage,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSubmit,
    isPending: signupMutation.isPending,
  };
};
