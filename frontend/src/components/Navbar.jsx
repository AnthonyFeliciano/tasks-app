import { LogOut } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-indigo-700 shadow py-4 px-10 flex justify-between items-center">
      <h1 className="text-xl font-bold text-white">MyTasks</h1>
      <button
        onClick={handleLogout}
        className="p-2 rounded-full hover:bg-indigo-600 transition"
        title="Sair"
      >
        <LogOut size={20} className="text-white" />
      </button>
    </header>
  );
}
