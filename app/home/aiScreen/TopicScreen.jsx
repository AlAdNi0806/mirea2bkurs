import { ActivityIndicator, Button, Dimensions, FlatList, Image, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { GetExercises, MakeBecomeTesterRequest } from '../../libs/queries';
import { useAuth } from '../../context/AuthContext';
import useStore from '../../libs/statusMachine';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';


import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useNavigation } from '@react-navigation/native';


import AnimatedBottomDrawer from 'react-native-animated-bottom-drawer';
import BottomDrawer from 'react-native-animated-bottom-drawer';
import { useLanguage } from '../../context/LanguageContext';


const TopicScreen = () => {
  let contentRef;
  let exerciseRef;
  const bottomDrawerRef = useRef(null);

  const NUMBER_OF_ITEMS_TO_ADD = 10;


  const [translate] = useLanguage();

  const [keyOpen, setKeyOpen] = useState(false)

  // const [data, setData] = useState([Array.from({ length: NUMBER_OF_ITEMS_TO_ADD }, (_, i) => i + 1)]);

  const [data, setData] = useState([]);
  const [dataContent, setDataContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(1);
  const [initialLoad, setinitialLoad] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [becomeTesterRequest, setBecomeTesterRequest] = useState('')
  const [becomeTesterRequestError, setBecomeTesterRequestError] = useState('')
  const [becomeTesterRequestPending, setBecomeTesterRequestPending] = useState(false)


  const { authState, onLogout } = useAuth();
  const token = authState.token


  const { currentShortenedSubject, currentSubjectSelectedExercises, setKeyboardOpen, setSentBecomeTesterRequest, sentBecomeTesterRequest, roles } = useStore()
  const navigation = useNavigation();


  useEffect(() => {
    async function getExercises() {
      const result = generateRandomObject(currentSubjectSelectedExercises);
      // temporarySearch = { '16': 2, }
      const exercises = await GetExercises(token, currentShortenedSubject, result)

      numberOfElementsToAdd = exercises.exercises.length
      setData([
        ...data,
        ...Array.from({ length: numberOfElementsToAdd }, (_, i) => ({
          id: data.length + i + 1,
          status: 'neutral'
        }))
      ]);
      const exercisesWithExtraFields = exercises.exercises.map(exercise => ({
        ...exercise,
        answered: false, // Default value for 'answered'
        input: '', // Default value for 'input'
        status: '',
        explanationOpen: false,
        aiExplanation: ''
      }));
      setDataContent(exercisesWithExtraFields)
      // console.log("haha")
      // console.log("haha")
      // console.log("haha")
      // console.log(dataContent)
      // console.log("haha")
      // console.log("haha")
      // console.log("haha")
      // console.log(data)
      // console.log("haha")
      // console.log("haha")
      // console.log("haha")
      // console.log(exercises.exercises)
      // console.log("haha")
      // console.log("haha")
      // console.log("haha")
      // console.log(exercises.exercises[selectedItem - 1].condition)

      setinitialLoad(false)
    }
    if (initialLoad) {
      setData([])
      setDataContent([])
      getExercises()
    }
  }, []);

  function generateRandomObject(keys) {
    const exercises = {};
    let remainingSum = 10;
    let remainingKeys = [...keys]; // Copy the array to avoid mutating the original

    // Determine the maximum value based on the number of keys
    const maxValue = Math.max(2, Math.floor(20 / remainingKeys.length));

    while (remainingSum > 0 && remainingKeys.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingKeys.length);
      const key = remainingKeys[randomIndex];
      remainingKeys.splice(randomIndex, 1); // Remove the key from the array to avoid duplicates

      // Calculate a random value for the key that does not exceed the remaining sum, is not 0, and is within the maximum value
      let value = Math.min(Math.floor(Math.random() * (remainingSum + 1)), remainingSum);
      if (value === 0) {
        value = 1; // Ensure the value is not 0
      }
      value = Math.min(value, maxValue); // Ensure the value does not exceed the maximum value
      exercises[key] = value;
      remainingSum -= value;
    }

    return exercises;
  }

  const handleLoadMore = async () => {
    if (data) {
      setLoading(true);
      // setTimeout(() => {
      //   setData([...data, ...Array.from({ length: NUMBER_OF_ITEMS_TO_ADD }, (_, i) => data.length + i + 1)]);
      //   setLoading(false);
      // }, 2000); // Simulate a 2-second delay
      setData([
        ...data,
        {
          id: 'loading',
          status: 'neutral'
        }
      ])
      const result = generateRandomObject(currentSubjectSelectedExercises);
      const exercises = await GetExercises(token, currentShortenedSubject, result)

      const removeLoadingData = data.filter(item => item.id !== "loading");
      setData(removeLoadingData);

      numberOfElementsToAdd = exercises.exercises.length
      setData([
        ...data,
        ...Array.from({ length: numberOfElementsToAdd }, (_, i) => ({
          id: data.length + i + 1,
          status: 'neutral'
        }))
      ]);
      const exercisesWithExtraFields = exercises.exercises.map(exercise => ({
        ...exercise,
        answered: false, // Default value for 'answered'
        input: '', // Default value for 'input'
        status: '',
        explanationOpen: false,
        aiExplanation: ''
      }));
      setDataContent([...dataContent, ...exercisesWithExtraFields])
      setLoading(false);
    }
  };

  const updateInputField = (index, newInput) => {
    // Create a new array by mapping over the existing state
    const updatedExercises = dataContent.map((exercise, i) => {
      // If the current item's index matches the index we're updating, return a new object with the updated input
      if (i === index) {
        return { ...exercise, input: newInput };
      }
      // Otherwise, return the item as is
      return exercise;
    });

    // Update the state with the new array
    setDataContent(updatedExercises);
  };

  const updateIfExplanationOpen = (index, state) => {
    // Create a new array by mapping over the existing state
    const updatedExercises = dataContent.map((exercise, i) => {
      // If the current item's index matches the index we're updating, return a new object with the updated input
      if (i === index) {
        return { ...exercise, explanationOpen: state };
      }
      // Otherwise, return the item as is
      return exercise;
    });

    // Update the state with the new array
    setDataContent(updatedExercises);
  };

  const updateExercisePassage = (index, status) => {
    // Create a new array by mapping over the existing state
    const updatedExercises = dataContent.map((exercise, i) => {
      // If the current item's index matches the index we're updating, return a new object with the updated input
      if (i === index) {
        return { ...exercise, status: status.toString(), answered: true };
      }
      // Otherwise, return the item as is
      return exercise;
    });

    const updatedData = data.map((exercise, i) => {
      // If the current item's index matches the index we're updating, return a new object with the updated input
      if (i === index) {
        return { ...exercise, status: status.toString() };
      }
      // Otherwise, return the item as is
      return exercise;
    });

    // Update the state with the new array
    setDataContent(updatedExercises);
    setData(updatedData)
  };

  const makeBecomeTesterRequest = async () => {
    setBecomeTesterRequestPending(true)
    setBecomeTesterRequestError('')
    console.log(becomeTesterRequest)
    if (becomeTesterRequest.length > 3) {
      const result = await MakeBecomeTesterRequest(token, becomeTesterRequest)
      setSentBecomeTesterRequest(true)
    } else {
      setBecomeTesterRequestError(translate('topicScreen.drawerTextInputError'))
    }
    setBecomeTesterRequestPending(false)
  }

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../../assets/main/city.png')} />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='handled'
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.titleWrapper}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Subjects')}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', letterSpacing: 1 }}>
            {translate('topicScreen.headerTitle')}
          </Text>
        </View>
        {data && (
          <FlatList
            ref={(ref) => { exerciseRef = ref }}
            data={data}
            renderItem={({ item }) => (
              <Pressable
                style={[
                  styles.item,
                  item.status === 'true' && { backgroundColor: 'rgba(50,255,78,0.15)', borderColor: 'rgba(50,255,78,0.3)' },
                  item.status === 'false' && { backgroundColor: 'rgba(255,50,50,0.15)', borderColor: 'rgba(255,50,50,0.3)' },
                  item.id === selectedItem && item.status === 'neutral' && { backgroundColor: 'rgba(121,108,255,0.5)' },
                  item.id === selectedItem && item.status === 'true' && { backgroundColor: 'rgba(41,221,66,0.5)', borderColor: '#29dd42' },
                  item.id === selectedItem && item.status === 'false' && { backgroundColor: 'rgba(255,50,50,0.5)', borderColor: '#FF3232' },
                  item.id === 1 && { marginLeft: 15 }
                ]}
                onPress={() => {
                  if (item.id !== 'loading') {
                    setSelectedItem(item.id)
                    // setTimeout(() => {
                    //   contentRef.scrollToIndex({ animated: true, index: item.id - 1 })
                    // }, 100);
                    contentRef.scrollToIndex({ animated: true, index: item.id - 1 })
                  }
                }}
              >
                {item.id === 'loading' ? (
                  <View style={styles.itemText}>
                    <ActivityIndicator
                      size={'large'}
                      color="#A59CFB"
                    />
                  </View>
                ) : (
                  <Text
                    style={[
                      styles.itemText,
                      item === selectedItem ? styles.selectedItemText : null,
                    ]}
                  >
                    {item.id}
                  </Text>
                )}
              </Pressable>
            )}
            // keyExtractor={(item) => item.id.toString()}
            horizontal
            onEndReached={() => {
              if (!loading) {
                handleLoadMore()
              }
            }}
            // onEndReachedThreshold={0.5}
            // ListFooterComponent={loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
            style={styles.flatList}
            showsHorizontalScrollIndicator={false}
          />
        )}
        {/* <Text style={{ color: '#fff', fontSize: 30 }}>Current Index: {currentIndex}</Text> */}
        {initialLoad ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 200 }}>
            <ActivityIndicator
              size={'large'}
              color="#A59CFB"
            />
          </View>
        ) : (
          dataContent && (
            <FlatList
              // onScrollToIndexFailed={info => {
              //   // Handle the failure, e.g., by retrying the scroll
              // }}
              initialNumToRender={30}
              style={{ backgroundColor: 'transparent' }}
              keyboardShouldPersistTaps='handled'
              onMomentumScrollEnd={(event) => {
                const index = Math.floor(event.nativeEvent.contentOffset.x / Dimensions.get('screen').width);
                if (index >= 0) {
                  setCurrentIndex(index);
                  setSelectedItem(index + 1);
                  exerciseRef.scrollToIndex({ animated: true, index: index })
                }
              }}
              data={dataContent}
              horizontal={true}
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              ref={(ref) => { contentRef = ref }}
              // snapToInterval={Dimensions.get('screen').width}
              bounces={false}
              renderItem={({ item, index }) => (
                <View style={{ width: Dimensions.get('screen').width }}>
                  <View style={styles.bodyWrapper}>
                    <Text style={styles.exerciseTopic}>
                      {translate('topicScreen.exerciseText')} {item.topic}
                    </Text>
                    <View style={styles.bodyExercise}>
                      <Text style={styles.bodyExerciseText}>
                        {item.condition.text}
                      </Text>
                    </View>
                    <TextInput
                      style={[
                        styles.textInput,
                        item.status === 'true' && { borderWidth: 2, borderColor: '#29dd42', backgroundColor: 'transparent', color: '#b8b8b8' },
                        item.status === 'false' && { borderWidth: 2, borderColor: '#FF3232', backgroundColor: 'transparent', color: '#b8b8b8' },
                        // item.status === 'true' && { borderWidth: 2, borderColor: "#4c3e95", backgroundColor: 'transparent', color: '#b8b8b8' },
                        // item.status === 'false' && { borderWidth: 2, borderColor: "#4c3e95", backgroundColor: 'transparent', color: '#b8b8b8' }
                      ]}
                      editable={!item.answered}
                      onChangeText={(text) => updateInputField(index, text)}
                      autoCapitalize="none"
                      placeholderTextColor={'#8A80F2'}
                      placeholder={translate('topicScreen.textInputPlaceholder')}
                      onFocus={() => setKeyboardOpen(true)}
                      onBlur={() => setKeyboardOpen(false)}
                      value={item.input}
                    />
                    {item.answered ? (
                      <View >
                        <Text
                          style={[
                            { fontSize: 16, marginTop: -5 },
                            item.status === 'true' && { color: '#29dd42' },
                            item.status === 'false' && { color: '#FF3232' }
                          ]}
                        >
                          {translate('topicScreen.correctAnswerText')} {item.answer}
                        </Text>
                        <Pressable
                          onPress={() => updateIfExplanationOpen(index, !item.explanationOpen)}
                        >
                          <Text
                            style={{ color: '#fff', fontSize: 16, marginTop: 20, marginBottom: 20, textDecorationLine: 'underline' }}
                          // style={{ color: '#02cfc5', fontSize: 20, marginTop: 20, marginBottom: 20 }}
                          >
                            {item.explanationOpen ? translate('topicScreen.hideExplanation') : translate('topicScreen.openExplanation')}
                          </Text>
                        </Pressable>
                        {item.explanationOpen && (
                          <View>
                            <Text style={{ color: '#fff', fontSize: 26, fontWeight: '700', marginBottom: 10 }}>
                              {translate('topicScreen.explanationText')}
                            </Text>
                            <View style={[styles.bodyExercise, { marginBottom: 20 }]}>
                              <Text style={styles.bodyExerciseText}>
                                {item.solution.text}
                              </Text>
                            </View>
                          </View>
                        )}
                        <View style={styles.bodyFooter}>
                          <TouchableOpacity
                            onPress={() => bottomDrawerRef.current.open()}
                            style={styles.aiButton}
                          >
                            <Text style={styles.aiButtonText}>
                              {translate('topicScreen.getHelpFromAiButton')}
                            </Text>
                            <MaterialCommunityIcons
                              name="robot-happy-outline"
                              size={30}
                              color={'#A59CFB'}
                              style={{
                                padding: 5
                              }}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.nextButton}
                            onPress={() => {
                              setSelectedItem(index + 2)
                              exerciseRef.scrollToIndex({ animated: true, index: index + 1 })
                              contentRef.scrollToIndex({ animated: true, index: index + 1 })
                            }}
                          >
                            <Text
                              style={styles.aiButtonText}
                              numberOfLines={1} ellipsizeMode="tail"
                            >
                              {translate('topicScreen.nextButton')}
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <BottomDrawer
                          ref={bottomDrawerRef}
                          initialHeight={600}
                          customStyles={{ handleContainer: { backgroundColor: '#271D59', borderRadius: 40 }, container: { backgroundColor: '#271D59' }, handle: { backgroundColor: "#8A80F2" } }}
                        >
                          <KeyboardAwareScrollView>
                            {!keyOpen && (
                              <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center', color: '#fff', letterSpacing: 1, marginTop: 20 }}>
                                {translate('topicScreen.drawerTitle')}
                              </Text>
                            )}
                            <View style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                              <MaterialCommunityIcons
                                name="robot-happy-outline"
                                size={50}
                                color={'#c0baff'}
                                style={{
                                  padding: 5,

                                }}
                              />
                            </View>
                            <Text style={{ fontSize: 24, fontWeight: '500', color: '#fff', letterSpacing: 1, marginTop: 10, paddingHorizontal: 20, lineHeight: 30, textAlign: 'center' }}>
                              {roles.includes("TESTER")
                                ? translate('topicScreen.drawerDescriptionTester')
                                : sentBecomeTesterRequest
                                  ? translate('topicScreen.drawerDescriptionSentRequest')
                                  : translate('topicScreen.drawerDescription')
                              }
                            </Text>
                            <Text
                              style={[
                                { fontSize: 16, fontWeight: '500', color: '#fff', marginTop: 30, padding: 20 },
                                sentBecomeTesterRequest && { opacity: 0, marginTop: 10 }
                              ]}
                            >
                              {translate('topicScreen.drawerTextInputLabel')}
                            </Text>
                            <TextInput
                              style={[
                                styles.textInput,
                                { padding: 20, marginHorizontal: 20, marginTop: -5 },
                                sentBecomeTesterRequest && { borderWidth: 2, borderColor: "#4c3e95", backgroundColor: 'transparent', color: '#b8b8b8' }
                              ]}
                              placeholderTextColor={sentBecomeTesterRequest ? '#4c3e95' : '#8A80F2'}
                              onChangeText={(text) => setBecomeTesterRequest(text)}
                              placeholder={translate('topicScreen.drawerTextInputPlaceholder')}
                              multiline={true}
                              scrollEnabled={true}
                              maxLength={80}
                              value={becomeTesterRequest}
                              editable={!sentBecomeTesterRequest}
                              onFocus={() => setKeyOpen(true)}
                              onBlur={() => setKeyOpen(false)}
                            />
                            {becomeTesterRequestError.length > 0 && (
                              <Text style={{ color: '#FF3232', fontSize: 16, marginHorizontal: 20 }}>
                                {becomeTesterRequestError}
                              </Text>
                            )}
                            {sentBecomeTesterRequest}
                            <TouchableOpacity
                              onPress={() => makeBecomeTesterRequest()}
                              style={[styles.submitAiRequestButton, sentBecomeTesterRequest && { borderColor: "#584ec1" }]}
                              disabled={sentBecomeTesterRequest}
                            >
                              {becomeTesterRequestPending ? (
                                <ActivityIndicator
                                  size={'large'}
                                  color="#A59CFB"
                                />
                              ) : (
                                <Text style={[styles.submitButtonText, sentBecomeTesterRequest && { color: "#8d8d8d" }]}>
                                  {translate('topicScreen.drawerSubmitText')}
                                </Text>
                              )}
                            </TouchableOpacity>
                          </KeyboardAwareScrollView>
                        </BottomDrawer>
                      </View>
                    ) : (
                      <TouchableOpacity
                        onPress={() => {
                          // однако|но|а <- answer
                          const answers = item.answer.split('|'); // Split the string of answers into an array
                          const isAnswerCorrect = answers.includes(item.input);
                          updateExercisePassage(index, isAnswerCorrect)
                        }}
                        disabled={item.input.length === 0}
                        style={[
                          styles.submitButton,
                          (item.input.length === 0) && { borderColor: "#584ec1" },
                        ]}
                      >
                        <Text style={[
                          styles.submitButtonText,
                          (item.input.length === 0) && { color: "#8d8d8d" }
                        ]}>
                          {translate('topicScreen.submit')}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View >
              )}
            />
            // <FlatList
            //   style={styles.bodyWrapper}
            //   data={data}
            //   horizontal={true}
            //   pagingEnabled={true}
            //   showsHorizontalScrollIndicator={false}
            //   ref={(ref) => { contentRef = ref }}
            //   // snapToInterval={Dimensions.get('screen').width}
            //   bounces={false}
            //   renderItem={({ item, index }) => (
            //     <View style={{ width: Dimensions.get('screen').width, padding: 10 }}>
            //       <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>aspdofiasjdpofij</Text>
            //       {/* <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.title}</Text>
            //       <Text style={{ fontSize: 16 }}>{item.description}</Text> */}
            //     </View>
            //   )}
            // />
          )
        )}
        <View style={styles.emptyness} />
      </KeyboardAwareScrollView >
    </View >
  )
}

