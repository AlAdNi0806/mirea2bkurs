import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import EssayScreen from '../home/aiScreen/EssayScreen';
import AiScreen from '../home/AiScreen';
import TopicScreen from '../home/aiScreen/TopicScreen';
import CustomizeExerciseScreen from '../home/aiScreen/CustomizeExerciseScreen';


const Stack = createStackNavigator();

export default function AiScreenNavigation() {
  return (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name='Subjects' component={AiScreen}/>
        <Stack.Screen name='CustomizeExersise' component={CustomizeExerciseScreen}/>
        <Stack.Screen name='Essay' component={EssayScreen}/>
        <Stack.Screen name='Topic' component={TopicScreen}/>
    </Stack.Navigator>
  )
}