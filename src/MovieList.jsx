/*
This component will act like a container. It will be the foundation for displaying a whole list of movies (search results, "now playing" movies, etc.). Its job might include:

Fetching movie data from the TMDb API
Looping through the fetched data and creating a MovieCard component for each individual movie
Arranging all the MovieCard components nicely on the screen
*/

import React from "react";
import MovieCard from './MovieCard'
import './MovieList.css';
import data from './data/data';

const MovieList = () => {
    return (
        <div className="movie-list">

            {data.results.map(movie => (
                <MovieCard movie={movie} key={movie.id} />

            ))}
        </div>
    );
} // COME BACK FOR STEP 3 NOW PLAYING

export default MovieList;

// notes for MovieList component:
// data.results is the array of movies from the data.js file
// for each movie it creates a MovieCard component
// pass in the entire movie component
// give each componene a unique id (requried by react for lists)
/*alternative option"

*/
