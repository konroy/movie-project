import React, {Component} from 'react';
import {Dimensions, Platform} from 'react-native';
import {StackNavigator, createStackNavigator, createBottomTabNavigator, createSwitchNavigator, withNavigation} from 'react-navigation';
import { createStore, applyMiddleware, } from 'redux';
import { Provider } from 'react-redux';
import {Icon} from 'react-native-elements';
import firebase from 'react-native-firebase';
import { apiMiddleware, reducer } from './redux';

import Movies from './movies';
import Confirmation from './confirmation';
import Profile from './profile';
import Loading from './authentication/Loading';
import SignUp from './authentication/SignUp';
import Login from './authentication/Login';
import Main from './authentication/Main';
import {movies} from './populate';

//create Redux store
const store = createStore(reducer,{},applyMiddleware(apiMiddleware));
//fetch movie data
store.dispatch({type: 'GET_MOVIE_DATA'});

let screen = Dimensions.get('window');

export const Authentication = createSwitchNavigator(
    {
      Loading,
      SignUp,
      Login,
    },
    {
      initialRouteName: 'Loading'
    }
  )
  
export const MovieStack = createStackNavigator(
        {
            First: {
                screen: Movies,
            },
            Second: {
                screen: Confirmation,
            }
        },
        {
            headerMode: "none",
            mode: "modal"
        }
    );

export const Tabs = createBottomTabNavigator({
    'Movies':{
        screen: Movies,
        navigationOptions:{
            tabBarLabel: 'Movies',
            tabBarIcon: ({tintColor}) => <Icon name="movie" type="MaterialCommunityIcons" size={28} color={tintColor}/>
        },
    },
    'My Profile': {
        screen: Main,
        navigationOptions: {
            tabBarLabel: 'Profile',
            tabBarIcon: ({tintColor}) => <Icon name="ios-person" type="ionicon" size={28} color={tintColor}/>
        },
    },
});

export const CreateRootNavigator = createStackNavigator(
        {
            Auth: {
                screen: Authentication,
                navigationOptions: ({navigation}) => ({
                    gesturesEnabled: false,
                    header: null,
                })
            },
            Tabs: {
                screen: Tabs,
                navigationOptions: ({navigation}) => ({
                    gesturesEnabled: false,
                    header: null,
                })
            },
            MovieStack: {
                screen: MovieStack,
                navigationOptions: ({navigation}) => ({
                    gesturesEnabled: false,
                    header: null,
                })
            }
        }
    );

export default class App extends Component{
    
    componentWillMount(){
    /*
     var config = {
        apiKey: "AIzaSyD9VYAb2ynq8g4hf-QbGxMDK1albBlwj5k",
        authDomain: "movie-project-84a46.firebaseapp.com",
        databaseURL: "https://movie-project-84a46.firebaseio.com",
        projectId: "movie-project-84a46",
        storageBucket: "movie-project-84a46.appspot.com",
        messagingSenderId: "128986273989"
    };
    firebase.initializeApp(config);*/
    firebase.database().ref().set({movies})
    .then(()=>{
        console.log('SUCCESS');
    }).catch((error)=>{
        console.log(error);
    })
    }

    render() {
        return (
            <Provider store={store}>
              <CreateRootNavigator />
            </Provider>
        );
      }
    }