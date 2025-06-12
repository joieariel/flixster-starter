import { useState } from "react";
import "./Sort.css";
const Sort = () => {
  const [isOpen, setIsOpen] = useState(false);

  // will be called when dropdown is clicked
  // toggle drop down between open and closed states
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
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
          {/* sort alphabetically */}
          <li className="sort-item">Title (A-Z)</li>

          {/* release date */}
          <li className="sort-item">Release Date (Newest)</li>
          {/* more sorting */}
        </ul>
      )}
    </div>
  );
};

export default Sort;
