"use client";

// React-related imports
import React, { useState, useEffect } from "react";

// Next.js imports
import Link from "next/link";
import Image from "next/image";

// component 
import LoadingSpinner from "./LoadingSpinner";
import Banner from "./Banner";
import TabMenu from "./TabMenu";
import StarRating from "./StarRating";
import ReviewSection from "./ReviewSection";
import DetailsSection from "./DetailsSection";
import InteractiveButtons from "./InteractiveButtons";
import FlipCard from "./FlipCard";

// service imports
import { fetchMediaDetails } from "@/services/fetchMediaDetails";

const SingleMediaPage = ({ media, mediaType }) => {
  
  const [showFullOverview, setShowFullOverview] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [additionalData, setAdditionalData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [rated, setRated] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const fetchAdditionalData = async () => {
      if (media) {
        const data = await fetchMediaDetails(media.id, mediaType)
        setAdditionalData(data)
        setLoading(false)
      }
    }

    fetchAdditionalData()
  }, [media, mediaType])

  if (!media || loading) {
    return <LoadingSpinner />
  }

  const { videos, cast, reviews, recommendations, seasons } =
    additionalData || {}

  const formatEpisodeRuntime = (minutes) => `${minutes} min`
  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const trailer = videos?.results.find((video) => video.type === "Trailer")

  const title = media.name || media.title
  const releaseDate = media.release_date || media.first_air_date
  const tagline = media.tagline
  const runtime =
    mediaType === "movie"
      ? formatRuntime(media.runtime)
      : formatEpisodeRuntime(media.episode_run_time?.[0])
  const seasonsCount = mediaType === "tv" ? media.number_of_seasons : null

  return (
    <div className="bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
  {/* {landing -------------------------------} */}
     
      <Banner
        path={media.backdrop_path}
        tagline={tagline}
        title={title}
        releaseDate={releaseDate}
        seasonsCount={seasonsCount}
        vote_average={media.vote_average}
        runtime={runtime}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
  {/* left section ------------- */}
          <div className="lg:w-1/3">
      {/* Poster ------- */}
            <div className="sticky top-8">
              <Image
                src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
                alt={title}
                width={500}
                height={750}
                className="rounded-lg shadow-lg w-full"
              />
            </div>
          </div>
  {/* Right section ------------- */}
          <div className="lg:w-2/3">
            <div className="rounded-lg shadow-lg p-6 mb-6">
             
              <TabMenu
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                mediaType={mediaType}
              />

              <div className="mt-6">
               
                {activeTab === "overview" && (
                  <div>
                    <div className="flex justify-start">
                      <StarRating
                        rating={media.vote_average}
                        attr="text-gray-800 dark:text-yellow-400"
                        size="h-5 w-5"
                      />
                    </div>

                    <p
                      className={`text-gray-700 dark:text-gray-300 ${showFullOverview ? "" : "line-clamp-4"}`}
                    >
                      {media.overview}
                    </p>
                    {media.overview.length > 280 && (
                      <button
                        className="text-blue-600 dark:text-blue-400 hover:underline mt-2"
                        onClick={() => setShowFullOverview(!showFullOverview)}
                      >
                        {showFullOverview ? "Show less" : "Read more"}
                      </button>
                    )}

                    <InteractiveButtons
                      liked={liked}
                      setLiked={setLiked}
                      bookmarked={bookmarked}
                      setBookmarked={setBookmarked}
                      rated={rated}
                      setRated={setRated}
                      menuOpen={menuOpen}
                      setMenuOpen={setMenuOpen}
                    />

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="mt-4">
                        <h3 className="text-xl font-semibold mb-2">Rating</h3>
                        <div className=" flex gap-4 mt-4 z-30">
                          <div
                            className="circle-progress w-16 h-16 text-gray-200 "
                            role="progressbar"
                            style={{ "--progress": media.vote_average * 10 }}
                          >
                            <div className="inner ">
                              {Math.round(media.vote_average * 10)}
                              <span>x</span>
                            </div>
                          </div>
                          <h3 className="mt-6">
                            {media.vote_count} People votes
                          </h3>
                        </div>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-xl font-semibold mb-2">Genres</h3>
                        <div className="flex flex-wrap gap-2">
                          {media.genres.map((genre) => (
                            <button
                              key={genre.id}
                              className="px-3 py-1  mt-4 rounded-full text-sm font-medium text-white bg-gradient-to-r from-gray-500  to-gray-900 hover:from-gray-600  hover:to-black dark:from-orange-500 dark:to-purple-900 dark:hover:from-orange-600 dark:hover:to-purple-800 transition duration-300 ease-in-out transform hover:scale-105"
                            >
                              {genre.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg shadow-lg transition duration-500 hover:scale-105 cursor-pointer">
                        <p className="font-semibold">Rating:</p>
                        <p>{media.vote_average.toFixed(1)} / 10</p>
                      </div>

                      <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg shadow-lg transition duration-500 hover:scale-105 cursor-pointer">
                        <p className="font-semibold">
                          {mediaType === "movie"
                            ? "Release Date:"
                            : "First Air Date:"}
                        </p>
                        <p>{new Date(releaseDate).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg shadow-lg transition duration-500 hover:scale-105 cursor-pointer">
                        <p className="font-semibold">
                          {mediaType === "movie"
                            ? "Runtime:"
                            : "Episode Runtime:"}
                        </p>
                        <p>{runtime}</p>
                      </div>

                      {mediaType === "tv" && (
                        <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg shadow-lg transition duration-500 hover:scale-105 cursor-pointer">
                          <p className="font-semibold">Number of Seasons:</p>
                          <p>{media.number_of_seasons}</p>
                        </div>
                      )}
                      <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg shadow-lg transition duration-500 hover:scale-105 cursor-pointer">
                        <p className="font-semibold">Popularity:</p>
                        <p>{media.popularity.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "cast" && (
                  <div className="overflow-x-auto pb-4 scrollbar-thin dark:scrollbar-thumb-purple-900 scrollbar-track-gray-900 scrollbar-corner-gray-300 scrollbar-h-px">
                    <div className="flex space-x-4">
                      {cast?.slice(0, 10).map((person) => (
                        <Link href={`/actors/${person.id}`} key={person.id}>
                          <div
                            key={person.id}
                            className="flex-shrink-0 w-32 text-center group"
                          >
                            <div className="relative overflow-hidden rounded-lg">
                              <Image
                                src={
                                  person.profile_path
                                    ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                                    : "/placeholder-avatar.png"
                                }
                                alt={person.name}
                                width={128}
                                height={192}
                                className="transition duration-300 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition duration-300 flex items-center justify-center">
                                <p className="text-white opacity-0 group-hover:opacity-100 transition duration-300 text-sm">
                                  {person.character}
                                </p>
                              </div>
                            </div>
                            <p className="mt-2 font-semibold text-sm">
                              {person.name}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "seasons" && mediaType === "tv" && (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto">
                    {seasons?.map((season) => (
                      <div
                        key={season.id}
                        className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition duration-300"
                      >
                        <h2 className="font-semibold text-lg">{season.name}</h2>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
                          {season.overview}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Episodes: {season.episode_count}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "reviews" && 
                <ReviewSection reviews={reviews} />
                }

                {activeTab === "details" && (
                  <DetailsSection media={media} mediaType={mediaType} />
                )}
              </div>
            </div>
          </div>
        </div>

    {/* trailer and cast-----------------------  */}
        <div className="flex flex-col lg:flex-row mt-10 gap-8">

    {/* left side (Trailer) -------*/}
          <div className="lg:w-1/3">
            {trailer && (
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Trailer
                  </span>
                </h2>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-[285px] rounded-lg shadow-lg"
                  ></iframe>
                </div>
              </div>
            )}
          </div>

      {/* right side (cast) ---------------------------- */}
          <div className="lg:w-2/3">
            <h2 className="text-3xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                Cast
              </span>
            </h2>
            <div className="overflow-x-auto pb-4 scrollbar-thin dark:scrollbar-thumb-purple-900 scrollbar-track-gray-900 scrollbar-corner-gray-300 scrollbar-h-px">
              <div className="flex space-x-4">
                {cast?.slice(0, 10).map((person) => (
                  <Link href={`/actors/${person.id}`} key={person.id}>
                    <div
                      key={person.id}
                      className="flex-shrink-0 w-32 text-center group"
                    >
                      <div className="relative overflow-hidden rounded-lg">
                        <Image
                          src={
                            person.profile_path
                              ? `https://image.tmdb.org/t/p/w185${person.profile_path}`
                              : "/placeholder-avatar.png"
                          }
                          alt={person.name}
                          width={128}
                          height={192}
                          className="transition duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition duration-300 flex items-center justify-center">
                          <p className="text-white opacity-0 group-hover:opacity-100 transition duration-300 text-sm">
                            {person.character}
                          </p>
                        </div>
                      </div>
                      <p className="mt-2 font-semibold text-sm">
                        {person.name}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

    {/* New "You May Like" section -------------------*/}
      
        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              You May Like
            </span>
          </h2>
          <div className="overflow-x-auto pb-4 scrollbar-thin dark:scrollbar-thumb-purple-900 scrollbar-track-gray-900 scrollbar-corner-gray-300 scrollbar-h-px">
        <div className="flex space-x-6">
          {recommendations?.results.slice(0, 10).map((item) => (
            <FlipCard
              key={item.id}
              item={item}
              mediaType={mediaType}
              imgBaseUrl="https://image.tmdb.org/t/p/w300"
              backStyle="default"
            />
          ))}
        </div>
      </div>
    {/* End of"You May Like" section -------------------*/}

        </div>
      </div>
    </div>
  )
}

export default SingleMediaPage
