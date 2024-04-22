import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const PractiseScreen = () => {
  return (
    <View style={styles.container}>
      
      <Image style={styles.image} source={require('../assets/main/city.png')} />

    </View>
  )
}

export default PractiseScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
    position: 'absolute',
    transform: [
      { scaleX: 3.5 },
      { translateX: 100 }
    ]
  },
})