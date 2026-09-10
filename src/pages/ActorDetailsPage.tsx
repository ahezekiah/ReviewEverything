/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom"
import "./style/actordetails.css";

export default function ActorDetails() {
    const { id } = useParams();
    const [actor, setActor] = useState<any>(null);
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    const location = useLocation();
    const backLink = location.state?.from || "/search";

    useEffect(() => {
        const fetchActor = async () => {
            const res = await fetch(
                `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&append_to_response=movie_credits`
            );
            const data = await res.json();
            setActor(data);
        };
        fetchActor();
    }, [API_KEY, id]);
    if (!actor) return <p className="loading">Loading...</p>;

    return (
        <main className="actor-page">
            <section className="actor-hero" style={{ backgroundImage: `linear-gradient(rgba(12, 12, 18, 0.78), rgba(12, 12, 18, 0.95)), url(https://image.tmdb.org/t/p/original${actor.profile_path})` }}>
                <div className="actor-hero-inner page-width">
                    <Link to={backLink} className="back-button">← Back</Link>
                    <div className="actor-main">
                        {actor.profile_path && (
                            <img className="actor-image" src={`https://image.tmdb.org/t/p/w300${actor.profile_path}`} alt={actor.name} />
                        )}
                        <div className="actor-info">
                            <p className="eyebrow">Actor Details</p>
                            <h1 className="actor-name">{actor.name}</h1>
                            <div className="actor-meta-group">
                                {actor.birthday && (
                                    <span className="actor-pill">
                                        Born: {actor.birthday}
                                    </span>
                                )}
                                {actor.place_of_birth && (
                                    <span className="actor-pill">
                                        {actor.place_of_birth}
                                    </span>
                                )}
                            </div>
                            <h2>Biography</h2>
                            <p className="actor-bio">
                                {actor.biography || "No biography available."}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="known-for-section page-width">
                <div className="section-header">
                    <p className="eyebrow">Filmography</p>
                    <h2>Known For</h2>
                </div>
                <div className="movie-grid">
                    {actor.movie_credits?.cast
                        ?.sort(
                            (a: any, b:any) => 
                                b.vote_count - a.vote_count
                        )
                        .map((movie: any) => (
                            <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
                                {movie.poster_path ? (
                                    <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} alt={movie.title} className="poster-image"/>
                                ) : (
                                    <div className="poster-placeholder">
                                        No Image
                                    </div>
                                )}
                                <h3>{movie.title}</h3>
                                <p className="movie-role">{movie.character}</p>
                            </Link>
                        ))}
                </div>
            </section>

            <footer className="landing-footer">
                <p>Review Everything</p>
                <p>Group Name © 2026</p>
                <p>Links</p>
            </footer>
        </main>
    )
}