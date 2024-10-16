import CategoryPage from "@/components/CategoryPage";
import { formatCategoryForAPI } from "@/services/formatCategoryForAPI";
import { fetchDataFromTMDB } from "@/util/fetchDataFromTMDB";
import SingleMediaPage from "@/components/SingleMediaPage"; // Shared component

const MoviePage = async ({ params }) => {
  const { id } = params;
  const categories = ['popular', 'top-rated', 'upcoming', 'now-playing'];

  // Determine if the id is a category or a single movie
  const isCategory = categories.includes(id);

  // Fetch data based on the category or single movie
  const endpoint = isCategory 
    ? `/movie/${await formatCategoryForAPI(id)}` 
    : `/movie/${id}`;

  try {
    const data = await fetchDataFromTMDB(endpoint);

    // If it's a category page, show multiple movies
    if (isCategory) {
      return (
        <CategoryPage pageTitle="movie" shows={data.results} categoryId={id} />
      );
    }

    // If it's a single movie, show the SingleMediaPage component
    if (data) {
      return <SingleMediaPage media={data} mediaType="movie" />; // Pass movie data and type
    } else {
      return <div>No movie found</div>;
    }

  } catch (error) {
    console.error('Error fetching movie data:', error);
    return <div>Error loading data. Please try again later.</div>;
  }
};

export default MoviePage;
