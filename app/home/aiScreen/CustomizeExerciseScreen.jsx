import { ActivityIndicator, Dimensions, FlatList, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import useStore from '../../libs/statusMachine'

import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';


// import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';

// const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// const AspectView = ({ style, children, ...props }) => {
//   const scale = useSharedValue(1);

//   const handlePressIn = () => {
//     scale.value = withSpring(0.95); // Scale down slightly on press in
//   };

//   const handlePressOut = () => {
//     scale.value = withSpring(1); // Return to original scale on press out
//   };

//   return (
//     <AnimatedPressable
//       style={[style, { width: CARD_WIDTH, height: CARD_HEIGHT, transform: [{ scale }] }]}
//       onPressIn={handlePressIn}
//       onPressOut={handlePressOut}
//       {...props}
//     >
//       {children}
//     </AnimatedPressable>
//   );
// };





const CustomizeExerciseScreen = () => {

  const [translate] = useLanguage();

  const [currentSelectedExercises, setCurrentSelectedExercises] = useState([]);
  const [opacity, setOpacity] = useState(1);
  const [pending, setPending] = useState(false);

  const { currentSubject, currentSubjectExercises, setCurrentSubjectSelectedExercises } = useStore();
  const navigation = useNavigation();


  const ASPECT_RATIO = 1; // Example aspect ratio
  const { width } = Dimensions.get('window');
  const CARD_WIDTH = width * 0.135; // Example width calculation
  const CARD_HEIGHT = CARD_WIDTH / ASPECT_RATIO;



  const Square = React.memo(({ text, isSelected, onPress }) => (
    <Pressable
      style={({ pressed }) => [
        styles.square,
        isSelected ? styles.selectedSquare : styles.unselectedSquare,
        { width: CARD_WIDTH, height: CARD_HEIGHT },
        { opacity: pressed ? 0.4 : opacity },
      ]}
      onPress={() => onPress()}
    >
      <Text style={styles.exerciseContainertItemText}>{text}</Text>
    </Pressable>
  ));



  const changeSelectedElements = () => {
    if (currentSelectedExercises.length === 0) {
      setCurrentSelectedExercises(currentSubjectExercises)
    } else {
      setCurrentSelectedExercises([])
    }
  }

  const toggleSelection = useCallback((exercise) => {
    requestAnimationFrame(() => {
      setCurrentSelectedExercises(prevSelected => {
        if (prevSelected.includes(exercise)) {
          return prevSelected.filter(item => item !== exercise);
        } else {
          return [...prevSelected, exercise];
        }
      });
    });
  }, []);

  const startExercises = async () => {
    setPending(true)
    await setCurrentSubjectSelectedExercises(currentSelectedExercises)
    navigation.navigate('Topic')
    setPending(false)
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.titleWrapper}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: '#fff', fontSize: 30, fontWeight: 'bold', letterSpacing: 1 }}>
            {currentSubject}
          </Text>
        </View>
        <View style={styles.descriptionWrapper}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>
            {translate('customizeExerciseScreen.headerDescription')}
          </Text>
        </View>
        <View style={styles.separator} />
        <TouchableOpacity
          style={[styles.changeSelectedElementsButton, currentSelectedExercises.length === 0 ? { borderColor: '#02cfc5' } : { borderColor: '#6252b0' }]}
          onPress={() => changeSelectedElements()}
        >
          {currentSelectedExercises.length === 0 ? (
            <Text style={styles.changeSelectedElementsButtonText}>
              {translate('customizeExerciseScreen.selectAllExercises')}
            </Text>
          ) : (
            <Text style={styles.changeSelectedElementsButtonText}>
              {translate('customizeExerciseScreen.deselectAllExercises')}
            </Text>
          )}
        </TouchableOpacity>
        <View style={styles.exerciseContainer}>
          {currentSubjectExercises.map((exercise, index) => (
            <Square
              key={index}
              text={exercise}
              isSelected={currentSelectedExercises.includes(exercise)}
              exercise={exercise}
              onPress={() => toggleSelection(exercise)}
            />
          ))}
        </View>
        <TouchableOpacity
          onPress={() => startExercises()}
          disabled={currentSelectedExercises.length === 0 || pending}
          style={[
            styles.submitButton,
            (currentSelectedExercises.length === 0 || pending) && { backgroundColor: "#006862" },
          ]}
        >
          {pending ? (
            <ActivityIndicator
              size={'large'}
              color="#A59CFB"
            />
          ) : (
            <Text style={[
              styles.submitButtonText,
              (currentSelectedExercises.length === 0 || pending) && { color: "#8d8d8d" }
            ]}>
              {translate('customizeExerciseScreen.startExercising')}
            </Text>
          )}
        </TouchableOpacity>
        <View style={styles.emptyness} />
      </KeyboardAwareScrollView>
    </View>
  )
}

export default CustomizeExerciseScreen

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: "#271D59",
    // padding: 20,
    // paddingTop: 40
  },
  scrollView: {

  },

  titleWrapper: {
    marginTop: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginHorizontal: 20
  },
  descriptionWrapper: {
    marginTop: 40,
    marginBottom: 10,
    marginHorizontal: 20
  },
  separator: {
    width: 'auto',
    height: 1,
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 15,
    marginHorizontal: 20,
  },
  changeSelectedElementsButton: {
    width: 'auto',
    paddingVertical: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    borderWidth: 2,
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 20
  },
  changeSelectedElementsButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2
  },
  submitButton: {
    width: 'auto',
    height: 70,
    backgroundColor: '#02cfc5',
    color: '#fff',
    // borderWidth: 2,
    // borderColor: "#A59CFB",
    borderRadius: 15,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 50,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 1
  },




  exerciseContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Align items to the start (left)
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 10,
    marginTop: 20
  },
  square: {
    // borderColor: '#796CFF',
    // borderWidth: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: 10,
    // backgroundColor: '#6252b0'
    // backgroundColor: '#4c3e95'
  },
  selectedSquare: {
    backgroundColor: '#6252b0', // Selected color
    borderWidth: 2,
    borderColor: '#02cfc5'
  },
  unselectedSquare: {
    backgroundColor: '#4c3e95', // Unselected color
  },
  exerciseContainertItemText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },




  emptyness: {
    height: 160
  }
})