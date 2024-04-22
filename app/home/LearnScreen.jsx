import { Animated, FlatList, Image, ImageBackground, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'



const Skeleton = () => {
  return (
    <View style={styles.skeleton}>
      <View style={styles.skeletonCard}>
        <View style={styles.skeletonCardHeader}>
          <View style={{ height: 18, width: 150, borderRadius: 20, backgroundColor: '#534C97' }} />
          <View style={{ flex: 1, flexDirection: 'row', gap: 20 }}>
            <View style={{ height: 18, width: 18, borderRadius: 20, backgroundColor: '#534C97' }} />
            <View style={{ height: 18, width: 18, borderRadius: 20, backgroundColor: '#534C97' }} />
          </View>
        </View>
        <View style={styles.skeletonCardContent}>
          <View style={{ height: 10, width: '100%', borderRadius: 20, backgroundColor: '#534C97' }} />
          <View style={{ height: 10, width: '50%', borderRadius: 20, backgroundColor: '#534C97' }} />
          <View style={{ height: 10, width: '70%', borderRadius: 20, backgroundColor: '#534C97' }} />
          <View style={{ height: 10, width: '90%', borderRadius: 20, backgroundColor: '#534C97' }} />
        </View>
        <View style={styles.skeletonCardFooter}>
          <View style={{ height: 20, width: 54, borderRadius: 20, backgroundColor: '#534C97' }} />
          <View style={{ height: 20, width: 54, borderRadius: 20, backgroundColor: '#534C97' }} />
        </View>
      </View>
    </View>
  )
}




const LearnScreen = () => {

  const [translate] = useLanguage();

  const [scrollY] = useState(new Animated.Value(0));

  const renderItem = (item, index) => {
    const inputRange = [index * 245, (index + 1) * 245];
    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={{ opacity }}>
        <Skeleton />
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>

      <Image style={styles.image} source={require('../assets/main/city.png')} />

      <View style={styles.mainInformation}>
        <View style={styles.mainInformationContainer}>
          <Text style={styles.mainInformationContainerTitle}>
            {translate('learnScreen.headerTitle')}
          </Text>
          <Text style={styles.mainInformationContainerHeader}>
            {translate('learnScreen.headerDescription')}
          </Text>
        </View>
      </View>

      <ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {[...Array(56)].map((_, index) => <View key={index}>{renderItem(_, index)}</View>)}

        <View style={styles.emptyness} />
      </ScrollView>




      {/* <ImageBackground style={styles.image} source={require('../../../assets/main/city.png')}>

      </ImageBackground> */}
    </View>
  )
}

export default LearnScreen

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
      { translateX: 125 }
    ]
  },

  mainInformation: {
    width: '100%',
    padding: 20,

    marginTop: 20
  },
  mainInformationContainer: {
    width: '100%',
    backgroundColor: '#201f47',
    borderWidth: 2,
    borderColor: '#02cfc5',
    borderRadius: 20,

    padding: 20
  },
  mainInformationContainerTitle: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',

    marginBottom: 30
  },
  mainInformationContainerHeader: {
    color: '#fff',
    fontSize: 20
  },



  skeleton: {
    height: 225,
    paddingLeft: 10,
    paddingRight: 10,

    marginBottom: 20

  },
  skeletonCard: {
    backgroundColor: 'rgba(33,31,80, 0.90)',
    width: '100%',
    height: '100%',
    borderRadius: 20
  },
  skeletonCardHeader: {
    padding: 20,
    flexDirection: 'row',
    display: 'flex',
    width: '100%',
    gap: 20
  },
  skeletonCardContent: {
    gap: 10,
    padding: 20
  },
  skeletonCardFooter: {
    padding: 20,
    gap: 20,
    alignContent: 'flex-end',
    display: 'flex',
    flexDirection: 'row'
  },

  emptyness: {
    height: 100
  }
})