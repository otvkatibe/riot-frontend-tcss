import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://riot-backend.vercel.app/favorites",)
      .then(res => setFavorites(res.data))
      .catch(() => toast.error("Erro ao carregar favoritos"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-lolblue text-lolgold">
      <header className="flex justify-between items-center p-6 bg-lolblack">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          <span className="mr-4">{user?.username}</span>
          <button
            onClick={() => { logout(); toast.info("Você saiu!"); }}
            className="bg-lolgold text-lolblue px-4 py-2 rounded font-bold hover:bg-yellow-600 transition"
          >
            Sair
          </button>
        </div>
      </header>
      <main className="p-8">
        <h2 className="text-xl mb-4">Seus Favoritos</h2>
        <ul>
          {favorites.map(fav => (
            <li key={fav.id} className="mb-2 p-3 bg-lolblack rounded">{fav.name}</li>
          ))}
        </ul>
      </main>
    </div>
  );
}
