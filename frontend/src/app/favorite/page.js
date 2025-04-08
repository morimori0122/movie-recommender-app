'use client'

import { useFavorites } from "@/context/FavoriteContext";
import { useRouter } from "next/navigation";

export default function FavoritesPage(){
    const {favorites, addToFavorites} = useFavorites();
    const router = useRouter();

    return (
        <div className="p-6">
            <button
                onClick = {()=>router.back()}
                className="text-blue-500 hover:underline"
            >
                ← Back
            </button>
            <h1 className="text-2xl font-bold mb-4">favorite movies list</h1>
            <ul className="space-y-2">
                {favorites.map((fav)=> (
                    <li key={fav.movieid} className="bg-white p-4 rounded shadow">
                        <button
                            onClick = {()=>router.push(`/movies/${fav.movieid}`)}
                            className="text-left w-full"
                        >
                            <p className="text-lg font-semibold hover:underline">{fav.title}</p>
                            <p className="text-sm text-gray-600">{fav.genres}</p>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}