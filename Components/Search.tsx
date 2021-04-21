import React, { ReactNode } from 'react';
import { StyleSheet, Button, TextInput, Text, View, FlatList, ActivityIndicator } from 'react-native';
import { getFilmsFromAPIWithSearchedText } from '../API/TMDBapi';
import type { APIResult } from '../API/TMDBapi'

import FilmItem from './FilmItem';
import type { Film } from '../Helpers/FilmsData'
import defaultFilms from '../Helpers/FilmsData'

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        marginTop: 40
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
type State = {
    films: Film[],
    isLoading: boolean
}

// Il faut une valeur par défaut pour props avant de pouvoir donner le type de state, d'où le {}
class Search extends React.Component<{}, State> {

    searchString: string
    constructor(props: {}) {
        super(props)
        this.state = {
            films: defaultFilms,
            isLoading: false
        }
        this.searchString = ""
    }

    private loadFilms() {
        if (this.searchString.length > 0) {
            this.setState({ isLoading: true })
            getFilmsFromAPIWithSearchedText<APIResult>(this.searchString).then(data => {
                this.setState({
                    films: data.results,
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
                        this.loadFilms()
                    }}
                />
                <Button title="Rechercher" onPress={() => this.loadFilms()} />

                <FlatList
                    data={this.state.films}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <FilmItem film={item} />}
                />
                {this.displayActivityIndicator()}
            </View>
        )
    }
}

export default Search;