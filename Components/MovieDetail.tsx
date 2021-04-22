import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
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
    movie: Movie
}

class MovieDetail extends React.Component<NavigationProps, State> {

    private getMovie() {
        // We are certain that a movieId exists since it is sent by the navigation thingy
        const movieId = this.props.navigation.state.params!.movieId as string

        getMovieById<Movie>(movieId).then(data => {
            this.setState({
                movie: data
            })
        })
    }

    constructor(props: NavigationProps) {
        super(props)
        this.state = {
            movie: {
                title: "",
                release_date: "",
                overview: "",
                poster_path: ""
            }
        }
        this.getMovie()
    }

    render() {
        return (
            <View style={styles.main_container}>
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

export default MovieDetail