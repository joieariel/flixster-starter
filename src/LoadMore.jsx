import React from "react";
import "./MovieCard.css";
import "./MovieList.css";

const LoadMore = ({ onLoadMore, hasMore }) => {
  return (
    <div className="load-btn">
      {/* //conditional rendering to show button or message*/}

      {hasMore ? (
        <button
          type="button"
          //when clicked called onLoadMore (handleMore in app component)
          onClick={onLoadMore}
        >
          Load More
        </button>
      ) : (
        //message shown when no more movies to load
        <p>No more movies to show.</p>
      )}
    </div>
  );
};

export default LoadMore;
