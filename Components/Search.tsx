import React, { Dispatch } from 'react';
import { StyleSheet, TextInput, View, FlatList, ActivityIndicator } from 'react-native';
import { getMoviesFromAPIWithSearchedText } from '../API/TMDBapi';
import type { APIResult } from '../API/TMDBapi'

import MovieItem from './MovieItem';
import type { Movie } from '../Helpers/moviesData'
import { NavigationComponents } from '../Navigation/NavigationHelper'
import { NavigationProps } from '../Navigation/NavigationHelper';
import { connect } from 'react-redux'
import { Action } from 'redux';
import { GlobalState } from '../Store/Reducers/favouriteReducer';

// Pour pouvoir donner une propriété à state, on crée un nouveau type
interface State {
    movies: Movie[],
    isLoading: boolean
}

class Search extends React.Component<NavigationProps & ReduxType, State> {

    /**
     * The string parameter given to the API.
     */
    private searchString: string

    /**
     * The current page from the API results.
     */
    private currentPage: number

    /**
     * The total number of pages given by the API.
     */
    private totalPages: number

    constructor(props: NavigationProps & ReduxType) {
        super(props)
        this.state = {
            movies: [],
            isLoading: false
        }
        this.searchString = ""
        this.currentPage = 0
        this.totalPages = 0
    }

    /**
     * Updates the state with the list of movies coming from the network call.
     */
    private loadMovies() {
        if (this.searchString.length > 0) {
            this.setState({ isLoading: true })
            getMoviesFromAPIWithSearchedText<APIResult>(this.searchString, this.currentPage + 1).then(data => {
                this.currentPage = data.page
                this.totalPages = data.total_pages

                // Avoid duplicates, stupid API sometimes returns the same movie on two different pages
                let newMovies = data.results.filter(newMovie => {
                    return this.state.movies.findIndex(movie => movie.id == newMovie.id) == -1
                })

                this.setState({
                    movies: [...this.state.movies, ...newMovies],
                    isLoading: false
                })
            })
        }
    }

    /**
     * Updates the `searchString` property.
     * @param text The new string
     */
    private updateSearchString(text: string) {
        this.searchString = text
    }

    /**
     * Returns an activity indicator to be displayed if `state.isLoading` is true.
     * @returns A View with an ActivityIndicator when its needed, *undefined* otherwise.
     */
    private displayActivityIndicator(): JSX.Element | undefined {
        if (this.state.isLoading) {
            return (
                <View style={styles.activity_indicator}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }

    /**
     * Resets the current search. This allows a new search to start on fresh grounds.
     */
    private resetSearch() {
        this.currentPage = 0
        this.totalPages = 0
        this.setState({ movies: [] })
    }

    /**
     * Navigates to the MovieDetails component.
     * @param movieId The identifier of the movie whose details will be displayed.
     */
    private showMovieDetail = (movieId: string) => {
        this.props.navigation.navigate(NavigationComponents.Detail, { movieId: movieId })
    }

    /**
     * Returns a boolean indicating if the movie is a favourite movie.
     * @param id The movie identifier.
     * @returns true if the movie is among the favourite movies, false otherwise.
     */
    private isMovieFavourite(id: number): boolean {
        return this.props.favouriteMovies.findIndex(movie => movie.id.toString() == id.toString()) != -1
    }

    render() {
        return (
            // Ici on rend à l'écran les éléments graphiques de notre component custom Search
            <View style={styles.mainContainer}>
                <TextInput
                    style={[styles.textInput, { backgroundColor: 'cyan' }]}
                    placeholder="Titre du movie"

                    // A chaque nouveau caractère on met à jour la chaîne de caractères à chercher
                    onChange={(event) => this.updateSearchString(event.nativeEvent.text)}

                    // Lorsqu'on appuie sur "retour" ça charge la liste des movies
                    onSubmitEditing={(event) => {
                        this.resetSearch()
                        this.loadMovies()
                    }}
                />
                <FlatList
                    data={this.state.movies}
                    // This tells the flatlist that extra data has to be checked when asked to re-render
                    extraData={this.props.favouriteMovies}

                    keyExtractor={(item) => item.id.toString()}

                    renderItem={({ item }) => <MovieItem
                        movie={item}
                        didSelectMovie={this.showMovieDetail}
                        isMovieFavourite={this.isMovieFavourite(item.id)} />
                    }

                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        if (this.currentPage < this.totalPages) {
                            this.loadMovies()
                        }
                    }}
                />
                {this.displayActivityIndicator()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginTop: 10
    },

    textInput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5
    },

    activity_indicator: {
        position: 'absolute', // Afficher par dessus tout
        alignItems: 'center', // Centrer
        justifyContent: 'center',
        top: 100, // Laisser de l'espace pour les inputs en haut de l'écran
        left: 0, // Mais se coller aux autres bords pour que le spinner soit bien au milieu
        right: 0,
        bottom: 0
    }
})

const mapStateToProps = (state: GlobalState) => {
    return {
        favouriteMovies: state.favouriteMovies
    }
}

const mapDispatcherToProps = (dispatch: Dispatch<Action>) => {
    return {
        dispatch: (action: Action) => { dispatch(action) }
    }
}

type ReduxType = ReturnType<typeof mapDispatcherToProps> & ReturnType<typeof mapStateToProps>

export default connect(mapStateToProps, mapDispatcherToProps)(Search)