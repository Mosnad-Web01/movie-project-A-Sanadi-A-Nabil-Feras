const MediaCardPlaceholder = () => {
  return (
    <div className="inline-flex flex-col justify-end px-1 py-2 mt-6 mx-4 w-48 h-[400px] cursor-pointer animate-pulse transform transition-transform hover:scale-105">
      {/* Placeholder for the image */}
      <div className="bg-gray-300 rounded-2xl w-full h-[280px] mb-4 shimmer"></div>
      
      {/* Placeholder for the title */}
      <div className="px-4 flex-grow">
        <div className="bg-gray-300 h-5 w-3/4 mb-3 rounded"></div>

        {/* Placeholder for release date */}
        <div className="bg-gray-300 h-4 w-1/2 rounded"></div>
      </div>
    </div>
  );
};

export default MediaCardPlaceholder;
