import { AuthCard } from "../components/auth-card";
import { LoginForm } from "./login-form";


export default function LoginPage() {
  return (
    <AuthCard
      title="Login ke CodeBox"
      subtitle="Masukkan kredensial Anda untuk melanjutkan"
      backButtonLabel="Daftar sekarang"
      backButtonHref="/register"
    >
      <LoginForm />
    </AuthCard>
  );
}
