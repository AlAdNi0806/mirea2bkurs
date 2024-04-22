import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'



import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { confirmedSubjects } from '../constants/subjects';
import useStore from '../libs/statusMachine';
import { useLanguage } from '../context/LanguageContext';



const { width } = Dimensions.get('window');

const AiScreen = () => {
  const navigation = useNavigation();
  const { setCurrentShortenedSubject, setCurrentSubject, setCurrentSubjectExercises } = useStore()

  const subjects = confirmedSubjects();

  const [translate] = useLanguage();

  return (
    <View style={styles.container}>

      <Image style={styles.image} source={require('../assets/main/city.png')} />

      <View style={styles.mainInformation}>
        <View style={styles.mainInformationContainer}>
          <Text style={styles.mainInformationContainerTitle}>
            {translate('aiScreen.mainInformationTitle')}
          </Text>
          <Text style={styles.mainInformationContainerHeader}>
            {translate('aiScreen.mainInformationDescription')}
          </Text>
        </View>
      </View>


      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.itemWrapper}>
          {subjects.map((subject, index) => (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => {
                setCurrentShortenedSubject(subject.shortened)
                setCurrentSubject(subject.subject)
                setCurrentSubjectExercises(subject.exercises)
                navigation.navigate(subject.scanning ? 'Essay' : 'CustomizeExersise', {
                  subject: subject
                })
              }}
              disabled={subject.comingSoon}
            >
              <Ionicons name={subject.icon} size={60} color="#02cfc5" />
              {subject.comingSoon ? (
                <Text style={{ color: '#fff', marginTop: 'auto', textAlign: 'center', fontSize: 16 }}>
                  {translate('aiScreen.subjectComingSoon')}
                </Text>
              ) : (
                <View>
                  <Text style={styles.itemText}>
                    {subject.title}
                  </Text>
                  {subject.description &&
                    (<Text style={{ textAlign: 'center', color: '#fff', fontWeight: '700' }}>
                      {subject.description}
                    </Text>
                    )
                  }
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView >

    </View >
  )
}

export default AiScreen

//                 <TouchableOpacity
//                   style={styles.cardArrow}
//                   onPress={() => navigation.navigate('Topics', {
//                     subject: subject
//                   })}
//                 >


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
    fontSize: 16
  },

  itemWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // Adjusts spacing between items
    padding: 20,
  },
  item: {
    width: width / 2 - 40, // Adjusts the width of each item to fit two in a row, considering padding
    height: width / 2 - 40, // Maintains the square shape
    marginBottom: 40, // Adds space between rows
    borderWidth: 2,
    borderColor: '#796CFF', // Example border color
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    elevation: 100
  },
  itemText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '500',
    marginTop: 'auto'
  }
})