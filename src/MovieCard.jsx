/* contains:
- movie's title
- movie's poster image
- movie's vote average


Use the TMDb API key you obtained in Milestone 0
to fetch data about "now playing" movies.
Then, use the fetched movie data to populate your
 MovieCard components
*/

import React from "react";
import './MovieCard.css';
import data from './data/data.js';

const MovieCard = ({ movie} ) => { // use destructing
    return (
        <div className="movie-card">
            <h2 className="movie-title">{movie.title}</h2>
            {/* note for img tag: needed to construct full image URL TMDB API only provides partial path in poster_path
            - this creates the full link to the movie poster image
            - base URL (w500 = width 500px) + movie-specific image path*/}
            <section className="movie-content">
            <img className="movie-img" src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
            <h3 className="movie-voting-avg">🍅 {movie.vote_average}</h3>
            </section>
        </div>

    );
}

export default MovieCard;
