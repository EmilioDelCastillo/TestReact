import type { Movie } from '../../Helpers/moviesData'
import * as actionTypes from '../actionTypes'

export interface GlobalState {
    favouriteMovies: Movie[]
}

export type Action = {
    type: string,
    value: Movie
}

const initialState: GlobalState = { favouriteMovies: [] }

function toggleFavourite(state: GlobalState = initialState, action: Action): GlobalState {
    let nextState: GlobalState
    switch (action.type) {
        case actionTypes.TOGGLE_FAVOURITE:

            const favouriteIndex = state.favouriteMovies.findIndex(movie => movie.id == action.value.id)
            if (favouriteIndex != -1) {
                // The movie is already in the favourites, delete it
                nextState = {
                    ...state,
                    favouriteMovies: state.favouriteMovies.filter((item, index) => index != favouriteIndex)
                }

            } else {
                // Add the movie to the favourites
                nextState = {
                    ...state,
                    favouriteMovies: [...state.favouriteMovies, action.value]
                }
            }
            return nextState
        default:
            return state
    }
}

export default toggleFavourite