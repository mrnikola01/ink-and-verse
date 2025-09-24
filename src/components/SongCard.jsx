import React, { useState, useEffect } from "react";
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlineHeart,
  AiFillHeart,
} from "react-icons/ai";
import { FiMaximize, FiVolume2, FiEye, FiEyeOff } from "react-icons/fi";
import { supabase } from "../SupabaseClient"; // dodaj ako ti treba za update

export default function SongCard({
  song,
  isAdmin = true,
  onExpand,
  onEditClick,
  onDelete,
}) {
  const { title, content, author, created_at, id } = song;

  const [isVisible, setIsVisible] = useState(song.is_visible); // vrednost iz baze

  const toggleView = async () => {
    const newStatus = !isVisible; // obrni vrednost
    setIsVisible(newStatus);

    const { error } = await supabase
      .from("songs")
      .update({ is_visible: newStatus })
      .eq("id", song.id);

    if (error) console.error(error);
  };

  // localStorage za lajkovanje
  const likedSongs = JSON.parse(localStorage.getItem("likedSongs") || "[]");
  const [isLiked, setIsLiked] = useState(likedSongs.includes(id));
  const [likes, setLikes] = useState(song.likes || 0);

  const toggleLike = async () => {
    const likedSongs = JSON.parse(localStorage.getItem("likedSongs") || "[]");
    let newLikes = likes;

    if (!isLiked) {
      newLikes += 1;
      likedSongs.push(id);
    } else {
      newLikes -= 1;
      likedSongs.splice(likedSongs.indexOf(id), 1);
    }

    setIsLiked(!isLiked);
    setLikes(newLikes);
    localStorage.setItem("likedSongs", JSON.stringify(likedSongs));

    // Update likes u bazi
    const { error } = await supabase
      .from("songs")
      .update({ likes: newLikes })
      .eq("id", id);

    if (error) console.error(error);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition relative">
      <div className="absolute top-2 right-2 flex space-x-2">
        <button
          className="p-1 text-gray-400 hover:text-gray-700 transition"
          onClick={() => console.log("Play sound for:", title)}
        >
          <FiVolume2 size={18} />
        </button>

        <button
          className="p-1 text-gray-400 hover:text-gray-700 transition"
          onClick={() => onExpand(song)}
        >
          <FiMaximize size={18} />
        </button>

        {isAdmin && (
          <>
            <button
              className="p-1 text-pink-500 hover:text-pink-700 transition"
              onClick={() => onEditClick && onEditClick(song)}
            >
              <AiOutlineEdit size={18} />
            </button>

            <button
              className="p-1 text-gray-400 hover:text-gray-700 transition"
              onClick={toggleView}
            >
              {!isVisible ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>

            <button
              className="p-1 text-red-500 hover:text-red-700 transition"
              onClick={() => onDelete && onDelete(song)}
            >
              <AiOutlineDelete size={18} />
            </button>
          </>
        )}
      </div>

      <h2 className="text-2xl font-semibold text-pink-500 mb-2">{title}</h2>
      <p className="text-gray-700 mb-4 whitespace-pre-wrap line-clamp-3">
        {content}
      </p>

      <div className="flex justify-between items-center text-gray-500 text-sm">
        <div className="flex items-center space-x-2">
          <span className="italic">By {author}</span>
          <button
            onClick={toggleLike}
            className="flex items-center space-x-1 p-1 hover:scale-110 transition"
          >
            {isLiked ? (
              <AiFillHeart size={18} className="text-red-500" />
            ) : (
              <AiOutlineHeart size={18} className="text-gray-400" />
            )}
            <span className="text-gray-500">{likes}</span>
          </button>
        </div>
        <span>{new Date(created_at).toLocaleDateString("en-US")}</span>
      </div>
    </div>
  );
}
