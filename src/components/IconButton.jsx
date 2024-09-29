import React from 'react'

const IconButton = ({ onClick, isActive, activeClass, inactiveClass, Icon }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full transition-all duration-300 shadow-md ${isActive ? activeClass : inactiveClass}`}
    >
      <Icon className="w-5 h-5" />
    </button>
  )
}

export default IconButton

