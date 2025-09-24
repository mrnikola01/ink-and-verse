import React, { useState, useRef } from "react";
import {
  AiOutlinePlus,
  AiOutlineFolder,
  AiOutlineSearch,
} from "react-icons/ai";
import { BsFillPersonFill } from "react-icons/bs";
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { FiFeather } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { FaPlay, FaPause } from "react-icons/fa"; // ✅ Play/Pause ikonice

export default function Header({
  isAdmin = false,
  isDark = false,
  onAddClick,
  onFolderClick,
  onLoginClick,
  onLogout,
  searchTerm,
  setSearchTerm,
}) {
  const audioRef = useRef(null); // ✅ referenca na audio
  const [isPlaying, setIsPlaying] = useState(false); // ✅ stanje muzike

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        console.log("Autoplay blokiran – korisnik mora kliknuti Play");
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <header className="w-full bg-pink-50 shadow-md py-4 px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Left: Logo */}
      <div className="flex items-center justify-center md:justify-start space-x-2">
        <FiFeather size={28} className="text-pink-500" />
        <h1 className="text-3xl font-bold text-pink-500">Ink & Verse</h1>
      </div>

      {/* Middle: Search */}
      <div className="flex-1 flex justify-center order-2 md:order-none">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            placeholder="Search songs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full
              pl-10 pr-4 py-3
              rounded-full
              bg-pink-100 text-gray-700 placeholder-gray-400
              focus:outline-none
              focus:ring-2 focus:ring-pink-300
              focus:placeholder-pink-300
              transition-all duration-300
              shadow-sm
              hover:shadow-md
              focus:shadow-lg
            "
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-300">
            <AiOutlineSearch size={20} />
          </span>
        </div>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center justify-center space-x-4 order-3 md:order-none">
        {isAdmin && (
          <>
            <button
              className="p-2 bg-pink-400 text-white rounded hover:bg-pink-500 transition"
              onClick={onAddClick}
            >
              <AiOutlinePlus size={20} />
            </button>

            <button
              className="p-2 bg-pink-400 text-white rounded hover:bg-pink-500 transition"
              onClick={onFolderClick}
            >
              <AiOutlineFolder size={20} />
            </button>
          </>
        )}

        <button className="p-2 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition">
          {isDark ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
        </button>

        {/* ✅ Play/Pause dugme */}
        <button
          onClick={toggleMusic}
          className={`p-2 rounded transition ${
            isPlaying
              ? "bg-green-200 text-green-700 hover:bg-green-300"
              : "bg-green-100 text-green-700 hover:bg-green-200"
          }`}
        >
          {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
        </button>

        {isAdmin ? (
          <button
            className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
            onClick={onLogout}
          >
            <BiLogOut size={20} />
          </button>
        ) : (
          <button
            className="p-2 bg-pink-100 text-pink-700 rounded hover:bg-pink-200 transition"
            onClick={onLoginClick}
          >
            <BsFillPersonFill size={20} />
          </button>
        )}
      </div>

      {/* ✅ Skriveni audio player */}
      <audio ref={audioRef} src="/music.mp3" loop />
    </header>
  );
}
