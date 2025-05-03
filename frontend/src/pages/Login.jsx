import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import Button from "../components/Button";
import VisitorButton from "../components/VisitorButton";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setGeneralError(""); 
  };

  const validate = () => {
    if (!form.email || !form.password) {
      setGeneralError("Preencha todos os campos");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError("");

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await login(form.email.trim(), form.password);
      navigate("/tasks");
    } catch (err) {
      setGeneralError(err.message || "Credenciais inválidas. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/tasks" />;
  }

  return (
    <AuthCard title="Entrar na Conta">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <Input
          type="password"
          name="password"
          placeholder="Senha"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
        />

        {generalError && (
          <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded text-center border border-red-200">
            {generalError}
          </div>
        )}
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>

        <VisitorButton to="/tasks" />

        <Link
          to="/forgot-password"
          className="text-center text-sm text-gray-500 hover:underline"
        >
          Esqueceu sua senha?
        </Link>
      </form>

      <div className="mt-6 text-center">
        <span className="text-gray-500">Não tem uma conta?</span>{" "}
        <Link
          to="/register"
          className="text-violet-600 font-semibold hover:underline"
        >
          Criar Conta
        </Link>
      </div>
    </AuthCard>
  );
}
