import { useState, useEffect } from "react";
import "./App.css";
//import data from './data/data'
import MovieList from "./MovieList";
import LoadMore from "./LoadMore";

const API_KEY = import.meta.env.VITE_API_KEY;

const App = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    getMovies();
  }, []);

  // useEffect(() => {
  //   console.log({ movies });
  // }, [movies]);

  const getMovies = async () => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`
      );

      const data = await response.json();
      setMovies(data.results);
      console.log("1. ", data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  return (
    <div className="App">
      <header>
        <h1 className="App-header">Flixster</h1>
      </header>
      <section className="movie-list-container">
        <MovieList movies={movies} />
      </section>

      <section className="load-btn-container">
        <LoadMore />
      </section>
    </div>
  );
};

export default App;
