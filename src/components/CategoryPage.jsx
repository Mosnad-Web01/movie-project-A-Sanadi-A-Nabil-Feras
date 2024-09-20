
import React from "react"
import CardFrontSide from "./CardFrontSide"
const imgBaseUrl = "https://image.tmdb.org/t/p/w500"

// Helper function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
}

// Component to display the list of movies and tv shows in a category page
const CategoryPage = ({ pageTitle, shows, categoryId }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Category Title */}
      <h1 className="text-3xl font-bold mb-8 text-center text-[#032541]">
        {pageTitle === "tv" ? "TV Shows" : "Movies"} in{" "}
        {capitalizeFirstLetter(categoryId.replace(/-/g, " "))} Category
      </h1>

      <div className="grid grid-cols-12 gap-4">
        {/* Filter Options Section */}
        <div className="col-span-12 lg:col-span-3 bg-gray-100">
          <div className="filter-options">
            <p className="text-center text-black">
              Filter Options (Coming Soon)
            </p>
          </div>
        </div>

        {/* Show Grid Section */}
        <div className="col-span-12 lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {shows?.length > 0 ? (
              shows.map((show) => (
                <CardFrontSide
                  key={show.id}
                  data={show}
                  imgBaseUrl={imgBaseUrl}
                  link={`/${pageTitle}/${show.id}`} // assuming title refers to pageTitle
                />
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No shows found
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryPage

