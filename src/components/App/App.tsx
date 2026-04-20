import { useState } from "react";
import type { Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./App.module.css"
import toast, { Toaster } from 'react-hot-toast';
import { MovieService } from "../../services/movieService";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";


export default function App() {

  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) =>{
    setIsError(false);
    setIsLoading(true);
    try{
      setMovies([]);
      const data = await MovieService(query);
      if(data.length === 0){
        setIsLoading(false);
        toast.error("No movies found for your request.");
        return;
      }
      setMovies(data);
    }
    catch {
      setIsError(true);
    }
    finally{
      setIsLoading(false);
    }

  }

  const onMovieSelect=(movie: Movie)=>{
    setSelectedMovie(movie);
  }
  const closeModal = () =>{
    setSelectedMovie(null);
  }

return(
    <div className={styles.app}>
      <div><Toaster/></div>
    <SearchBar onSubmit={handleSearch} />
    {isLoading && <Loader />}
    {movies.length>0 && !isLoading && (
      <MovieGrid movies={movies} onSelect={onMovieSelect}/>)}
    {isError && (<ErrorMessage />)}
    {selectedMovie && (<MovieModal movie={selectedMovie} onClose={closeModal}/>)}
    
    
  </div>
  )}