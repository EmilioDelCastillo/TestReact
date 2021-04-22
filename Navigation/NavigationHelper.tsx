import { NavigationParams, NavigationScreenProp, NavigationState } from 'react-navigation';

/**
 * Components implemented in the navigation system
 */
export enum NavigationComponents {
    /**
     * The main screen
     */
    Search = "Search",
    /**
     * The movie detail screen
     */
    Detail = "Detail"
}

/**
 * Props needed to do navigation.
 */
export interface NavigationProps {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
}