export default TopicScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'fill',
    position: 'absolute',
    transform: [
      { scaleX: 3.5 },
      { translateX: -100 }
    ]
  },
  scrollView: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },


  titleWrapper: {
    marginTop: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginHorizontal: 20
  },

  flatList: {
    backgroundColor: 'transparent',
    marginTop: 30,
    marginBottom: 30,
    display: 'flex',
    gap: 20
  },
  item: {
    marginRight: 5,
    marginLeft: 5,
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: '#796CFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedItemText: {
    // color: '#02cfc5',
    fontWeight: 'bold',
    fontSize: 20
  },
  itemText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },


  bodyWrapper: {
    height: 'auto',
    width: 'auto',
    backgroundColor: '#271D59',
    padding: 20,
    paddingTop: 30,
    borderRadius: 40,
    marginHorizontal: 10
  },
  exerciseTopic: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#fff',
    marginBottom: 30
  },
  bodyExercise: {

  },
  bodyExerciseText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 22
  },
  textInput: {
    width: 'auto',
    borderRadius: 8,
    backgroundColor: "#3E3C8D",
    color: '#fff',
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    marginTop: 20,
    fontSize: 20
  },
  submitButton: {
    width: 'auto',
    height: 50,
    backgroundColor: '#3a3869',
    color: '#fff',
    borderWidth: 2,
    borderColor: "#A59CFB",
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  submitAiRequestButton: {
    width: 'auto',
    backgroundColor: '#3a3869',
    color: '#fff',
    borderWidth: 2,
    borderColor: "#A59CFB",
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    padding: 15,
    marginHorizontal: 20
  },
  bodyFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10
  },
  aiButton: {
    width: '75%',
    height: 50,
    backgroundColor: '#3a3869',
    color: '#fff',
    borderWidth: 2,
    borderColor: "#A59CFB",
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  aiButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  nextButton: {
    width: '25%',
    height: 50,
    backgroundColor: '#7d71ee',
    color: '#fff',
    borderWidth: 2,
    borderColor: "#A59CFB",
    borderRadius: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    marginTop: 20,
    marginBottom: 20,
  },

  drawerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  drawerContentContainer: {
    flex: 1,
    alignItems: 'center',
  },


  emptyness: {
    height: 160
  }
})