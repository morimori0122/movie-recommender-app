'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/context/FavoriteContext";

export default function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const { favorites } = useFavorites();
  const [allMovies, setAllMovies] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const done = localStorage.getItem('onboardingDone');
    if (!done) router.push('/onboarding');

    const savedQuery = sessionStorage.getItem('query');
    const savedMovies = sessionStorage.getItem('movies');

    if (savedQuery) setQuery(savedQuery);
    if (savedMovies) setMovies(JSON.parse(savedMovies));
  }, [router]);

  const handleSearch = () => {
    fetch(`http://localhost:8000/api/search?title=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setMovies(data);
        sessionStorage.setItem('query', query);
        sessionStorage.setItem('movies', JSON.stringify(data));
      })
      .catch(err => console.log(err));
  };

  return (
    <main className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">search movies</h1>
        <div className="flex gap-x-2">
          <button
            onClick={() => router.push('/recommend')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            recommendations page
          </button>
          <button
            onClick={() => router.push('/favorite')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            your favorites page
          </button>
        </div>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="input title"
          className="border border-gray-300 px-4 py-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          search
        </button>
      </div>

      <ul className="space-y-2">
        {movies.map((movie) => (
          <li key={movie.movieid} className="bg-white p-4 rounded shadow">
            <button
              onClick={() => router.push(`/movies/${movie.movieid}`)}
              className="w-full text-left transition-all duration-200 hover:bg-blue-50 rounded"
            >
              <p className="text-lg font-semibold">{movie.title}</p>
              <p className="text-sm text-gray-600">{movie.genres}</p>
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
