import Link from "next/link";
import Image from "next/image";

const MediaGroup = ({ title, media, mediaType }) => {
  const getLinkPath = (item) => {
    switch (mediaType) {
      case "movie":
        return `/movie/${item.id}`;
      case "tv":
        return `/tv/${item.id}`;
      case "person":
        return `/actors/${item.id}`;
      case "watchLater":
        return item.type === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;
      default:
        return "#";
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">{title}</h2>
      {media.length === 0 ? (
        <p className="text-gray-500">No {mediaType === "watchLater" ? "items" : `${mediaType}s`} to display.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-4">
          {media.map((item) => (
            <li key={item.id} className="bg-gray-100 rounded-lg shadow-md transition duration-200 hover:shadow-lg">
              <Link href={getLinkPath(item)} className="block">
                <div className="p-4 flex items-center">
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${item.profile_path || item.poster_path}`}
                    alt={item.name || item.title}
                    width={64}
                    height={96}
                    className="w-16 h-24 object-cover rounded mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{item.name || item.title}</h3>
                    <p className="text-gray-500">
                      {mediaType === "person"
                        ? "Actor"
                        : mediaType === "watchLater"
                        ? item.type === "movie" ? "Movie" : "TV Show"
                        : item.release_date || item.first_air_date}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MediaGroup;