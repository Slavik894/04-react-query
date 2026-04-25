import type { Movie } from "../types/movie"
import axios from "axios";
axios.defaults.baseURL="https://api.themoviedb.org/3";

interface MoviesHttpResponse{
    results: Movie[];
    total_pages: number;
};

const myToken = import.meta.env.VITE_API_TOKEN;

export const MovieService = async (movie: string, page: number) =>{
      const response = await axios.get<MoviesHttpResponse>(`/search/movie`, {
            params:{
                query: movie,
                page
                
            },
            headers: {
            Authorization: `Bearer ${myToken}`
  }
        });
      return response.data;
  };