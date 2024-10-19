// hooks/useLikes.js
import { useAuth } from "../contexts/AuthContext"
import { useState, useEffect, useCallback } from "react"
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { db } from "../firebase/config"

export const useLikes = (mediaId, mediaType) => {
  const { currentUser, refreshUserData } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (currentUser) {
      const likedArray =
        mediaType === "movie"
          ? currentUser.likedMovies || []
          : currentUser.likedTvShows || []
      setIsLiked(likedArray.includes(mediaId))
    }
  }, [currentUser, mediaId, mediaType])

  const toggleLike = useCallback(async () => {
    if (!currentUser || isUpdating) return

    const newLikedState = !isLiked
    setIsLiked(newLikedState) // Optimistic update
    setIsUpdating(true)

    const userRef = doc(db, "users", currentUser.uid)
    const arrayField = mediaType === "movie" ? "likedMovies" : "likedTvShows"

    try {
      await updateDoc(userRef, {
        [arrayField]: newLikedState
          ? arrayUnion(mediaId)
          : arrayRemove(mediaId),
      })
      await refreshUserData() // Refresh user data to ensure consistency
    } catch (error) {
      console.error("Error updating likes:", error)
      setIsLiked(!newLikedState) // Revert optimistic update if there's an error
    } finally {
      setIsUpdating(false)
    }
  }, [currentUser, isLiked, isUpdating, mediaId, mediaType, refreshUserData])

  return { isLiked, toggleLike, isUpdating }
}
