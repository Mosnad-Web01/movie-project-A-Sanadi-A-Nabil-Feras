"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchDataFromTMDB } from "@/util/fetchDataFromTMDB";
import { doc, getDoc } from "firebase/firestore"; // Assuming you're using Firestore
import { db } from "@/firebase/config";

const Profile = ({ params }) => {
  const { id } = params;
  const { currentUser, deleteAccount } = useAuth();
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [actors, setActors] = useState([]);
  const [watchLater, setWatchLater] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firebase and TMDB
  useEffect(() => {
    if (currentUser) {
      const fetchLikedMedia = async () => {
        try {
          // Get user document from Firestore
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User Data:", userData);

            // Fetch media based on user's liked data
            const likedMovies = await fetchMedia(userData.likedMovies || [], "movie");
            const likedTvShows = await fetchMedia(userData.likedTvShows || [], "tv");
            const likedActors = await fetchMedia(userData.likedActors || [], "person");
            const watchLaterList = await fetchMedia(userData.watchLater || [], "movie");

            // Update state with fetched data
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
          setLoading(false); // Set loading to false once data is fetched
        }
      };

      fetchLikedMedia();
    }
  }, [currentUser]);

  // Fetch media by type (movies, tv shows, actors)
  const fetchMedia = async (ids, type) => {
    if (ids.length === 0) {
      return []; // Return an empty array if there are no IDs to fetch
    }

    try {
      console.log(`Fetching ${type} data for IDs:`, ids);
      const fetchedMedia = await Promise.all(
        ids.map(async (id) => {
          let media;
          if (type === "person") {
            // Special case for fetching actor data with movie credits and external IDs
            media = await fetchDataFromTMDB(`/person/${id}?append_to_response=movie_credits,external_ids`);
          } else {
            media = await fetchDataFromTMDB(`/${type}/${id}`);
          }
          return media;
        })
      );
      return fetchedMedia.filter((item) => item); // Filter out any null/undefined values
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
      return [];
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        await deleteAccount();
        // Route to the login page or homepage after account deletion
        // For example, you might use useRouter() here to redirect
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
        <MediaGroup title="Watch Later" media={watchLater} mediaType="movie" />
      </div>
    </div>
  );
};

const MediaGroup = ({ title, media, mediaType }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {media.length === 0 ? (
        <p className="text-gray-500">No {mediaType}s to display.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4">
          {media.map((item) => (
            <li key={item.id} className="bg-gray-100 rounded-lg p-4 shadow-md transition duration-200 hover:shadow-lg">
              <div className="flex items-center">
                {mediaType === "person" ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w200${item.profile_path}`}
                    alt={item.name}
                    width={64}
                    height={96}
                    className="w-16 h-24 object-cover rounded mr-4"
                  />
                ) : (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    width={64}
                    height={96}
                    className="w-16 h-24 object-cover rounded mr-4"
                  />
                )}
                <div>
                  <h3 className="font-semibold">{item.title || item.name}</h3>
                  <p className="text-gray-500">
                    {mediaType === "person" ? "Actor" : item.release_date || item.first_air_date}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;
