import React from "react"
import { FlatList, StyleSheet } from "react-native"
import { connect } from "react-redux"
import { Movie } from "../Helpers/moviesData"
import { NavigationComponents, NavigationProps } from "../Navigation/NavigationHelper"
import { GlobalState } from "../Store/Reducers/favouriteReducer"
import MovieItem from "./MovieItem"

interface Props extends ReduxType, NavigationProps{
    movies: Movie[],
    loadMovies: () => void
    page: number
    totalPages: number
}

class MovieList extends React.Component<Props> {

    constructor(props: Props) {
        super(props)
        this.showMovieDetail = this.showMovieDetail.bind(this)
    }

    /**
     * Navigates to the MovieDetails component.
     * @param movieId The identifier of the movie whose details will be displayed.
     */
    private showMovieDetail(movieId: string) {
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
            <FlatList
                style={styles.list}
                data={this.props.movies}
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
                    if (this.props.page < this.props.totalPages) {
                        this.props.loadMovies()
                    }
                }}
            />
        )
    }
}

const styles = StyleSheet.create({
    list: {
        flex: 1
    }
})

const mapStateToProps = (state: GlobalState) => {
    return {
        favouriteMovies: state.favouriteMovies
    }
}
type ReduxType = ReturnType<typeof mapStateToProps>
export default connect(mapStateToProps)(MovieList)