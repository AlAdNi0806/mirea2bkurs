/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { AuthProvider, useAuth } from './app/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import Login from './app/screens/Login';
import Home from './app/screens/Home';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { NotifierWrapper } from 'react-native-notifier';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LanguageProvider } from './app/context/LanguageContext';

const themeColor = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000', // matching with theme color
  },
};


const Stack = createNativeStackNavigator()

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <LanguageProvider>
        <AuthProvider>
          <StatusBar translucent backgroundColor='transparent' />
          <NotifierWrapper>
            <Layout>
            </Layout>
          </NotifierWrapper>
        </AuthProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}


export const Layout = () => {
  const { authState, onLogout } = useAuth();

  // NavigationBar.setVisibilityAsync('hidden');


  return (
    <NavigationContainer theme={themeColor}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {authState?.authenticated ? (
          <Stack.Screen name="Home" component={Home}></Stack.Screen>
        ) : (
          <Stack.Screen name="Login" component={Login}></Stack.Screen>
        )}
        {/* <Stack.Screen name="Login" component={Login}></Stack.Screen> */}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
