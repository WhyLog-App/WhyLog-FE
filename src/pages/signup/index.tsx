import { AuthBackground } from "@/components/common/AuthBackground";
import { SignupForm } from "./components/SignupForm";
import { useSignup } from "./hooks/useSignup";

function SignupPage() {
  const {
    name,
    email,
    password,
    confirmPassword,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSubmit,
  } = useSignup();

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden">
      <AuthBackground />
      <SignupForm
        name={name}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        onNameChange={setName}
        onEmailChange={setEmail}
        onPasswordChange={setPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default SignupPage;
