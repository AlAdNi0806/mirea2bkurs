
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