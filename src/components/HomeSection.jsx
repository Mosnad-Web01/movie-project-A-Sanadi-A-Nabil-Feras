// HomeSection.jsx
"use client";

import React from 'react';
import MediaSection from './MediaSection';
import { getTrendingEndpoint, getPopularEndpoint, getFreeToWatchEndpoint } from '../services/mediaServices';

const HomeSection = () => {
  return (
    <div className="flex flex-col gap-12 min-h-screen">
      <MediaSection
        title="Trending"
        toggleOptions={[
          { value: "day", label: "Today" },
          { value: "week", label: "This Week" },
        ]}
        endpoint={getTrendingEndpoint}
        initialCategory="day"
      />
      <MediaSection
        title="What's Popular"
        toggleOptions={[
          { label: "Streaming", value: "streaming" },
          { label: "On TV", value: "on_tv" },
          { label: "For Rent", value: "for_rent" },
          { label: "In Theaters", value: "in_theaters" },
        ]}
        endpoint={getPopularEndpoint}
        initialCategory="streaming"
      />
      <MediaSection
        title="Free To Watch"
        toggleOptions={[
          { label: "Movies", value: "movie" },
          { label: "TV", value: "tv" },
        ]}
        endpoint={getFreeToWatchEndpoint}
        initialCategory="movie"
      />
    </div>
  );
};

export default HomeSection;