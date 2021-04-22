import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import MovieDetail from '../Components/MovieDetail'
import Search from '../Components/Search'

const SearchStackNavigator = createStackNavigator({
    Search: {
        screen: Search,
        navigationOptions: {
            title: "Recherche"
        }
    },

    Detail: {
        screen: MovieDetail,
        navigationOptions: {
            title: "Détails"
        }
    }
})

export default createAppContainer(SearchStackNavigator)