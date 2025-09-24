import { useState, useEffect } from "react";
import { supabase } from "./SupabaseClient";
import Header from "./components/Header";
import SongCard from "./components/SongCard";
import Modal from "./components/Modal";
import AddSongModal from "./components/AddSongModal";
import EditSongModal from "./components/EditSongModal";
import DeleteModal from "./components/DeleteModal";
import Toast from "./components/Toast";
import LoginPage from "./components/LoginPage";

export default function App() {
  const [songs, setSongs] = useState([]);
  const [expandedSong, setExpandedSong] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingSong, setEditingSong] = useState(null);
  const [deleteSong, setDeleteSong] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [adminName, setAdminName] = useState("");

  // Toasts
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  };
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Admin / login
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 9;

  // Fetch songs from Supabase
  useEffect(() => {
    const fetchSongs = async () => {
      let query = supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isAdmin) {
        query = query.eq("is_visible", true); // Samo javne pesme
      }

      const { data, error } = await query;

      if (error) console.error(error);
      else setSongs(data);
    };
    fetchSongs();
  }, [isAdmin]);

  // Filter songs according to search
  const filteredSongs = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSongs.length / songsPerPage)
  );
  const startIndex = (currentPage - 1) * songsPerPage;
  const currentSongs = filteredSongs.slice(
    startIndex,
    startIndex + songsPerPage
  );

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [filteredSongs, currentPage, totalPages]);

  // CRUD Handlers
  const handleAddSong = (newSong) => {
    setSongs((prev) => [newSong, ...prev]); // odmah dodaj u state
    addToast("Song added successfully!", "success");
  };

  const handleEditSong = async (songId, updatedFields) => {
    const { data, error } = await supabase
      .from("songs")
      .update(updatedFields)
      .eq("id", songId)
      .select();
    if (error) console.error(error);
    else {
      setSongs(songs.map((s) => (s.id === songId ? data[0] : s)));
      addToast("Song updated successfully!", "success");
    }
  };

  const handleDeleteSong = async (songId) => {
    const { error } = await supabase.from("songs").delete().eq("id", songId);
    if (error) console.error(error);
    else {
      setSongs(songs.filter((s) => s.id !== songId));
      addToast("Song deleted successfully!", "info");
    }
  };

  // Admin login via Supabase
  const handleAdminLogin = async (username, password) => {
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("username", username)
      .eq("password", password);

    if (error) {
      console.error(error);
      addToast("Login failed!", "error");
    } else if (data.length === 0) {
      // nema poklapanja
      addToast("Wrong username or password!", "error");
    } else {
      // data[0] je admin
      setIsAdmin(true);
      setAdminName(data[0].username);
      setShowLogin(false);
      addToast("Admin logged in!", "success");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    addToast("Logged out!", "info");
  };

  return (
    <>
      {showLogin ? (
        <LoginPage
          onLogin={handleAdminLogin}
          onBack={() => setShowLogin(false)}
        />
      ) : (
        <div className="min-h-screen bg-pink-50 flex flex-col items-center p-6">
          <Header
            isAdmin={isAdmin}
            isDark={false}
            onAddClick={() => setIsAddOpen(true)}
            onLoginClick={() => setShowLogin(true)}
            onLogout={handleLogout}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          <main className="w-full max-w-6xl mt-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {currentSongs.map((song) => (
              <SongCard
                key={song.id}
                song={song}
                isAdmin={isAdmin}
                onExpand={setExpandedSong}
                onEditClick={(s) => {
                  setEditingSong(s);
                  setIsEditOpen(true);
                }}
                onDelete={(s) => {
                  setDeleteSong(s);
                  setIsDeleteOpen(true);
                }}
              />
            ))}
          </main>

          {/* Pagination */}
          <div className="flex gap-2 mt-6">
            <button
              className="px-3 py-1 bg-pink-200 text-pink-700 rounded hover:bg-pink-300 transition disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            >
              {"<<"}
            </button>
            <button
              className="px-3 py-1 bg-pink-200 text-pink-700 rounded hover:bg-pink-300 transition disabled:opacity-50"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              {"<"}
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded transition ${
                  currentPage === i + 1
                    ? "bg-pink-400 text-white"
                    : "bg-pink-200 text-pink-700 hover:bg-pink-300"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-3 py-1 bg-pink-200 text-pink-700 rounded hover:bg-pink-300 transition disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              {">"}
            </button>
            <button
              className="px-3 py-1 bg-pink-200 text-pink-700 rounded hover:bg-pink-300 transition disabled:opacity-50"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            >
              {">>"}
            </button>
          </div>

          {/* Modals */}
          <Modal
            isOpen={!!expandedSong}
            song={expandedSong}
            onClose={() => setExpandedSong(null)}
          />
          <AddSongModal
            isOpen={isAddOpen}
            onClose={() => setIsAddOpen(false)}
            onAddSong={handleAddSong}
            adminName={adminName} // sada stvarno ime ulogovanog admina
          />
          <EditSongModal
            isOpen={isEditOpen}
            song={editingSong}
            onClose={() => setIsEditOpen(false)}
            onEditSong={handleEditSong}
          />
          <DeleteModal
            isOpen={isDeleteOpen}
            song={deleteSong}
            onClose={() => setIsDeleteOpen(false)}
            onConfirm={() => handleDeleteSong(deleteSong.id)}
          />
        </div>
      )}

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onClose={() => removeToast(t.id)}
          />
        ))}
      </div>
    </>
  );
}
