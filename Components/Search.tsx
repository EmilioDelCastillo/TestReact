import React, { ReactNode } from 'react';
import { StyleSheet, Button, TextInput, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { getFilmsFromAPIWithSearchedText } from '../API/TMDBapi';
import type { APIResult } from '../API/TMDBapi'

import FilmItem from './FilmItem';
import type { Film } from '../Helpers/FilmsData'
import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';
import { NavigationComponents } from '../Navigation/NavigationHelper'

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

// Pour pouvoir utiliser la navigation, on doit indiquer le type d'objet utilisé
type Props = {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}
// Pour pouvoir donner une propriété à state, on crée un nouveau type
type State = {
    films: Film[],
    isLoading: boolean
}

class Search extends React.Component<Props, State> {

    searchString: string
    currentPage: number
    totalPages: number

    constructor(props: Props) {
        super(props)
        this.state = {
            films: [],
            isLoading: false
        }
        this.searchString = ""
        this.currentPage = 0
        this.totalPages = 0
    }

    private loadFilms() {
        if (this.searchString.length > 0) {
            this.setState({ isLoading: true })
            getFilmsFromAPIWithSearchedText<APIResult>(this.searchString, this.currentPage + 1).then(data => {
                this.currentPage = data.page
                this.totalPages = data.total_pages

                // Avoid duplicates, stupid API sometimes returns the same film on two different pages
                let newFilms = data.results.filter(newFilm => {
                    return this.state.films.findIndex(film => film.id == newFilm.id) == -1
                })

                this.setState({
                    films: [...this.state.films, ...newFilms],
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
        this.setState({ films: [] })
    }

    private showFilmDetail = (filmId: string) => {
        const { navigation } = this.props
        navigation.navigate(NavigationComponents.Detail)
    }

    render() {
        return (
            // Ici on rend à l'écran les éléments graphiques de notre component custom Search
            <View style={styles.mainContainer}>
                <TextInput
                    style={[styles.textInput, { backgroundColor: 'cyan' }]}
                    placeholder="Titre du film"

                    // A chaque nouveau caractère on met à jour la chaîne de caractères à chercher
                    onChange={(event) => this.updateSearchString(event.nativeEvent.text)}

                    // Lorsqu'on appuie sur "retour" ça charge la liste des films
                    onSubmitEditing={(event) => {
                        this.resetSearch()
                        this.loadFilms()
                    }}
                />
                <Button title="Rechercher" onPress={() => {
                    this.resetSearch()
                    this.loadFilms()
                }} />

                <FlatList
                    data={this.state.films}
                    keyExtractor={(item) => item.id.toString()}

                    renderItem={({ item }) => <FilmItem film={item} didSelectFilm={this.showFilmDetail} />}

                    onEndReachedThreshold={0.5}
                    onEndReached={() => {
                        if (this.currentPage < this.totalPages) {
                            this.loadFilms()
                        }
                    }}
                />
                {this.displayActivityIndicator()}
            </View>
        )
    }
}

export default Search;