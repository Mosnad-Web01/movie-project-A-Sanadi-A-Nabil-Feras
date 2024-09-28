// services/mediaServices.js

export const getTrendingEndpoint = (type) => `/trending/movie/${type}`;

export const getPopularEndpoint = (category) => {
  switch (category) {
    case 'streaming': return '/movie/popular?with_watch_monetization_types=flatrate';
    case 'on_tv': return '/tv/popular';
    case 'for_rent': return '/movie/popular?with_watch_monetization_types=rental';
    case 'in_theaters': return '/movie/now_playing';
    default: return '/movie/popular';
  }
};

export const getFreeToWatchEndpoint = (category) => 
  `/discover/${category}?with_watch_monetization_types=free`;

export const getMediaLink = (item) => 
  item.name ? `/tv/${item.id}` : `/movie/${item.id}`;

export const getMediaTitle = (item) => 
  item.title || item.name;

export const getMediaReleaseDate = (item) => 
  item.release_date || item.first_air_date;