/*
This component will act like a container. It will be the foundation for displaying a whole list of movies (search results, "now playing" movies, etc.). Its job might include:

Fetching movie data from the TMDb API
Looping through the fetched data and creating a MovieCard component for each individual movie
Arranging all the MovieCard components nicely on the screen
*/

import React from "react";
import MovieCard from "./MovieCard";
import "./MovieList.css";

const MovieList = ({ movies, onMovieClick, onFavoriteClick, favoritedMovies, onWatchedClick, watchedMovies }) => {
  return (
    <div className="movie-list">
      {movies.map((movie) => (
        <MovieCard
          movie={movie}
          key={movie.id}
          onMovieClick={onMovieClick}
          onFavoriteClick={onFavoriteClick}
          isFavorited={favoritedMovies?.some(favMovie => favMovie.id === movie.id)}
          onWatchedClick={onWatchedClick}
          isWatched={watchedMovies?.some(watchedMovie => watchedMovie.id === movie.id)}
        />
      ))}
    </div>
  );
};

// notes for MovieList component:
// data.results is the array of movies from the data.js file
// for each movie it creates a MovieCard component
// pass in the entire movie component
// give each component a unique id (requried by react for lists)

export default MovieList;
