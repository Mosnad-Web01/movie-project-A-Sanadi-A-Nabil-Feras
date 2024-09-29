
import { fetchDataFromTMDB } from "@/util/fetchDataFromTMDB";


    export const fetchGenres = async () => {
    try {
        const data = await fetchDataFromTMDB('/genre/movie/list');
        // console.log("data generce from TMDB",data)
        return data.genres.map(genre => genre.name);  // Return only genre names
    } catch (error) {
        console.error(`Error fetching Movie genres:`, error);
        return [];
    }
    };