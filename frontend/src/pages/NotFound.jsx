import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-700 p-6 animate-fade-in">
      <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-md text-center">
        <h1 className="text-6xl font-extrabold text-violet-600 mb-4 animate-bounce">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Página não encontrada
        </h2>
        <p className="text-gray-600 mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link
          to="/tasks"
          className="inline-block px-6 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 transition-all shadow-lg"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}
