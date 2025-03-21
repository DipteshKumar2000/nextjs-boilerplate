"use client";

import { useState } from 'react';
import axios from 'axios';

interface Movie {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
  Genre?: string;
  Plot?: string;
  Actors?: string;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async () => {
    if (searchTerm.trim() === '') return;

    try {
      const response = await axios.get(`https://www.omdbapi.com/?s=${searchTerm}&apikey=3fb6a8a8`);
      setMovies(response.data.Search || []);
      setSelectedMovie(null);
    } catch (error) {
      console.error('Error fetching data from OMDb:', error);
    }
  };

  const handleMovieClick = async (imdbID: string) => {
    try {
      const response = await axios.get(`https://www.omdbapi.com/?i=${imdbID}&apikey=3fb6a8a8`);
      setSelectedMovie(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  };

  const handleBackClick = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <label htmlFor="search" className="sr-only">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center text-gray-500">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input
            type="search"
            id="search"
            className="w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search for movies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="absolute right-3 top-2.5 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-4 py-2"
          >
            Search
          </button>
        </div>
      </div>

      {selectedMovie ? (
        <div className="flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <button
              onClick={handleBackClick}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-gray-600"
            >
              Back to Search Results
            </button>

            <h2 className="text-3xl font-bold mb-4">{selectedMovie?.Title}</h2>
            <div className="flex">
              <img
                src={selectedMovie.Poster !== 'N/A' ? selectedMovie.Poster : '/placeholder.jpg'}
                alt={selectedMovie.Title}
                className="w-64 h-96 object-cover rounded-lg mr-6"
              />
              <div className="flex flex-col justify-start">
                <p><strong>Year:</strong> {selectedMovie.Year}</p>
                <p><strong>Genre:</strong> {selectedMovie.Genre}</p>
                <p><strong>Plot:</strong> {selectedMovie.Plot}</p>
                <p><strong>Actors:</strong> {selectedMovie.Actors}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {movies.map((movie) => (
            <div
              key={movie.imdbID}
              onClick={() => handleMovieClick(movie.imdbID)}
              className="cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.jpg'}
                  alt={movie.Title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold">{movie.Title}</h3>
                  <p className="text-gray-600">{movie.Year}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
