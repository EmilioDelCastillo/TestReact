import type { Movie } from '../Helpers/MoviesData'
const API_TOKEN = "89d8d892881ebf5609e3a525def2c975"

// L'API retourne un numéro de page et un tableau results avec les films dedans
export type APIResult = {
    page: number,
    total_pages: number,
    results: Movie[]
}

// TResponse c'est juste un placeHolder pour le type de réponse de l'API
export function getMoviesFromAPIWithSearchedText<TResponse>(text: string, page: number): Promise<TResponse> {
    const url = "https://api.themoviedb.org/3/search/movie?api_key=" + API_TOKEN + "&language=fr&query=" + text + "&page=" + page

    return fetch(url)
        .then(response => response.json())
        .then(data => data as TResponse)
}

/**
 * Makes a network call to the API, and hopefully fetches a movie with its identifier.
 * It is up to the caller to implement the type of the movie.
 */
export function getMovieById<TResponse>(movieId: string) {
    const url = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + API_TOKEN + "&language=fr"
    return fetch(url)
        .then(response => response.json())
        .then(data => data as TResponse)
}

/**
 * Returns the URI to an image.
 */
export function getImageFromAPI(name: string) {
    return 'https://image.tmdb.org/t/p/w300' + name
}