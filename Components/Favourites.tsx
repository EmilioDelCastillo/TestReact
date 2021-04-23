import React from 'react'
import { connect } from 'react-redux'
import { NavigationProps } from '../Navigation/NavigationHelper'
import { GlobalState } from '../Store/Reducers/favouriteReducer'
import MovieList from './MovieList'

interface Props extends ReduxType { }

class Favourites extends React.Component<Props & NavigationProps> {
    render() {
        return (
            <MovieList
                movies={this.props.favouriteMovies}
                loadMovies={() => { }}
                page={1}
                totalPages={1}
                navigation={this.props.navigation}
            />
        )
    }
}


const mapStateToProps = (state: GlobalState) => {
    return {
        favouriteMovies: state.favouriteMovies
    }
}

type ReduxType = ReturnType<typeof mapStateToProps>
export default connect(mapStateToProps)(Favourites)