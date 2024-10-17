import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const MediaCard = ({ imageUrl, title, voteAverage, releaseDate, link, mediaType }) => {
  return (
    <Link href={link}>
      <div className="inline-flex flex-col justify-evenly px-1 rounded-b-2xl py-2 mr-5 w-44 transform transition-transform hover:scale-105 hover:shadow-2xl h-96 cursor-pointer mt-4">
        <div className="relative">
          <Image
            src={imageUrl}
            alt={title}
            width={150}
            height={225}
            className="mb-2 rounded-2xl w-full"
          />

          {/* Circular Progress Bar (Only for movies and TV shows) */}
          {mediaType !== 'person' && voteAverage>=0  && (
            <div className="absolute bottom-2 left-2 z-30">
              <div
                className="circle-progress w-14 h-14 text-gray-200"
                role="progressbar"
                style={{ '--progress': voteAverage * 10 }}
              >
                <div className="inner">
                  {Math.round(voteAverage * 10)}
                  <span>%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-4">
          {/* Title */}
          <h3
            className="text-lg font-semibold mt-2 dark:text-white text-left break-words line-clamp-2"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
              overflow: 'hidden',
            }}
          >
            {title}
          </h3>

          {/* Release Date (Only for movies and TV shows) */}
          {mediaType !== 'person' && (
            <p className="text-gray-400 text-left block text-lg font-thin">
              {releaseDate
                ? new Date(releaseDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'Unknown Release Date'}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default MediaCard;
