'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/context/FavoriteContext";

export default function RecommendPages(){
    const { favorites } = useFavorites();
    const [allMovies, setAllMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect (() => {
        fetch('http://localhost:8000/api/movies')
        .then(res=>res.json())
        .then(data=>setAllMovies(data))
        .catch(err => console.log(err))
    }, [])

    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        if (favorites.length === 0 || allMovies.length === 0) return;

        const fetchRecommendations = async () => {
            setLoading(true);
            const favoriteIds = favorites.map(f => f.movieid);
            const candidates = allMovies.filter(m => !favoriteIds.includes(m.movieid));
            const candidateIds = candidates.map(m => m.movieid);

            const res = await fetch("http://localhost:9000/predict_many", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: 99999,
                    movieIds: candidateIds,
                }),
            });

        const predictions = await res.json();

        const recommended = candidates
            .map(movie => {
                const match = predictions.find(p => p.movieId === movie.movieid);
                return match ? { ...movie, score: match.rating } : null;
            })
            .filter(Boolean)
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

        setRecommendations(recommended);
        setLoading(false);
        };

        fetchRecommendations();
    }, [favorites, allMovies]);

    return (
        <div className="p-6">
            <button
                onClick = {()=>router.push('/')}
                className="text-blue-500 hover:underline"
            >
                ← Back
            </button>
            {loading ? (
                <div className="mt-6 text-center text-gray-600 animate-pulse">
                    🔍 Hang tight! The AI is picking movies just for you...
                </div>
            ) : (
                <>
                <h2 className="text-xl font-semibold mt-8">Recommended for you</h2>
                    <ul className="space-y-2 mt-4">
                        {recommendations.map(movie => (
                            <li key={movie.movieid} className="bg-white p-4 rounded shadow">
                                <button
                                    onClick = {()=>router.push(`/movies/${movie.movieid}`)}
                                    className="w-full text-left transition-all duration-200 hover:bg-blue-50 rounded"
                                >
                                    <p className="text-lg font-semibold">{movie.title}</p>
                                    <p className="text-sm text-gray-600">{movie.genres}</p>
                                    <p className="text-sm text-blue-600">
                                        Predicted Rating: {movie.score.toFixed(2)}
                                    </p>
                                </button>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )

}