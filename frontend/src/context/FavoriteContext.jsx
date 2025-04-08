'use client'
import { createContext, useState, useContext, useEffect } from 'react'


const FavoriteContext = createContext();

export const FavoriteProvider = ({children}) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addToFavorites = (movie) =>{
        if (!favorites.find((fav) => fav.movieid === movie.movieid)) {
            setFavorites((prev) => [...prev, movie]);
        }
    }

    const removeFromFavorites = (movie) => {
        setFavorites((prev) => prev.filter((fav) => fav.movieid !== movie.movieid));
    }

    return (
        <FavoriteContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
            {children}
        </FavoriteContext.Provider>
    )
}

export const useFavorites = () => useContext(FavoriteContext);