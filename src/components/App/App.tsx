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
import ReactPaginate from "react-paginate";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Pagination from "../Pagination/Pagination";


export default function App() {

  const [movie, setMovie] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1)

  const { data, error, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', movie, currentPage],
    queryFn: ()=> MovieService(movie, currentPage),
    enabled: movie !== "",
    placeholderData: keepPreviousData,
  });

   const totalPages = data?.total_page ?? 0;
    console.log(totalPages);



  const handleSearch = async (movie: string) =>{
    setMovie(movie)
    setCurrentPage(1);
    // try{
    //   setMovies([]);
    //   const data = await MovieService(query, page);
    //   if(data.length === 0){
    //     setIsLoading(false);
    //     toast.error("No movies found for your request.");
    //     return;
    //   }
    //   setMovies(data);
    // }
    // catch {
    //   setIsError(true);
    // }
    // finally{
    //   setIsLoading(false);
    // }

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

    {isSuccess && totalPages > 1 && (<Pagination 
      totalPages={totalPages}
      currentPage={currentPage}
      onPageChange={setCurrentPage}
    />)}
    {isLoading && <Loader/>}
    {isError && <ErrorMessage />}
    {data?.results.length === 0 && toast.error("No movies found for your request.")}
    {data && data.results.length > 0 && <MovieGrid onSelect={onMovieSelect} movies={data.results}/>}
    {selectedMovie && (<MovieModal movie={selectedMovie} onClose={closeModal}/>)}
    
  </div>
  )}