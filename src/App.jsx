import { useState, useEffect } from "react";
import "./App.css";
import MovieList from "./MovieList";
import LoadMore from "./LoadMore";
import SearchBar from "./SearchBar";

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

  useEffect(() => {
    //only fetch 'now playing' movies when not searching
    if (!isSearching) {
      getMovies(currentPage); // runs once when first page is loaded
    }
  }, []);

  // fetches a specific page of "now playing" movies from tmdb api
  const getMovies = async (page) => {
    try {
      // append &page=${page} to the API URL as instructed
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=${page}`
      );

      const data = await response.json();

      // hide "load more" button when we've reached the end of available movies
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

    // if search query is empty, show "now playing" movies
    if (!query.trim()) {
      setIsSearching(false);
      setNoResults(false);
      return;
    }

    // set searching state to true
    setIsSearching(true);

    try {
      // make api request to search for movies
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`
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

      // check if there are more pages of results
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
        `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(searchQuery)}&page=${page}&include_adult=false`
      );

      const data = await response.json();

      if (data.results.length === 0) {
        setHasMoreMovies(false);
        return;
      }

      // append new search results to existing ones
      setMovies((prevMovies) => [...prevMovies, ...data.results]);

      // check if there are more pages
      setHasMoreMovies(data.page < data.total_pages);

    } catch (error) {
      console.error("Error loading more search results: ", error);
    }
  };

  // function to clear search and go back to "now playing" movies
  const clearSearch = () => {
    setIsSearching(false);
    setSearchQuery("");
    setNoResults(false);
    setCurrentPage(1);
  };

  // triggered when the "load more" button is clicked
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
  };

  return (
    <div className="App">
      <header>
        <h1 className="App-header">
          Flixster
          {/* pass the search handler to SearchBar */}
          <SearchBar onSearch={handleSearch} />
        </h1>
      </header>

      {/* show search status and clear search option */}
      {isSearching && (
        <div className="search-status">
          <p>Search results for: "{searchQuery}"</p>
          <button onClick={clearSearch}>Back to Now Playing</button>
        </div>
      )}

      {/* show "no results" message if needed */}
      {noResults ? (
        <div className="no-results">
          <p>No movies found matching "{searchQuery}"</p>
        </div>
      ) : (
        <>
          <section className="movie-list-container">
            <MovieList movies={movies} />
          </section>

          {/* only show load more button if we have movies and more are available */}
          {movies.length > 0 && (
            <section className="load-btn-container">
              <LoadMore onLoadMore={handleLoadMore} hasMore={hasMoreMovies} />
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default App;
