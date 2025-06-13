/* contains:
- movie's title
- movie's poster image
- movie's vote average


use the tmdb api key you obtained in milestone 0
to fetch data about "now playing" movies.
then, use the fetched movie data to populate your
 moviecard components
*/

import React from "react";
import "./MovieCard.css";

const MovieCard = ({
  movie,
  onMovieClick,
  onFavoriteClick,
  isFavorited,
  onWatchedClick,
  isWatched,
}) => {
  // Determine if poster is available
  const hasPoster = movie.poster_path !== null;

  return (
    <article
      className="movie-card"
      onClick={() => onMovieClick(movie)}
      tabIndex="0"
      role="button"
      aria-label={`View details for ${movie.title}`}
    >
      <div className="movie-card-main">
        <header>
          <h2 className="movie-title" id={`movie-title-${movie.id}`}>{movie.title}</h2>
        </header>

        <div className="movie-content">
          {hasPoster ? (
            <img
              className="movie-img"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`Movie poster for ${movie.title}`}
              loading="lazy"
            />
          ) : (
            <div className="movie-img-placeholder" aria-label="No poster available">
              No Image Available
            </div>
          )}
          <div className="movie-voting-avg" aria-label={`Rating: ${movie.vote_average} out of 10`}>
            <span aria-hidden="true">🍅</span> {movie.vote_average}
          </div>
        </div>

        <div className="movie-actions">
          <div
            className="movie-favorite"
            onClick={(e) => {
              //prevent from opening modal
              e.stopPropagation();
              onFavoriteClick(movie);
            }}
          >
            <button
              className={`favorite-btn ${isFavorited ? "favorited" : ""}`}
              aria-pressed={isFavorited}
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              Favorites <span aria-hidden="true">{isFavorited ? "❤️" : "🤍"}</span>
            </button>
          </div>

          <div
            className="watched"
            onClick={(e) => {
              e.stopPropagation();
              onWatchedClick && onWatchedClick(movie);
            }}
          >
            <button
              className={`watched-btn ${isWatched ? "watched" : ""}`}
              aria-pressed={isWatched}
              aria-label={isWatched ? "Mark as unwatched" : "Mark as watched"}
            >
              Watched <span aria-hidden="true">{isWatched ? "✓" : "+"}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
