import type { Movie } from "../types/movie"
import axios from "axios";
axios.defaults.baseURL="https://api.themoviedb.org/3";



interface MoviesHttpResponse{
    results: Movie[];
};

const myToken = import.meta.env.VITE_API_TOKEN;

export const MovieService = async (query: string): Promise<Movie[]> =>{
      const response = await axios.get<MoviesHttpResponse>(`/search/movie`, {
            params:{
                query
            },
            headers: {
            Authorization: `Bearer ${myToken}`
  }
        });
      return response.data.results;
  };