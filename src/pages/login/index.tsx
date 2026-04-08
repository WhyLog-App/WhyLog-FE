import { useMutation } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/apis/auth";
import imgBackground from "@/assets/images/background.webp";
import LogoSymbol from "@/components/logo/LogoSymbol";
import LogoText from "@/components/logo/LogoText";
import { ROUTES } from "@/constants/endpoint";
import type { ApiResponse, LoginResult } from "@/types/auth";

function LoginPage() {
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

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(-15.8deg, rgb(208, 240, 244) 10.78%, rgb(232, 228, 248) 42.16%, rgb(216, 228, 252) 89.22%)",
          }}
        />
        <img
          alt=""
          aria-hidden="true"
          src={imgBackground}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
      </div>

      {/* Login Card */}
      <form
        onSubmit={handleSubmit}
        className="relative flex w-[440px] flex-col items-center gap-10 overflow-hidden rounded-[30px] border border-white px-7 pb-10 pt-20"
        style={{ background: "rgba(255, 255, 255, 0.3)" }}
      >
        {/* Logo */}
        <section className="flex flex-col items-center gap-3" aria-label="WhyLog">
          <LogoSymbol className="h-15 w-17.5" aria-hidden="true" />
          <LogoText className="h-13 w-38" aria-hidden="true" />

          {/* Subtitle */}
          <p className="typo-body5 text-text-secondary">
            회의 기반 의사결정 관리 플랫폼
          </p>
        </section>

        {/* Form Fields */}
        <div className="flex w-full flex-col gap-3">
          {/* Email Input */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="typo-label text-text-secondary">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
              className="typo-body6 h-11 w-full rounded-full border border-white bg-transparent px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-white"
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="typo-label text-text-secondary"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="typo-body6 h-11 w-full rounded-full border border-white bg-transparent px-4 py-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-white"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex w-full flex-col items-center gap-3">
          {errorMessage && (
            <p className="typo-body6 text-red-500" role="alert">
              {errorMessage}
            </p>
          )}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="typo-button-md w-full cursor-pointer rounded-full py-3 text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background:
                "linear-gradient(164.49deg, rgb(91, 141, 239) 15.47%, rgb(0, 99, 247) 84.42%)",
            }}
          >
            {loginMutation.isPending ? "로그인 중..." : "로그인"}
          </button>

          <div className="flex items-center gap-2">
            <span className="typo-body6 text-text-secondary">
              계정이 없으신가요?
            </span>
            <Link
              to={ROUTES.SIGNUP}
              className="typo-button-sm text-text-brand hover:underline"
            >
              회원가입
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
