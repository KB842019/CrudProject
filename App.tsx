import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import HomeSreen from './src/HomeSreen'

const App = () => {
  return (
    <View style={styles.container}>
      <Text>App:Kaushal Bhardwaj</Text>
      <HomeSreen />
    </View>
  )
}

export default App

const styles = StyleSheet.create({
  container:{
    height:'100%',
    width:'100%',
    paddingVertical:40,
    paddingHorizontal:20,
    backgroundColor:'skyblue'
  }
})