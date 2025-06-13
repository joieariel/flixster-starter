import { useState, useRef, useEffect } from "react";
import "./Sort.css";

const Sort = ({ onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  // add state to track the currently selected sort
  const [selectedSort, setSelectedSort] = useState("none");
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Generate unique ID for accessibility
  const dropdownId = "sort-dropdown";

  // Handle keyboard navigation and outside clicks
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'Escape':
          setIsOpen(false);
          buttonRef.current?.focus();
          break;
        case 'ArrowDown':
          event.preventDefault();
          focusNextItem();
          break;
        case 'ArrowUp':
          event.preventDefault();
          focusPreviousItem();
          break;
        default:
          break;
      }
    };

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus management for keyboard navigation
  const focusNextItem = () => {
    const items = dropdownRef.current?.querySelectorAll('.sort-item');
    if (!items?.length) return;

    const currentIndex = Array.from(items).findIndex(item => document.activeElement === item);
    const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    items[nextIndex].focus();
  };

  const focusPreviousItem = () => {
    const items = dropdownRef.current?.querySelectorAll('.sort-item');
    if (!items?.length) return;

    const currentIndex = Array.from(items).findIndex(item => document.activeElement === item);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    items[prevIndex].focus();
  };

  // will be called when dropdown is clicked
  // toggle drop down between open and closed states
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // function to handle when a sort option is clicked
  const handleSortClick = (sortType) => {
    // update selected sort in local state
    setSelectedSort(sortType);

    // call the parent's sort w/ selected type
    onSortChange(sortType);

    // close after selection
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  // Handle keyboard selection
  const handleKeyDown = (event, sortType) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleSortClick(sortType);
    }
  };

  // Get the current sort label for screen readers
  const getSortLabel = () => {
    switch (selectedSort) {
      case 'title': return 'Title (A-Z)';
      case 'date': return 'Release Date';
      case 'rating': return 'Vote Average';
      default: return 'None';
    }
  };

  return (
    <div className="sort" ref={dropdownRef}>
      <button
        ref={buttonRef}
        className="sort-header"
        onClick={toggleDropdown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={dropdownId}
        aria-label={`Sort by: ${getSortLabel()}`}
      >
        <span>Sort By</span>
        {/* arrow changes direction based on dropdown state */}
        <span className="arrow" aria-hidden="true">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <ul
          id={dropdownId}
          className="sort-list"
          role="listbox"
          aria-label="Sort options"
          tabIndex="-1"
        >
          {/* each li element represents a sorting option */}
          <li
            className={`sort-item ${selectedSort === "title" ? "selected" : ""}`}
            onClick={() => handleSortClick("title")}
            onKeyDown={(e) => handleKeyDown(e, "title")}
            role="option"
            aria-selected={selectedSort === "title"}
            tabIndex="0"
          >
            Title (A-Z)
          </li>

          {/* release date, newest to oldest */}
          <li
            className={`sort-item ${selectedSort === "date" ? "selected" : ""}`}
            onClick={() => handleSortClick("date")}
            onKeyDown={(e) => handleKeyDown(e, "date")}
            role="option"
            aria-selected={selectedSort === "date"}
            tabIndex="0"
          >
            Release Date
          </li>

          {/* vote average (desc, highest to lowest) */}
          <li
            className={`sort-item ${selectedSort === "rating" ? "selected" : ""}`}
            onClick={() => handleSortClick("rating")}
            onKeyDown={(e) => handleKeyDown(e, "rating")}
            role="option"
            aria-selected={selectedSort === "rating"}
            tabIndex="0"
          >
            Vote Average
          </li>
        </ul>
      )}
    </div>
  );
};

export default Sort;
