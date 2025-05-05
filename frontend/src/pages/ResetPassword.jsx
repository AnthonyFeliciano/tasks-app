import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import Button from "../components/Button";
import { resetPassword } from "../api/auth";

export default function ResetPassword() {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token");

  const [form, setForm] = useState({
    password: "",
    password_confirmation: "",
  });

  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setMessage("");

    if (!form.password || !form.password_confirmation) {
      setStatus("error");
      setMessage("Preencha todos os campos.");
      return;
    }

    if (form.password !== form.password_confirmation) {
      setStatus("error");
      setMessage("As senhas não coincidem.");
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword({ ...form, token });
      setStatus("success");
      setMessage("Senha redefinida com sucesso.");
    } catch (err) {
      setStatus("error");
      setMessage(err.data?.message || "Erro ao redefinir senha.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard title="Redefinir Senha">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          type="password"
          name="password"
          placeholder="Nova senha (mínimo 8 caracteres)"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Input
          type="password"
          name="password_confirmation"
          placeholder="Confirme a nova senha"
          value={form.password_confirmation}
          onChange={handleChange}
          required
        />

        {message && (
          <div className={`text-sm px-4 py-2 rounded text-center border ${
            status === "success"
              ? "bg-green-100 text-green-700 border-green-200"
              : "bg-red-100 text-red-700 border-red-200"
          }`}>
            {message}
          </div>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Redefinir Senha"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-violet-600 font-semibold hover:underline">
          Voltar para o Login
        </Link>
      </div>
    </AuthCard>
  );
}
