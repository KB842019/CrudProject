import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Dashboard from './src/screens/Dashboard'

const App = () => {
  return (
    <View style={styles.container}>
      <Dashboard />
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
  }
})