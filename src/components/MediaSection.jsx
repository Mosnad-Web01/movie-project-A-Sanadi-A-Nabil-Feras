// MediaSection.jsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import ToggleSwitch from './ToggleSwitch';
import MediaCard from './MediaCard';
import MediaCardPlaceholder from './MediaCardPlaceholder';
import HorizontalSlider from './HorizontalSlider';
import { getImageUrl } from '@/util/tmdbImageConstants';
import { fetchDataFromTMDB } from '@/util/fetchDataFromTMDB';
import { getMediaLink, getMediaTitle, getMediaReleaseDate } from '../services/mediaServices';

const MediaSection = ({ title, toggleOptions, endpoint, initialCategory }) => {
  // State for the selected category (e.g., "day" or "week" for trending)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  // State for media data, loading status, and error handling
  const [state, setState] = useState({
    media: [],
    loading: true,
    error: null
  });

  // Effect to fetch media data when the category changes
  useEffect(() => {
    const fetchMedia = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      try {
        const data = await fetchDataFromTMDB(endpoint(selectedCategory));
        setState(prev => ({ ...prev, media: data.results, loading: false }));
      } catch (error) {
        setState(prev => ({ ...prev, error: 'Failed to load media', loading: false }));
      }
    };
    fetchMedia();
  }, [endpoint, selectedCategory]);

  // Callback for handling category change
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  // Destructure state for easier use in JSX
  const { media, loading, error } = state;

  return (
    <div className="container mx-auto font-custom px-4">
      <div className="media-section">
        {/* Title and Toggle Switch */}
        <div className="toggle-switch flex items-center gap-4 mb-2">
          <h2 className="text-2xl font-bold pl-4">{title}</h2>
          <ToggleSwitch
            options={toggleOptions}
            selectedOption={selectedCategory}
            onChange={handleCategoryChange}
          />
        </div>

        {/* Media Content */}
        {loading ? (
          // Show placeholders while loading
          <HorizontalSlider>
            {[...Array(8)].map((_, index) => (
              <MediaCardPlaceholder key={index} />
            ))}
          </HorizontalSlider>
        ) : media && media.length > 0 ? (
          // Show media cards if data is available
          <HorizontalSlider>
            {media.map((item) => (
              <MediaCard
                key={item.id}
                imageUrl={getImageUrl("POSTER", "w500", item.poster_path)}
                title={getMediaTitle(item)}
                voteAverage={item.vote_average}
                releaseDate={getMediaReleaseDate(item)}
                link={getMediaLink(item)}
              />
            ))}
          </HorizontalSlider>
        ) : (
          // Show message if no media is available
          <p>No media available.</p>
        )}

        {/* Error message */}
        {error && <p className="text-red-500">Failed to load media: {error}</p>}
      </div>
    </div>
  );
};

export default MediaSection;