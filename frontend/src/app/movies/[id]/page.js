import MovieDetailClient from './MovieDetailClient'

export async function generateMetadata({ params }) {
    return {
        title: `Movies ${params.id}`,
    };
}

export default async function MovieDetailPage({ params }) {
    const { id } = await params;
    const res = await fetch(`http://backend:8000/api/movies/${id}`);
    const movie = await res.json();

    return <MovieDetailClient movie={movie} />;
}
