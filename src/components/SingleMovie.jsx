"use client"
import React, { useState, useEffect } from "react"
import Image from "next/image"
import { fetchMovieDetails } from "@/services/fetchMovieDetails"
import LoadingSpinner from "@/components/LoadingSpinner"
import Link from "next/link"


const SingleMovie = ({ movie }) => {
  const [showFullOverview, setShowFullOverview] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [additionalData, setAdditionalData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdditionalData = async () => {
      if (movie) {
        const data = await fetchMovieDetails(movie.id)
        setAdditionalData(data)
        setLoading(false)
      }
    }

    fetchAdditionalData()
  }, [movie])

  if (!movie || loading) {
    return <LoadingSpinner />
  }

  const { videos, cast, reviews, recommendations } = additionalData || {}

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  const trailer = videos?.results.find((video) => video.type === "Trailer")

  return (
    <div className="bg-gray-200 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
      <div className="relative h-96 md:h-[80vh] ">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          layout="fill"
          objectFit="cover"
          className="  opacity-100 dark:opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-200 dark:from-gray-900 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{movie.title}</h1>
          <p className="text-xl mb-2">{movie.tagline}</p>
          <div className="flex items-center space-x-4 text-sm">
            <span>{movie.release_date.split("-")[0]}</span>
            <span>•</span>
            <span>{formatRuntime(movie.runtime)}</span>
            <span>•</span>
            <span className="flex items-center">
              {Array(Math.floor(movie.vote_average / 2))
                .fill(0)
                .map((_, i) => (
                  <span key={i} className="text-yellow-500">
                    ⭐
                  </span>
                ))}
              {movie.vote_average.toFixed(1)} / 10
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={500}
              height={750}
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-2/3">
            <div className="mb-6">
              <div className="flex space-x-4 mb-4">
                <button
                  className={`px-4 py-2 rounded transition duration-300 ${
                    activeTab === "overview"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
                <button
                  className={`px-4 py-2 rounded transition duration-300 ${
                    activeTab === "cast"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => setActiveTab("cast")}
                >
                  Cast
                </button>
                <button
                  className={`px-4 py-2 rounded transition duration-300 ${
                    activeTab === "reviews"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews
                </button>
              </div>

              {activeTab === "overview" && (
                <div>
                  <p
                    className={`text-gray-700 dark:text-gray-300 ${
                      showFullOverview ? "" : "line-clamp-4"
                    }`}
                  >
                    {movie.overview}
                  </p>
                  {movie.overview.length > 280 && (
                    <button
                      className="text-blue-600 dark:text-blue-400 hover:underline mt-2"
                      onClick={() => setShowFullOverview(!showFullOverview)}
                    >
                      {showFullOverview ? "Show less" : "Read more"}
                    </button>
                  )}
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold mb-2">Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {movie.genres.map((genre) => (
                        <span
                          key={genre.id}
                          className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm cursor-pointer"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Release Date:</p>
                      <p>{new Date(movie.release_date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Runtime:</p>
                      <p>{formatRuntime(movie.runtime)}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Rating:</p>
                      <div className="flex gap-2"> 
                      <span className="flex items-center">
                        {Array(Math.floor(movie.vote_average / 2))
                          .fill(0)
                          .map((_, i) => (
                            <span key={i} className="text-yellow-500 ">
                              ⭐
                            </span>
                          ))}
                       
                      </span>
                      <span className=" font-bold">{movie.vote_average.toFixed(1)} / 10</span>

                      </div>
            
                     
                    </div>
                    <div>
                      <p className="font-semibold">Genres:</p>
                      <p>
                        {movie.genres.map((genre) => genre.name).join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "cast" && (
                <div className="overflow-x-auto pb-4 scrollbar-thin dark:scrollbar-thumb-gray-700 scrollbar-track-gray-900 scrollbar-corner-gray-300 scrollbar-h-px">
                  <div className="flex space-x-6">
                    {cast?.slice(0, 10).map((person) => (
                 
                       <Link href={`/actors/${person.id}`} key={person.id}>
                             <div
                        key={person.id}
                        className="flex-shrink-0 w-32 text-center group"
                      >
                        <div className="relative  w-24 h-36 bg-gray-200 rounded-lg overflow-hidden cursor-pointer">
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
                          <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-50 transition duration-300 flex items-center justify-center">
                            <p className="text-gray-200 opacity-0 group-hover:opacity-100 transition duration-300 text-sm">
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
              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {reviews?.results.slice(0, 3).map((review) => (
                    <div
                      key={review.id}
                      className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-xl font-bold mr-4">
                          {review.author_details.username
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-lg">
                            {review.author}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(review.created_at).toLocaleDateString(
                              undefined,
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                        {review.content}
                      </p>
                      <button className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm">
                        Read more
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {trailer && (
              <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-4">Trailer</h2>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                </div>
              </div>
            )}
          </div>
        </div>

        {recommendations && recommendations.results.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">You may also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
              {recommendations.results.slice(0, 7).map((movie) => (
       <Link href={`/movie/${movie.id}`} key={movie.id}>
               <div key={movie.id} className="text-center">
                  <Image
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    width={150}
                    height={225}
                    className="rounded-lg mx-auto"
                  />
                  <p className="mt-2 font-semibold">{movie.title}</p>
                </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SingleMovie
