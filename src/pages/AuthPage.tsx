import React from "react";
import { AutoForm } from "../components/core/AutoForm";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

type LoginForm = {
  username: string;
  password: string;
};

type RegisterForm = {
  username: string;
  email: string;
  password: string;
  full_name?: string;
};

const AuthPage: React.FC = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = React.useState<"login" | "register">("login");

  const handleLogin = async (data: LoginForm) => {
    const res = await login(data);
    if (res.success) navigate("/admin");
    else alert(res.error ?? "Login failed");
  };

  const handleRegister = async (data: RegisterForm) => {
    const res = await signup(data);
    if (res.success) {
      alert("Registration successful! Please log in.");
      setMode("login");
    } else {
      alert(res.error ?? "Registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="max-w-sm w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">
          {mode === "login" ? "Login" : "Register"}
        </h1>

        {mode === "login" ? (
          <AutoForm<LoginForm>
            defaultValues={{ username: "", password: "" }}
            onSubmit={handleLogin}
          />
        ) : (
          <AutoForm<RegisterForm>
            defaultValues={{
              username: "",
              email: "",
              password: "",
              full_name: "",
            }}
            onSubmit={handleRegister}
          />
        )}

        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-4 text-blue-600 underline"
        >
          {mode === "login" ? "Create an account" : "Back to login"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
