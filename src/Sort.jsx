import { useState } from "react";
import "./Sort.css";
const Sort = ({ onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  // add state to track the currently selected sort
  const [selectedSort, setSelectedSort] = useState("none");

  // will be called when dropdown is clicked
  // toggle drop down between open and closed states
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // function to handle when a sort option is clicked
  const handleSortClick = (sortType) => {
    // update selected sort in local state
    setSelectedSort(sortType);

    // call the paren's sort w/ selected type
    onSortChange(sortType);

    // close after selection
    setIsOpen(false);
  };

  return (
    <div className="sort">
      {/* when clicked toggle dropdown function will be called */}
      <div className="sort-header" onClick={toggleDropdown}>
        <span>Sort By</span>

        {/* arrow changes direction based on dropdown state */}
        <span className="arrow">{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <ul className="sort-list">
          {/* each li element represents a sorting option */}
          {/* each li needs to call handleSortClick */}
          {/* sort alphabetically */}
          <li
            className={`sort-item ${selectedSort === "title" ? "selected" : ""}`}
            onClick={() => handleSortClick("title")}
          >
            Title (A-Z)
          </li>

          {/* release date, newsest to oldest */}
          <li
            className={`sort-item ${selectedSort === "date" ? "selected" : ""}`}
            onClick={() => handleSortClick("date")}
          >
            Release Date
          </li>

          {/* vote average (desc, highest to lowest) */}
          <li
            className={`sort-item ${selectedSort === "rating" ? "selected" : ""}`}
            onClick={() => handleSortClick("rating")}
          >
            Vote Average
          </li>
        </ul>
      )}
    </div>
  );
};

export default Sort;
