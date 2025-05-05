import { useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import Button from "../components/Button";
import { useAuth } from "../auth/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated, loading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setGeneralError("");
  };

  const validate = () => {
    const { name, email, password, password_confirmation } = form;

    if (!name || !email || !password || !password_confirmation) {
      setGeneralError("Preencha todos os campos");
      return false;
    }

    if (password.length < 8) {
      setGeneralError("A senha deve ter no mínimo 8 caracteres");
      return false;
    }

    if (password !== password_confirmation) {
      setGeneralError("A confirmação da senha não confere");
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
      await register(
        form.name.trim(),
        form.email.trim(),
        form.password,
        form.password_confirmation
      );
      navigate("/tasks");
    } catch (err) {
      const fieldErrors = err.data?.errors || err.data?.message;

      if (fieldErrors && typeof fieldErrors === "object") {
        const firstField = Object.keys(fieldErrors)[0];
        const firstMessage = fieldErrors[firstField]?.[0];
        setGeneralError(firstMessage || "Erro ao enviar dados.");
      } else if (typeof err.data?.message === "string") {
        setGeneralError(err.data.message);
      } else {
        setGeneralError("Erro inesperado ao criar conta.");
      }
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
    <AuthCard title="Criar Conta">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="Nome completo"
          value={form.name}
          onChange={handleChange}
          required
        />

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
          placeholder="Senha (mínimo 8 caracteres)"
          value={form.password}
          onChange={handleChange}
          required
        />

        <Input
          type="password"
          name="password_confirmation"
          placeholder="Confirme a senha"
          value={form.password_confirmation}
          onChange={handleChange}
          required
        />

        {generalError && (
          <div
            role="alert"
            data-testid="register-error"
            className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded text-center border border-red-200"
          >
            {generalError}
          </div>
        )}


        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Criando conta..." : "Criar Conta"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-gray-500">Já tem uma conta?</span>{" "}
        <Link
          to="/login"
          className="text-violet-600 font-semibold hover:underline"
        >
          Entrar
        </Link>
      </div>
    </AuthCard>
  );
}
