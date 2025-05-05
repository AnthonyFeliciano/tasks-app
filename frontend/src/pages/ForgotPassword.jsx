import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import Input from "../components/Input";
import Button from "../components/Button";
import { apiFetch } from "../api/httpClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); 
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setMessage("");

    if (!email.trim()) {
      setStatus("error");
      setMessage("Informe um email válido.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiFetch("/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      }, false);

      setStatus("success");
      setMessage("Link de recuperação enviado para seu email.");
    } catch (err) {
      setStatus("error");
      setMessage(
        err.data?.message || "Erro ao enviar link de recuperação. Tente novamente."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Remove a mensagem após 5 segundos
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setStatus("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <AuthCard title="Recuperar Senha">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <Input
          type="email"
          name="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {message && (
          <div
            className={`text-sm px-4 py-2 rounded text-center border transition-opacity duration-300 ${
              status === "success"
                ? "bg-green-100 text-green-700 border-green-200"
                : "bg-red-100 text-red-700 border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar Link de Recuperação"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-violet-600 font-semibold hover:underline"
        >
          Voltar para o Login
        </Link>
      </div>
    </AuthCard>
  );
}
