'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/context/FavoriteContext";
import Link from "next/link";

export default function OnBordingPage(){
    const router = useRouter();
    const { favorites, addToFavorites, removeFromFavorites} = useFavorites();
    const [ allMovies, setAllMovies] = useState([]);

    useEffect (() => {
        fetch('http://backend:8000/api/movies')
        .then(res=>res.json())
        .then(data=>setAllMovies(data))
        .catch(err => console.log(err))
    }, []);

    const handleNext = () => {
        localStorage.setItem('onboardingDone', 'true');
        router.push('/');
    };      

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">choose some favorite movies</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allMovies.slice(0, 20).map((movie)=>{
                    const isFavorite = favorites.some(fav => fav.movieid === movie.movieid);
                    const toggleFavorite = () => {
                        isFavorite ? removeFromFavorites(movie) : addToFavorites(movie);
                    };
                    return (
                        <button
                            key={movie.movieid}
                            onClick={toggleFavorite}
                            className="mt-4 px-4 py-2 rounded border text-left flex justify-between items-center text-xl hover:bg-blue-100 transition-all"
                            title={isFavorite ? "remove from favorites" : "add to favorites"}
                        >
                            <span>{movie.title}</span>
                            <span className="text-2xl mr-2">{isFavorite ? '❤️' : '🤍'}</span>
                        </button>
                    );
                })}
            </div>
            <div className="flex justify-end mt-6">
                <button
                    onClick={handleNext}
                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    go to next →
                </button>
            </div>
        </div>
    )
}