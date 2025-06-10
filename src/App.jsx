import { useState } from 'react'
import './App.css'
import data from './data/data'
import MovieList from './MovieList'
import LoadMore from './LoadMore'

const App = () => {
  return (
    <div className="App">
      <header>
        <h1 className="App-header">Flixster</h1>
        </header>
        <section className="movie-list-container">
            <MovieList />
        </section>
        
        <section className="load-btn-container">
          <LoadMore />
        </section>  
    </div>
  )
}

export default App
