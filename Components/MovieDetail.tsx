import React from 'react'
import { StyleSheet, View, Text, Image, ActivityIndicator } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { NavigationProps } from '../Navigation/NavigationHelper';
import { getMovieById, getImageFromAPI } from '../API/TMDBapi'

// What we need from the API
interface Movie {
    title: string,
    release_date: string,
    overview: string,
    poster_path: string
}

interface State {
    movie?: Movie,
    isLoading: boolean
}

class MovieDetail extends React.Component<NavigationProps, State> {

    private getMovie() {
        // We are certain that a movieId exists since it is sent by the navigation thingy
        const movieId = this.props.navigation.state.params!.movieId as string

        getMovieById<Movie>(movieId).then(data => {
            this.setState({
                movie: data,
                isLoading: false
            })
        })
    }

    constructor(props: NavigationProps) {
        super(props)
        this.state = {
            movie: undefined,
            isLoading: true
        }
    }

    private displayMovieDetails() {
        if (this.state.movie) {
            return (
                <ScrollView>
                    <Image
                        style={styles.poster}
                        source={{ uri: getImageFromAPI(this.state.movie.poster_path) }}
                        resizeMode="contain"
                    />

                    <Text style={styles.title_text}>{this.state.movie.title}</Text>

                    <Text style={styles.date_text}>{this.state.movie.release_date}</Text>

                    <Text style={styles.description_text}>{this.state.movie.overview}</Text>
                </ScrollView>
            )
        }
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

    componentDidMount() {
        this.getMovie()
    }

    render() {
        return (
            <View style={styles.main_container}>
                {this.displayMovieDetails()}
                {this.displayActivityIndicator()}
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
    },
    activity_indicator: {
        position: 'absolute', // Afficher par dessus tout
        alignItems: 'center', // Centrer
        justifyContent: 'center',
        top: 0, // Laisser de l'espace pour les inputs en haut de l'écran
        left: 0, // Mais se coller aux autres bords pour que le spinner soit bien au milieu
        right: 0,
        bottom: 0
    }
})

export default MovieDetail