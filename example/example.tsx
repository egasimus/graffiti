import * as React from 'react'
import { Window } from '../src'
import { View, Button, Text, StyleSheet, render, Image } from '../src/react'

const App = () => (
  <View style={styles.container}>
    <View style={styles.sidebar}>
      <Text>Sidebar</Text>

      <Text>Lorem ipsum dolor sit amet</Text>
    </View>
    <View style={styles.main}>
      <Text>Main content</Text>

      <Button title="Click to exit" onPress={() => process.exit()} />

      <Image style={styles.img} source={{ uri: 'docs/images/react-calculator.png' }} />
    </View>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },

  sidebar: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eeeeee',
    backgroundImageUrl: 'docs/images/hello.png',
    justifyContent: 'space-between'
  },

  img: {
    width: 300,
    height: 200,
    backgroundColor: '#eeeeee'
  },

  main: {
    flex: 2,
    alignItems: 'flex-start',
    padding: 20
  }
})

render(<App />, new Window('Example'))
