import { useState } from "react";
import { useNavigate } from "react-router";
import { AuthForm } from "../components/AuthForm";
import { authAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import type { LoginCredentials, RegisterCredentials } from "../types";
import { toast } from "sonner";

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ cambiado de setUser a login

  const handleSubmit = async (credentials: LoginCredentials | RegisterCredentials) => {
    setIsLoading(true);
    try {
      const response =
        mode === "login"
          ? await authAPI.login(credentials as LoginCredentials)
          : await authAPI.register(credentials as RegisterCredentials);

      login(response.user); // ✅ guarda user
      toast.success(`Welcome ${response.user.username}!`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Auth error:", error);
      toast.error("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <AuthForm
        mode={mode}
        onSubmit={handleSubmit}
        onToggleMode={() => setMode(mode === "login" ? "register" : "login")}
        isLoading={isLoading}
      />
    </div>
  );
}