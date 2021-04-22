import React, { ReactNode } from "react";
import { StyleSheet, Text, View, Image, Touchable } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getImageFromAPI } from "../API/TMDBapi";
import type { Movie } from '../Helpers/moviesData'

// Les props sont un objet, donc on fait un objet qui contient une propriété movie de type Movie
class MovieItem extends React.Component<{ movie: Movie, didSelectMovie: (id: string) => void }> {

    render() {
        // Pour éviter de le réécrire partout
        const { movie, didSelectMovie } = this.props
        return (
            <TouchableOpacity
                style={styles.main_container}
                onPress={() => didSelectMovie(movie.id.toString())}
            >
                <Image style={styles.thumbnail}
                    source={{ uri: getImageFromAPI(movie.poster_path) }} />

                {/* Content */}
                <View style={styles.content_container}>
                    {/* Header */}
                    <View style={styles.header_container}>
                        <Text style={styles.title_text}>{movie.title}</Text>
                        <Text style={styles.vote_text}>{movie.vote_average}</Text>
                    </View>

                    {/* Description */}
                    <View style={styles.desciption_container}>
                        <Text style={styles.description_text} numberOfLines={6}>{movie.overview}</Text>
                    </View>

                    {/* Date */}
                    <View style={styles.date_container}>
                        <Text style={styles.date_text}>Sorti le {movie.release_date}</Text>
                    </View>

                </View>

            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flexDirection: 'row',
        height: 190,
        // margin: 10
    },

    thumbnail: {
        width: 120,
        margin: 5,
        backgroundColor: 'gray'
    },

    content_container: {
        flex: 1,
        margin: 5
    },

    header_container: {
        flex: 3,
        flexDirection: 'row',
    },
    title_text: {
        flex: 1,
        flexWrap: 'wrap',
        fontSize: 20,
        fontWeight: 'bold',
        paddingRight: 5
    },
    vote_text: {
        fontWeight: 'bold',
        fontSize: 26
    },

    desciption_container: {
        flex: 7
    },
    description_text: {
        fontStyle: 'italic',
        color: '#666666'
    },

    date_container: {
        flex: 1
    },
    date_text: {
        textAlign: 'right',
        fontSize: 14
    }
})

export default MovieItem