import { createStore } from 'redux'
import toggleFavourite from './Reducers/favouriteReducer'

export default createStore(toggleFavourite)