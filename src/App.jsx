import { useState, useEffect } from "react";
import "./App.css";
import MovieList from "./MovieList";
import LoadMore from "./LoadMore";
import SearchBar from "./SearchBar";
import Modal from "./Modal";
import Sort from "./Sort";
import Banner from "./Banner";

// genre mapping based on TMDB genre IDs (alphabetical)
const genreMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const API_KEY = import.meta.env.VITE_API_KEY;

const App = () => {
  //state for storing all movies from all pages
  const [movies, setMovies] = useState([]);

  // tracks which page of results we're currently on, starting at 1
  const [currentPage, setCurrentPage] = useState(1);

  // controls whether the "load more" button should be displayed
  const [hasMoreMovies, setHasMoreMovies] = useState(true);

  // states that track search-related information
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // state tracks if a search returned no results
  const [noResults, setNoResults] = useState(false);

  // state tracks if the modal is open or not
  const [isOpen, setIsOpen] = useState(false);
  // state to store the selected movie for the modal
  const [selectedMovie, setSelectedMovie] = useState(null);
  // state to track the current sort method
  const [sortMethod, setSortMethod] = useState("none");
  // state to store the YouTube trailer URL for the selected movie
  const [trailerUrl, setTrailerUrl] = useState("");
  // state to track if trailer video is currently being shown in the modal
  const [showTrailer, setShowTrailer] = useState(false);

  // state to track favorited movies array
  const [favoritedMovies, setFavoritedMovies] = useState([]);

  // state to track watched movies array
  const [watchedMovies, setWatchedMovies] = useState([]);

  useEffect(() => {
    //only fetch now playing movies when not searching
    if (!isSearching) {
      getMovies(currentPage); // runs when component mounts or when isSearching changes to false
    }
  }, [isSearching, currentPage]);

  // fetches a specific page of "now playing" movies from tmdb api
  const getMovies = async (page) => {
    try {
      // make api request and append &page=${page} to the API URL as instructed
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`
      );
      //parse JSON response
      const data = await response.json();

      // hide button when we've reached the end of available movies
      if (data.results.length === 0) {
        setHasMoreMovies(false);
        return;
      }

      if (page === 1) {
        // set movies directly for the first page
        setMovies(data.results);
      } else {
        // append new movies to existing list for pagination
        setMovies((prevMovies) => [...prevMovies, ...data.results]);
      }
    } catch (error) {
      console.error("Error fetching movies: ", error);
    }
  };

  const handleSearch = async (query) => {
    // save the search query
    setSearchQuery(query);

    // if search query is empty, show now playing movies
    if (!query.trim()) {
      setIsSearching(false);
      setNoResults(false);
      return;
    }

    // set searching state to true, which shows the results instead of now playing
    setIsSearching(true);

    try {
      // make api request to search for movies
      // encodeURIComponent ensures special characters in the query are properly encoded
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          query
        )}&page=1&include_adult=false`
      );

      const data = await response.json();

      // update movies with search results
      setMovies(data.results);

      // check if we got any results
      if (data.results.length === 0) {
        setNoResults(true);
      } else {
        setNoResults(false);
      }

      // reset page number for search results
      setCurrentPage(1);

      // check if there are more pages of results to determine if button should disappear
      setHasMoreMovies(data.page < data.total_pages);
    } catch (error) {
      console.error("Error searching movies: ", error);
    }
  };

  // function to load more search results
  const loadMoreSearchResults = async (page) => {
    try {
      // fetch next page of search results
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(
          searchQuery
        )}&page=${page}&include_adult=false`
      );

      const data = await response.json();

      if (data.results.length === 0) {
        setHasMoreMovies(false);
        return;
      }

      // append new search results to existing ones into new array
      setMovies((prevMovies) => [...prevMovies, ...data.results]);

      // check if there are more pages
      setHasMoreMovies(data.page < data.total_pages);
    } catch (error) {
      console.error("Error loading more search results: ", error);
    }
  };

  // function to clear search and go back to "now playing" movies
  // called when back to now playing or now playing is clicked
  const clearSearch = () => {
    setIsSearching(false);
    setSearchQuery("");
    setNoResults(false);
    setCurrentPage(1);
    // will trigger a refect of now playing via useEffect
  };

  // when button is clicked
  const handleLoadMore = () => {
    // increment page number to fetch the next page of results
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);

    // load more search results or "now playing" movies based on current mode
    if (isSearching) {
      loadMoreSearchResults(nextPage);
    } else {
      getMovies(nextPage);
    }

    // re-apply the current sort after loading more movies if a sort is active
    if (sortMethod !== "none") {
      // we need to wait for the new movies to be loaded before sorting
      setTimeout(() => {
        handleSortChange(sortMethod);
      }, 500);
    }
  };

  // handle when a movie is clicked (open modal)
  const handleMovieClick = (movie) => {
    // store the clicked movie in the state for the modal's use
    setSelectedMovie(movie);
    setIsOpen(true);
    // reset trailer state when opening a new movie
    setShowTrailer(false);
    setTrailerUrl("");
    // fetch the trailer for this movie
    fetchMovieTrailer(movie.id);
    // fetch detailed movie info including runtime
    fetchMovieDetails(movie.id);
  };

  // function to fetch detailed movie information
  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=en-US`
      );
      const data = await response.json();

      // update the selected movie with additional details
      setSelectedMovie(prevMovie => ({
        ...prevMovie,
        runtime: data.runtime
      }));
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  // function to fetch movie trailer from TMDB API using the movie's ID
  const fetchMovieTrailer = async (movieId) => {
    try {
      // make API request to TMDB's videos endpoint for this specific movie
      // this endpoint returns all videos associated with the movie (trailers, teasers, clips, etc.)
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
      );
      const data = await response.json();

      // first try to find an official trailer hosted on YouTube
      // we prioritize videos that are explicitly marked as "Trailer" type
      let trailer = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );

      // if no official trailer was found, fall back to any YouTube video for this movie
      // this could be a teaser, behind-the-scenes, clip, etc.
      if (!trailer) {
        trailer = data.results.find((video) => video.site === "YouTube");
      }

      // if we found any suitable video, construct the YouTube embed URL
      // the "key" property contains the YouTube video ID that we need
      if (trailer) {
        setTrailerUrl(`https://www.youtube.com/embed/${trailer.key}`);
      } else {
        // if no videos were found, clear the trailer URL
        setTrailerUrl("");
      }
    } catch (error) {
      // log any errors that occur during the fetch and clear the trailer URL
      console.error("Error fetching movie trailer:", error);
      setTrailerUrl("");
    }
  };

  // function to toggle the trailer visibility in the modal
  // this switches between showing and hiding the embedded YouTube player
  const toggleTrailer = () => {
    setShowTrailer(!showTrailer);
  };

  // function to handle sorting when an option is selected
  const handleSortChange = (sortType) => {
    // update the sort method state
    setSortMethod(sortType);

    // create a copy of the movies array to sort
    const sortedMovies = [...movies];

    // apply different sorting logic based on the selected sort type
    switch (sortType) {
      case "title":
        // sort alphabetically by title
        sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "date":
        // sort by release date (newest first)
        sortedMovies.sort(
          (a, b) => new Date(b.release_date) - new Date(a.release_date)
        );
        break;
      case "rating":
        // sort by vote average (highest first)
        sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
        break;
      default:
        // no sorting (keep original order)
        break;
    }

    // update the movies state with the sorted array
    setMovies(sortedMovies);
  };

  // function to handle favoriting mvoies
  // takes movie obj as param (movie that was clicked on)
  const handleFavoriteClick = (movie) => {
    //update prev state
    setFavoritedMovies((prevFavorites) => {
      // check if movies is alr a fav using .some to check if any movie in favs list has same ID
      const isAlreadyFavorited = prevFavorites.some(
        (favMovie) => favMovie.id === movie.id
      );

      if (isAlreadyFavorited) {
        // remove it from favs using .filter() to create new array w/ all movies except the clicked one
        return prevFavorites.filter((favMovie) => favMovie.id !== movie.id);
      } else {
        // add it to a new array w/ prev favs and the newly added one
        return [...prevFavorites, movie];
      }
    });
  };

  // function to handle watched movies
  const handleWatchedClick = (movie) => {
    setWatchedMovies((prevWatched) => {
      // check if movie is already in watched list
      const isAlreadyWatched = prevWatched.some(
        (watchedMovie) => watchedMovie.id === movie.id
      );

      if (isAlreadyWatched) {
        // remove it from watched list
        return prevWatched.filter(
          (watchedMovie) => watchedMovie.id !== movie.id
        );
      } else {
        // add it to watched list
        return [...prevWatched, movie];
      }
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <span className="logo-icon">🍿</span>
          <h1>Flixster</h1>
        </div>
        {/* pass the search handler to SearchBar */}
        <SearchBar onSearch={handleSearch} onNowPlaying={clearSearch} />
      </header>

      {/* banner component */}
      <Banner />

      {/* modal component */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        backdropPath={selectedMovie?.backdrop_path}
      >
        {selectedMovie && (
          <div>
            <h2>{selectedMovie.title}</h2>
            <p>Release Date: {selectedMovie.release_date}</p>
            {selectedMovie.runtime && <p>Runtime: {selectedMovie.runtime} minutes</p>}
            {/* check if movie has genre ids if so display */}
            {selectedMovie.genre_ids && selectedMovie.genre_ids.length > 0 && (
              // map each genre ID to name, if not in map display unknown
              // join the genres and seperate w commas to be more readable
              <p>
                Genres:{" "}
                {selectedMovie.genre_ids
                  .map((id) => genreMap[id] || "Unknown")
                  .join(", ")}
              </p>
            )}
            <p>Overview: {selectedMovie.overview}</p>
            <p>Rating: {selectedMovie.vote_average} / 10</p>

            {/* trailer button - only show if a trailer URL exists for this movie */}
            {trailerUrl && (
              <button className="trailer-button" onClick={toggleTrailer}>
                {/* button text changes based on whether trailer is currently showing */}
                {showTrailer ? "Hide Trailer" : "Watch Trailer"}
              </button>
            )}

            {/* youtube trailer embed - only rendered when both showTrailer is true and we have a valid URL */}
            {showTrailer && trailerUrl && (
              <div className="trailer-container">
                {/* standard youtube iframe embed with responsive width and fixed height */}
                <iframe
                  width="100%"
                  height="315"
                  src={trailerUrl}
                  title={`${selectedMovie.title} Trailer`}
                  /* these permissions are required for youtube embeds to function properly */
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ border: 0 }}
                ></iframe>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* show search status */}
      {isSearching && (
        <div className="search-status">
          <p>Search results for: "{searchQuery}"</p>
        </div>
      )}

      {/* sort dropdown component */}
      <div className="sort-container">
        <Sort onSortChange={handleSortChange} />
      </div>

      {/* show "no results" message if needed */}
      {noResults ? (
        <div className="no-results">
          <p>No movies found matching "{searchQuery}"</p>
        </div>
      ) : (
        <>
          <section className="movie-list-container">
            <MovieList
              movies={movies}
              onMovieClick={handleMovieClick}
              onFavoriteClick={handleFavoriteClick}
              favoritedMovies={favoritedMovies}
              onWatchedClick={handleWatchedClick}
              watchedMovies={watchedMovies}
            />
          </section>

          {/* only show load more button if we have movies and more are available */}
          <section className="load-btn-container">
            <LoadMore onLoadMore={handleLoadMore} hasMore={hasMoreMovies} />
          </section>
        </>
      )}

      <footer className="App-footer">
        <p>&copy; 2025 Flixster. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
