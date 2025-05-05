import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState } from "react";

export default function VisitorButton() {
  const navigate = useNavigate();
  const { guestLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGuestLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await guestLogin(); // chama guestLogin do AuthContext
      navigate("/tasks");
    } catch (err) {
      console.error("Erro ao entrar como visitante:", err);
      setError("Não foi possível autenticar como visitante. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <button
        onClick={handleGuestLogin}
        disabled={loading}
        className="w-full bg-white border-2 border-violet-600 text-violet-700 text-center rounded-xl p-3 font-semibold hover:bg-violet-50 transition-all shadow-sm disabled:opacity-50"
      >
        {loading ? "Autenticando visitante..." : "👤 Entrar como Visitante"}
      </button>

      {error && (
        <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded border border-red-200 w-full text-center">
          {error}
        </div>
      )}
    </div>
  );
}
