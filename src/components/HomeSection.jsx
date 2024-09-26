"use client";

import MediaSection from "./MediaSection";
import { useTrendingMovies } from "@/hooks/useTrendingMovies";
import { usePopularMedia } from "@/hooks/usePopularMedia";
import { useFreeToWatchMedia } from "@/hooks/useFreeToWatchMedia";

const HomeSection = () => {
  // Trending Section Logic
  const trendingOptions = [
    { value: "day", label: "Today" },
    { value: "week", label: "This Week" },
  ];
  const useTrendingMediaWrapper = (trendingType) => {
    const { movies, loading, error } = useTrendingMovies(trendingType);
    return { media: movies, loading, error };
  };

  // What's Popular Section Logic
  const popularCategories = [
    { label: "Streaming", value: "streaming" },
    { label: "On TV", value: "on_tv" },
    { label: "For Rent", value: "for_rent" },
    { label: "In Theaters", value: "in_theaters" },
  ];

  // Free To Watch Section Logic
  const freeToWatchCategories = [
    { label: "Movies", value: "movies" },
    { label: "TV", value: "tv" },
  ];

  return (
    <div className=" flex flex-col gap-12 min-h-screen"> 
      {/* Trending Section */}
      <MediaSection
        title="Trending"
        toggleOptions={trendingOptions}
        useMediaHook={useTrendingMediaWrapper}
        initialCategory="day"
      />

      {/* What's Popular Section */}
      <MediaSection
        title="What's Popular"
        toggleOptions={popularCategories}
        useMediaHook={usePopularMedia}
        initialCategory="streaming"
      />

      {/* Free To Watch Section */}
      <MediaSection
        title="Free To Watch"
        toggleOptions={freeToWatchCategories}
        useMediaHook={useFreeToWatchMedia}
        initialCategory="movies"
      />
    </div>
  );
};

export default HomeSection;
