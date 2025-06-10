import { useState } from 'react'
import './App.css'
import data from './data/data'
import MovieList from './MovieList'

const App = () => {
  return (
    <div className="App">
      <header>
        <h1>Flixster</h1>
        </header>
        <section className="movie-list-container">
            <MovieList />
        </section>
    </div>
  )
}

export default App
