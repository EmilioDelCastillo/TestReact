import type { Film } from '../Helpers/FilmsData'
const API_TOKEN = "89d8d892881ebf5609e3a525def2c975"

// L'API retourne un numéro de page et un tableau results avec les films dedans
export type APIResult = {
    page: number,
    results: Film[]
}

// TResponce c'est juste un placeHolder pour le type de réponse de l'API
export function getFilmsFromAPIWithSearchedText<TResponse>(text: string): Promise<TResponse> {
    const url = "https://api.themoviedb.org/3/search/movie?api_key=" + API_TOKEN + "&language=fr&query=" + text

    return fetch(url)
        .then(response => response.json())
        .then(data => data as TResponse)
}