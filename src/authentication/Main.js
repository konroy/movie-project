// Main.js

import React from 'react'
import { StyleSheet, Platform, Image, Text, View, Button } from 'react-native'
import firebase from 'react-native-firebase';

export default class Main extends React.Component {
  state = { currentUser: null }

  componentDidMount(){
    const {currentUser} = firebase.auth()
    this.setState({currentUser})
  }

  signOutUser = async () => {
    try {
        await firebase.auth().signOut();
        navigate('Loading');
    } catch (e) {
        console.log(e);
    }
  }
render() {
    const { currentUser } = this.state

return (
      <View style={styles.container}>
        <Text>
          Hi {currentUser && currentUser.email}!
        </Text>
        <Button title="Sign Out" onPress={this.signOutUser} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})