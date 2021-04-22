import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { NavigationProps } from '../Navigation/NavigationHelper';

class FilmDetail extends React.Component<NavigationProps> {
    render() {
        return (
            <View style={styles.main_container}>
                <Text>Détail du film</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1
    }
})

export default FilmDetail