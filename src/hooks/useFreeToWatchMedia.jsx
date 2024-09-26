import { useState, useEffect } from 'react';
import { fetchDataFromTMDB } from '@/util/fetchDataFromTMDB'; 

export const useFreeToWatchMedia = (category) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchFreeToWatchMedia() {
      setLoading(true);
      setError(null);

      // Define correct paths for movies and TV shows
      let moviePath = `/discover/movie?with_watch_monetization_types=free`; // Correct path for free movies
      let tvPath = `/discover/tv?with_watch_monetization_types=free`; // Correct path for free TV shows

      try {
        let moviesData = [];
        let tvData = [];

        // Conditionally fetch based on category
        if (category === 'movies') {
          moviesData = await fetchDataFromTMDB(moviePath);
        } else if (category === 'tv') {
          tvData = await fetchDataFromTMDB(tvPath);
        } else {
          // Fetch both if no specific category is provided
          [moviesData, tvData] = await Promise.all([
            fetchDataFromTMDB(moviePath),
            fetchDataFromTMDB(tvPath),
          ]);
        }

        // Combine the results from both responses
        const combinedResults = [
          ...(moviesData?.results || []),
          ...(tvData?.results || []),
        ];

        setMedia(combinedResults);
      } catch (err) {
        setError('Failed to load media');
      } finally {
        setLoading(false);
      }
    }

    fetchFreeToWatchMedia();
  }, [category]);

  return { media, loading, error };
};
