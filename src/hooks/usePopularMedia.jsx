import { useState, useEffect } from 'react';
import { fetchDataFromTMDB } from '@/util/fetchDataFromTMDB';

export const usePopularMedia = (category) => {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPopularMedia() {
      setLoading(true);
      setError(null);

      let movieEndpoint = '';
      let tvEndpoint = '';

      switch (category) {
        case 'streaming':
          movieEndpoint = '/movie/popular?with_watch_monetization_types=flatrate';
          tvEndpoint = '/tv/popular?with_watch_monetization_types=flatrate';
          break;
        case 'on_tv':
          movieEndpoint = '/movie/popular';
          tvEndpoint = '/tv/popular';
          break;
        case 'for_rent':
          movieEndpoint = '/movie/popular?with_watch_monetization_types=rental';
          tvEndpoint = '/tv/popular?with_watch_monetization_types=rental';
          break;
        case 'in_theaters':
          movieEndpoint = '/movie/now_playing';
          tvEndpoint = '/tv/on_the_air';
          break;
        default:
          movieEndpoint = '/movie/popular';
          tvEndpoint = '/tv/popular';
      }

      try {
        const [moviesData, tvData] = await Promise.all([
          fetchDataFromTMDB(movieEndpoint),
          fetchDataFromTMDB(tvEndpoint)
        ]);

        if (moviesData && tvData) {
          const combinedContent = [...moviesData.results, ...tvData.results];
          // Shuffle the combined content randomly
          setMedia(combinedContent.sort(() => Math.random() - 0.5));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load media');
      } finally {
        setLoading(false);
      }
    }

    fetchPopularMedia();
  }, [category]);

  return { media, loading, error };
};