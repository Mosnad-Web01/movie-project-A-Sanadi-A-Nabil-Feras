import { useState, useEffect } from 'react';

import { fetchDataFromTMDB } from '@/util/fetchDataFromTMDB';

export const useTrendingMovies = (trendingType) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTrendingMovies() {
      setLoading(true);
      setError(null);
      const data = await fetchDataFromTMDB(`/trending/movie/${trendingType}`);
      if (data) {
        setMovies(data.results);
      } else {
        setError('Failed to load trending movies');
      }
      setLoading(false);
    }
    fetchTrendingMovies();
  }, [trendingType]);

  return { movies, loading, error };
};
