import React, { useState } from "react";

import { FaHeart, FaBookmark, FaStar, FaBars } from "react-icons/fa";
import IconButton from "./IconButton";

const InteractiveButtons = ({ mediaId, mediaType }) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [rated, setRated] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const inActiveClassStyle = "bg-gray-100 text-gray-600 hover:bg-gray-200";

  return (
    <div className="flex justify-left space-x-2 my-4">
      <IconButton
        onClick={() => setLiked(!liked)}
        isActive={liked}
        activeClass="bg-red-400 text-white"
        inactiveClass= {inActiveClassStyle}
        Icon={FaHeart}
      />
      <IconButton
        onClick={() => setBookmarked(!bookmarked)}
        isActive={bookmarked}
        activeClass="bg-blue-400 text-white"
        inactiveClass= {inActiveClassStyle}
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
        isActive={false} // always inactive for the menu button
        activeClass="bg-gray-200" // not used, but kept for consistency
        inactiveClass={inActiveClassStyle}
        Icon={FaBars}
      />
    </div>
  );
};

export default InteractiveButtons;