"use client"

// React-related imports
import React, { useState, useEffect, Suspense } from "react"

// Next.js imports
import Link from "next/link"
import Image from "next/image"

// component
import LoadingSpinner from "./LoadingSpinner"
import Banner from "./Banner"
import TabMenu from "./TabMenu"
import MediaOverview from "./MediaOverview"
import ReviewSection from "./ReviewSection"
import Seasons from "./Seasons"
import DetailsSection from "./DetailsSection"
import Cast from "./Cast"
import FlipCard from "./FlipCard"

// service and util imports
import { fetchMediaDetails } from "@/services/fetchMediaDetails"
import { getImageUrl, IMAGE_TYPES } from "@/util/tmdbImageConstants"
import { placeholderImg } from "@/util/local-ImageConstants"
import { formatRuntime, formatEpisodeRuntime } from "@/services/format"

const SingleMediaPage = ({ media, mediaType }) => {
  const [activeTab, setActiveTab] = useState("overview")
  const [additionalData, setAdditionalData] = useState(null)
  const [loading, setLoading] = useState(true)
  // state to manage the image source for handling error by setting placeholderImg
  const [imgSrc, setImgSrc] = useState(
    getImageUrl("POSTER", "LARGE", media.poster_path),
  )

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
    <div className="bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition-colors duration-300">
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
                <div className="sticky top-8"> {/* Poster*/}
                  <Suspense fallback={<LoadingSpinner />}>
                    <Image
                      src={imgSrc}
                      alt={title}
                      width={500}
                      height={750}
                      className="rounded-lg shadow-lg w-full"
                      onError={() => setImgSrc(placeholderImg)}
                    />
                  </Suspense>
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
                  <MediaOverview
                    activeTab={activeTab}
                    media={media}
                    mediaType={mediaType}
                    releaseDate={releaseDate}
                    runtime={runtime}
                    seasonsCount={seasonsCount}
                  />
                )}

                {activeTab === "cast" && (
                  <Cast cast={cast} mediaType={mediaType} />
                )}

                {activeTab === "seasons" && mediaType === "tv" && (
                  <Seasons seasons={seasons} />
                )}

                {activeTab === "reviews" && <ReviewSection reviews={reviews} />}

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
     
            <Cast cast={cast} />
          </div>
        </div>

        {/* New "You May Like" section -------------------*/}

        <div className="mt-16">
          <h2 className="text-3xl font-bold mb-6 text-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              You May Like
            </span>
          </h2>
          <div className="overflow-x-auto pb-4 scrollbar-thin dark:scrollbar-thumb-purple-900 scrollbar-track-gray-900 scrollbar-corner-gray-300 scrollbar-h-px transition-colors duration-300">
            <div className="flex space-x-6">
              {recommendations?.results.slice(0, 10).map((item) => (
                <FlipCard
                  key={item.id}
                  item={item}
                  mediaType={mediaType}
                  size={IMAGE_TYPES.POSTER.ORIGINAL} //w300
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
