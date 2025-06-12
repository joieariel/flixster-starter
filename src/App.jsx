import { useState, useEffect } from "react";
import "./App.css";
import MovieList from "./MovieList";
import LoadMore from "./LoadMore";
import SearchBar from "./SearchBar";
import Modal from "./Modal";
import Sort from "./Sort";

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


  useEffect(() => {
    //only fetch now playing movies when not searching
    if (!isSearching) {
      getMovies(currentPage); // runs once when first page is loaded
    }
  }, []);

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
        sortedMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
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

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <span className="logo-icon">🎬</span>
          <h1>Flixster</h1>
        </div>
        {/* pass the search handler to SearchBar */}
        <SearchBar onSearch={handleSearch} onNowPlaying={clearSearch} />
      </header>

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
            <p>Overview: {selectedMovie.overview}</p>
            <p>Rating: {selectedMovie.vote_average} / 10</p>
          </div>
        )}
      </Modal>

      {/* show search status and clear search option */}
      {isSearching && (
        <div className="search-status">
          <p>Search results for: "{searchQuery}"</p>
          <button onClick={clearSearch}>Back to Now Playing</button>
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
            <MovieList movies={movies} onMovieClick={handleMovieClick} />
          </section>

          {/* only show load more button if we have movies and more are available */}
          {movies.length > 0 && (
            <section className="load-btn-container">
              <LoadMore onLoadMore={handleLoadMore} hasMore={hasMoreMovies} />
            </section>
          )}
        </>
      )}

      {/* fixed footer with copyright */}
      <footer className="App-footer">
        <p>&copy; {new Date().getFullYear()} Flixster. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
