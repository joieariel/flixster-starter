import { useState, useEffect } from "react";
import "./App.css";
//import data from './data/data'
import MovieList from "./MovieList";
import LoadMore from "./LoadMore";
import SearchBar from "./SearchBar";

const API_KEY = import.meta.env.VITE_API_KEY;

const App = () => {
  //state for storing all movies from all pages
  const [movies, setMovies] = useState([]);

  //state for current page/ starts @ 1 for the first API request
  const [currentPage, setCurrentPage] = useState(1);

  // state for if there are more movies to load
  const [hasMoreMovies, setHasMoreMovies] = useState(true);

  useEffect(() => {
    getMovies(currentPage); // runs once when first page is loaded
  }, []);

  //pagination
  const getMovies = async (page) => {
    try {
      // append &page=${page} to the API URL as instructed
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`
      );

      const data = await response.json();

      // check if there are any new movies, if not there are no more to load
      if (data.results.length === 0) {
        setHasMoreMovies(false);
        return;
      }

      // once new movies are fetched, add them to already displayed movies
      if (page === 1) {
        // page === 1 means inital batch of movies (page 1)
        // set movies direectly for the first page
        setMovies(data.results);
      } else {
        // for other pages, append new movies to existing list
        setMovies((prevMovies) => [...prevMovies, ...data.results]);
      }
    } catch (error) {
      console.error("Error fetching movies: ", error);
    }
  };

  const handleLoadMore = () => {
    //increments page number
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    getMovies(nextPage);
  };

  return (
    <div className="App">
      <header>
        <h1 className="App-header">
          Flixster
          <SearchBar />
        </h1>
      </header>
      <section className="movie-list-container">
        <MovieList movies={movies} />
      </section>

      <section className="load-btn-container">
        {/* pass handleLoadMore to the component */}
        <LoadMore onLoadMore={handleLoadMore} hasMore={hasMoreMovies} />
      </section>
    </div>
  );
};

export default App;
