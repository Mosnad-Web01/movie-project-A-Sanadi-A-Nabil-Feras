"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchDataFromTMDB } from "@/util/fetchDataFromTMDB";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import MediaGroup from "@/components/MediaGroup";

const Profile = ({ params }) => {
  const { id } = params;
  const { currentUser, deleteAccount } = useAuth();
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [actors, setActors] = useState([]);
  const [watchLater, setWatchLater] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const fetchLikedMedia = async () => {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User Data:", userData);

            const likedMovies = await fetchMedia(userData.likedMovies || [], "movie");
            const likedTvShows = await fetchMedia(userData.likedTvShows || [], "tv");
            const likedActors = await fetchMedia(userData.likedActors || [], "person");

            // Fetch Watch Later Media
            const watchLaterList = await fetchWatchLaterMedia(userData.watchLater || []);

            setMovies(likedMovies);
            setTvShows(likedTvShows);
            setActors(likedActors);
            setWatchLater(watchLaterList);
          } else {
            console.log("No user data found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user data or media:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchLikedMedia();
    }
  }, [currentUser]);

  const fetchMedia = async (ids, type) => {
    if (ids.length === 0) {
      console.warn(`No IDs to fetch for type: ${type}`);
      return [];
    }

    try {
      console.log(`Fetching ${type} data for IDs:`, ids);
      const fetchedMedia = await Promise.all(
        ids.map(async (id) => {
          let media;
          if (type === "person") {
            media = await fetchDataFromTMDB(`/person/${id}?append_to_response=movie_credits,external_ids`);
          } else {
            media = await fetchDataFromTMDB(`/${type}/${id}`);
          }
          return media;
        })
      );
      return fetchedMedia.filter((item) => item);
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      return [];
    }
  };

  const fetchWatchLaterMedia = async (watchLaterList) => {
    if (watchLaterList.length === 0) {
      console.warn("No Watch Later items to fetch");
      return [];
    }

    try {
      console.log("Fetching Watch Later data for items:", watchLaterList);
      const fetchedMedia = await Promise.all(
        watchLaterList.map(async (item) => {
          const type = item.type === "movie" ? "movie" : "tv";
          const media = await fetchDataFromTMDB(`/${type}/${item.id}`);
          return { ...media, type };
        })
      );
      return fetchedMedia.filter((item) => item);
    } catch (error) {
      console.error("Error fetching Watch Later data:", error);
      return [];
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        await deleteAccount();
        // Route to the login page or homepage after account deletion
      } catch (error) {
        console.error("Error deleting account:", error);
        setIsDeleting(false);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <div>No user data found. Please log in.</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {currentUser.name}</h1>
        <div className="space-x-4">
          <Link href={`/profile/${id}/edit`}>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              Update Profile
            </button>
          </Link>
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Remove Account"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MediaGroup title="Liked Movies" media={movies} mediaType="movie" />
        <MediaGroup title="Liked TV Shows" media={tvShows} mediaType="tv" />
        <MediaGroup title="Liked Actors" media={actors} mediaType="person" />
        <MediaGroup title="Watch Later" media={watchLater} mediaType="watchLater" />
      </div>
    </div>
  );
};

export default Profile;