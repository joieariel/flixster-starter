import React from "react";
import './MovieCard.css';
import './MovieList.css';


const LoadMore = () => {
    return (
        <div className="load-btn">
            <button type="button" onClick={() => console.log("Load More button clicked")}>
                Load More
            </button>
        </div>


    )
}

export default LoadMore
