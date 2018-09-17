//renders a confirmation code along with a button
//to close the screen and go back to movie list

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {defaultStyles} from './styles';

export default class Confirmation extends Component{

    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.header}>Your confirmation code</Text>
                <Text style={styles.code}>{this.props.navigation.state.params.code}</Text>
                <TouchableOpacity
                    style={styles.buttonContainer}
                    //go back when pressed
                    onPress={()=>this.props.navigation.navigate('Tabs')}
                >
                    <Text style={styles.button}>Done</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header:{
        ...defaultStyles.text,
        color: '#333',
        fontSize: 20,
    },
    code: {
        ...defaultStyles.text,
        color:'#333',
        fontSize: 36,
    },
    buttonContainer:{
        alignItems: 'center',
        backgroundColor: '#b73a3a',
        borderRadius: 100,
        margin: 20,
        paddingVertical: 10,
        paddingHorizontal: 30,
    },
    button: {
        ...defaultStyles.text,
        color: '#FFFFFF',
        fontSize: 18,
    },
});