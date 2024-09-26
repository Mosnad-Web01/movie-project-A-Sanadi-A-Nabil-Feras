"use client";

  import React, { useState } from 'react';

//components
  import ToggleSwitch from './ToggleSwitch';
  import MediaCard from './MediaCard';
  import MediaCardPlaceholder from './MediaCardPlaceholder';
  import HorizontalSlider from './HorizontalSlider';

const MediaSection = ({ 
  title, 
  toggleOptions, 
  useMediaHook, 
  initialCategory 
}) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const { media = [], loading, error } = useMediaHook(selectedCategory) || {};

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="container mx-auto font-custom px-4">
      <div className="media-section">
        <div className="toggle-switch flex items-center gap-4 mb-2">
          <h2 className="text-2xl font-bold pl-4">{title}</h2>
          <ToggleSwitch
            options={toggleOptions}
            selectedOption={selectedCategory}
            onChange={handleCategoryChange}
          />
        </div>

        {loading ? (
          <HorizontalSlider>
            {[...Array(8)].map((_, index) => (
              <MediaCardPlaceholder key={index} />
            ))}
          </HorizontalSlider>
        ) : media && media.length > 0 ? (
          <HorizontalSlider>
            {media.map((item) => {
              const link = item.name ? `/tv/${item.id}` : `/movie/${item.id}`;
              return (
                <MediaCard
                  key={item.id}
                  imageUrl={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  title={item.title || item.name}
                  voteAverage={item.vote_average}
                  releaseDate={item.release_date || item.first_air_date}
                  link={link}
                />
              );
            })}
          </HorizontalSlider>
        ) : (
          <p>No media available.</p>
        )}

        {error && <p className="text-red-500">Failed to load media: {error}</p>}
      </div>
    </div>
  );
};

export default MediaSection;