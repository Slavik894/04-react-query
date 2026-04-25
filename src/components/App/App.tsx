import { useEffect, useState } from "react";
import type { Movie } from "../../types/movie";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./App.module.css"
import toast, { Toaster } from 'react-hot-toast';
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";
import { movieService } from "../../services/MovieService";


type ModuleWithDefault<T> = { default: T };

  const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

export default function App() {

  const [movie, setMovie] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', movie, currentPage],
    queryFn: ()=> movieService(movie, currentPage),
    enabled: movie !== "",
    placeholderData: keepPreviousData,
  });

   const totalPages = data?.total_pages ?? 0;

  const handleSearch = async (movie: string) =>{
    setMovie(movie)
    setCurrentPage(1);
  }

  const onMovieSelect=(movie: Movie)=>{
    setSelectedMovie(movie);
  }
  const closeModal = () =>{
    setSelectedMovie(null);
  }

  useEffect(()=>{
    if(isSuccess && data?.results.length === 0){
      toast.error("No movies found for your request.")
    }
  }, [isSuccess, data])

return(
    <div className={styles.app}>
      <div><Toaster/></div>
    <SearchBar 
      onSubmit={handleSearch} />
  
    {isSuccess && totalPages > 1 && 
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={3}
      marginPagesDisplayed={3}
      onPageChange={({selected})=>setCurrentPage(selected + 1)}
      forcePage={currentPage - 1}
      nextLabel=">"
      previousLabel="<"
      containerClassName={styles.pagination}
      activeClassName={styles.active}
    />}
    {isLoading && <Loader/>}
    {isError && <ErrorMessage />}
    {data && data.results.length > 0 && <MovieGrid onSelect={onMovieSelect} movies={data.results}/>}
    {selectedMovie && (<MovieModal movie={selectedMovie} onClose={closeModal}/>)}
    
    
  </div>
  )}