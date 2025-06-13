import React, { useState } from "react";
import "./MovieCard.css";
import "./MovieList.css";
import "./SearchBar.css";

function SearchBar({ onSearch, onNowPlaying }) {
  // state tracks what the user types in search
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    // sents search query to the parent component (App)
    onSearch(searchQuery);
  };

  const handleSearchChange = (event) => {
    //update state as user types
    setSearchQuery(event.target.value);
  };

  const handleClear = () => {
    setSearchQuery("");
    //  clear the search results in the parent component
    onSearch("");
  };

  const handleNowPlaying = () => {
    // clear search and show now playing movies
    setSearchQuery("");
    onNowPlaying();
  };

  return (
    <form className="search-form" onSubmit={handleSearch}>
      <div className="search-input-container">
        <input
          className="search-input"
          type="text"
          name="searchInput"
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {searchQuery && (
          <button
            type="button"
            className="clear-button"
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </div>

      <button className="search-button" type="submit">
        Search
      </button>

      <button
        type="button"
        className="now-playing-button"
        onClick={handleNowPlaying}
      >
        Now Playing
      </button>
    </form>
  );
}

export default SearchBar;
