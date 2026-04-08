import { LoginBackground } from "./components/LoginBackground";
import { LoginForm } from "./components/LoginForm";
import { useLogin } from "./hooks/useLogin";

function LoginPage() {
  const {
    email,
    password,
    errorMessage,
    isPending,
    setEmail,
    setPassword,
    handleSubmit,
  } = useLogin();

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden">
      <LoginBackground />
      <LoginForm
        email={email}
        password={password}
        errorMessage={errorMessage}
        isPending={isPending}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default LoginPage;
