import React, { ReactNode } from 'react';
import { StyleSheet, Button, TextInput, Text, View, FlatList } from 'react-native';
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
    }
})

// Pour pouvoir donner une propriété à state, on crée un nouveau type
type State = {
    films: Film[]
}

// Il faut une valeur par défaut pour props avant de pouvoir donner le type de state, d'où le {}
class Search extends React.Component<{}, State> {

    constructor(props: {}) {
        super(props)
        this.state = { films: defaultFilms }
    }

    private loadFilms() {
        getFilmsFromAPIWithSearchedText<APIResult>("star").then(data => {
            this.setState({films: data.results})
        })
    }

    render() {
        return (
            // Ici on rend à l'écran les éléments graphiques de notre component custom Search
            <View style={styles.mainContainer}>
                <TextInput style={[styles.textInput, { backgroundColor: 'cyan' }]}
                    placeholder="Titre du film" />
                <Button title="Rechercher" onPress={() => this.loadFilms()} />

                <FlatList
                    data={this.state.films}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <FilmItem film={item} />}
                />
            </View>
        )
    }
}

export default Search;