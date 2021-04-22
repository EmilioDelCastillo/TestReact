import React, { ReactNode } from 'react';
import { StyleSheet, Button, TextInput, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { getMoviesFromAPIWithSearchedText } from '../API/TMDBapi';
import type { APIResult } from '../API/TMDBapi'

import MovieItem from './MovieItem';
import type { Movie } from '../Helpers/MoviesData'
import { NavigationComponents } from '../Navigation/NavigationHelper'
import { NavigationProps } from '../Navigation/NavigationHelper';

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

// Pour pouvoir donner une propriété à state, on crée un nouveau type
interface State {
    movies: Movie[],
    isLoading: boolean
}

class Search extends React.Component<NavigationProps, State> {

    searchString: string
    currentPage: number
    totalPages: number

    constructor(props: NavigationProps) {
        super(props)
        this.state = {
            movies: [],
            isLoading: false
        }
        this.searchString = ""
        this.currentPage = 0
        this.totalPages = 0
    }

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

    private updateSearchString(text: string) {
        this.searchString = text
    }

    private displayActivityIndicator() {
        if (this.state.isLoading) {
            return (
                <View style={styles.activity_indicator}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }

    private resetSearch() {
        this.currentPage = 0
        this.totalPages = 0
        this.setState({ movies: [] })
    }

    private showMovieDetail = (movieId: string) => {
        this.props.navigation.navigate(NavigationComponents.Detail, { movieId: movieId})
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
                <Button title="Rechercher" onPress={() => {
                    this.resetSearch()
                    this.loadMovies()
                }} />

                <FlatList
                    data={this.state.movies}
                    keyExtractor={(item) => item.id.toString()}

                    renderItem={({ item }) => <MovieItem movie={item} didSelectMovie={this.showMovieDetail} />}

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

export default Search;