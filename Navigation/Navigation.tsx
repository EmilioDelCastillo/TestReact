import React from 'react'
import { Image, StyleSheet } from 'react-native'
import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import Favourites from '../Components/Favourites'
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

const MoviesTabNavigator = createBottomTabNavigator({
    Search: {
        screen: SearchStackNavigator,
        navigationOptions: {
            tabBarIcon: () => {
                var source = require("../Images/ic_search.png")
                return (
                    <Image style={styles.icon} source={source} />
                )
            }
        }
    },
    Favourites: {
        screen: Favourites,
        navigationOptions: {
            tabBarIcon: () => {
                var source = require("../Images/ic_favourite.png")
                return (
                    <Image style={styles.icon} source={source} />
                )
            }
        }
    }
}, {
    tabBarOptions: {
        showLabel: false,
        activeBackgroundColor: "#DDDDDD"
    }
})

const styles = StyleSheet.create({
    icon: {
        height: 30,
        width: 30
    }
})
export default createAppContainer(MoviesTabNavigator)