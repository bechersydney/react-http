import React, { useCallback, useEffect, useState } from "react";

import "./App.css";
import AddMovie from "./components/AddMovie";
import MoviesList from "./components/MoviesList";

function App() {
    const [movies, setMovies] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchDataHandler = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                "https://react-http-24a9a-default-rtdb.firebaseio.com/movies.json"
            );
            if (response.ok) {
                const loadedMovies = [];
                const data = await response.json();
                for (const key in data) {
                    loadedMovies.push({
                        id: key,
                        title: data[key].title,
                        releaseDate: data[key].releaseDate,
                        openingText: data[key].openingText,
                    });
                }
                // const transformedData = loadedMovies.map((movie) => {
                //     return {
                //         id: movie.episode_id,
                //         title: movie.title,
                //         releaseDate: movie.release_date,
                //         openingText: movie.opening_crawl,
                //     };
                // });
                setMovies(loadedMovies);
                setLoading(false);
                fetchDataHandler();
            } else {
                throw new Error("Something went wrong!");
            }
        } catch (e) {
            console.log(e.message);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDataHandler();
    }, [fetchDataHandler]);

    const addMovieHandler = async (movie) => {
        const response = await fetch(
            "https://react-http-24a9a-default-rtdb.firebaseio.com/movies.json",
            {
                method: "POST",
                body: JSON.stringify(movie),
                headers: { "Content-Tuype": "application/json" },
            }
        );
        const data = await response.json();
        console.log(data);
    };

    let content = <p>Found no movies.</p>;
    if (error) content = <p>{error}</p>;
    if (movies.length > 0) content = <MoviesList movies={movies} />;
    if (isLoading) content = <p>loading...</p>;

    return (
        <React.Fragment>
            <section>
                <AddMovie onAddMovie={addMovieHandler} />
            </section>
            <section>
                <button onClick={fetchDataHandler}>Fetch Movies</button>
            </section>
            <section>{content}</section>
        </React.Fragment>
    );
}

export default App;
