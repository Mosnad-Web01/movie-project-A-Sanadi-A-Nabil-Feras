import React, { useState } from "react";
import { FaHeart, FaBookmark, FaStar, FaBars } from "react-icons/fa";
import IconButton from "./IconButton";
import { useLikes } from "../hooks/useLikes";
import { useAuth } from "../contexts/AuthContext";

const InteractiveButtons = ({ mediaId, mediaType }) => {
  const { currentUser } = useAuth();
  const { isLiked, toggleLike, isUpdating } = useLikes(mediaId, mediaType);
  const [bookmarked, setBookmarked] = useState(false);
  const [rated, setRated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const inActiveClassStyle = "bg-gray-100 text-gray-600 hover:bg-gray-200";

  const handleLikeClick = () => {
    if (currentUser) {
      toggleLike();
    } else {
      // Handle case when user is not logged in (e.g., show login prompt)
      console.log("User needs to log in to like media");
    }
  };

  return (
    <div className="flex justify-left space-x-2 my-4">
      <IconButton
        onClick={handleLikeClick}
        isActive={isLiked}
        activeClass="bg-red-400 text-white"
        inactiveClass={inActiveClassStyle}
        Icon={FaHeart}
        disabled={isUpdating}
      />
      <IconButton
        onClick={() => setBookmarked(!bookmarked)}
        isActive={bookmarked}
        activeClass="bg-blue-400 text-white"
        inactiveClass={inActiveClassStyle}
        Icon={FaBookmark}
      />
      <IconButton
        onClick={() => setRated(!rated)}
        isActive={rated}
        activeClass="bg-yellow-500 text-white"
        inactiveClass={inActiveClassStyle}
        Icon={FaStar}
      />
      <IconButton
        onClick={() => setMenuOpen(!menuOpen)}
        isActive={false}
        activeClass="bg-gray-200"
        inactiveClass={inActiveClassStyle}
        Icon={FaBars}
      />
    </div>
  );
};

export default InteractiveButtons;