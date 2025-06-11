import React, { useState } from "react";
import "./MovieCard.css";
import "./MovieList.css";
import "./SearchBar.css";

function SearchBar({ onSearch }) {
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

  return (
    <form className="search-form" onSubmit={handleSearch}>
      <input
        className="search-input"
        type="text"
        name="searchInput"
        placeholder="Search for a movie..."
        value={searchQuery}
        onChange={handleSearchChange}
      />

      <button className="search-button" type="submit">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
