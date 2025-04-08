'use client'

import { useRouter } from 'next/navigation'
import { useFavorites } from '@/context/FavoriteContext'

export default function MovieDetailClirnt ({movie}) {
    const router = useRouter();
    const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

    const isFavorite = favorites.some(fav=>fav.movieid==movie.movieid);
    const toggleFavorite = () => {
        if(isFavorite) {
            removeFromFavorites(movie);
        }
        else{
            addToFavorites(movie);
        }
    };

    return(
        <div className="p-6">
            <button
                onClick = {()=>router.back()}
                className="text-blue-500 hover:underline"
            >
                ← Back
            </button>

            <button
                onClick = {()=>router.push(`/movies/${movie.movieid}`)}
                className="text-left w-full"
            >
                <p className="text-lg font-semibold hover:underline">{movie.title}</p>
                <p className="text-sm text-gray-600">{movie.genres}</p>
            </button>
            <button
                onClick={toggleFavorite}
                className="mt-4 text-3xl focus:outline-none transition-transform hover:scale-110"
                title={isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
                >
                {isFavorite ? '❤️' : '🤍'}
                </button>
        </div>
    )
}