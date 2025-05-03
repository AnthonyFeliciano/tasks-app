import { Link } from "react-router-dom";

export default function VisitorButton({ to }) {
  return (
    <Link
      to={to}
      className="bg-white border-2 border-violet-600 text-violet-700 text-center rounded-xl p-3 font-semibold hover:bg-violet-50 transition-all shadow-sm"
    >
      👤 Entrar como Visitante
    </Link>
  );
}
