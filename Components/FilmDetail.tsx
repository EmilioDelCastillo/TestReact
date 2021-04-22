import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationProps } from '../Navigation/NavigationHelper';
import { getFilmById, getImageFromAPI } from '../API/TMDBapi'

// What we need from the API
interface Film {
    title: string,
    release_date: string,
    overview: string,
    poster_path: string
}

interface State {
    film: Film
}

class FilmDetail extends React.Component<NavigationProps, State> {

    private getFilm() {
        // We are certain that a filmId exists since it is sent by the navigation thingy
        const filmId = this.props.navigation.state.params!.filmId as string

        getFilmById<Film>(filmId).then(data => {
            this.setState({
                film: data
            })
        })
    }

    constructor(props: NavigationProps) {
        super(props)
        this.state = {
            film: {
                title: "",
                release_date: "",
                overview: "",
                poster_path: ""
            }
        }
        this.getFilm()
    }

    render() {
        return (
            <View style={styles.main_container}>
                <ScrollView>
                    <Image
                        style={styles.poster}
                        source={{ uri: getImageFromAPI(this.state.film.poster_path) }}
                        resizeMode="contain"
                    />

                    <Text style={styles.title_text}>{this.state.film.title}</Text>

                    <Text style={styles.date_text}>{this.state.film.release_date}</Text>

                    <Text style={styles.description_text}>{this.state.film.overview}</Text>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1
    },
    poster: {
        backgroundColor: 'grey',
        height: 300,
        margin: 5
    },
    title_text: {
        textAlign: 'center',
        fontSize: 30,
        fontWeight: 'bold'
    },
    date_text: {
        textAlign: 'center',
        fontStyle: 'italic'
    },
    description_text: {
        margin: 10
    }
})

export default FilmDetail