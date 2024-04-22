import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'



// import { Ionicons, MaterialCommunityIcons, AntDesign } from 'react-native-vector-icons';
// import Icon as FontAwesome from 'react-native-vector-icons/dist/FontAwesome'
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/dist/AntDesign';

import LearnScreen from '../home/LearnScreen';
import PractiseScreen from '../home/PractiseScreen';
import AiScreenNavigation from './AiScreenNavigation';
import ProfileScreen from '../home/ProfileScreen';
import useStore from '../libs/statusMachine';

const Tab = createBottomTabNavigator();

// const CustomTabBarButton = ({ children, onPress }) => {
//     return (
//         <TouchableOpacity
//             style={{
//                 top: -30,
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 ...styles.shadow
//             }}
//             onPress={onPress}
//         >
//             <View
//                 style={{
//                     width: 70,
//                     height: 70,
//                     borderRadius: 35,
//                     backgroundColor: "#e32f45"
//                 }}
//             >
//                 {children}
//             </View>
//         </TouchableOpacity>
//     );
// }

const HomeTabs = () => {
    const {keyboardOpen} = useStore()
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Settings') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    }

                    // You can return null here to hide the icon
                    return null;
                },
                tabBarLabel: () => null, // This hides the label
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    right: 20,
                    backgroundColor: 'rgba(33,31,80, 0.95)',
                    borderRadius: 15,
                    height: 90,
                    borderWidth: 3,
                    borderColor: 'rgba(33,31,80, 0.95)',
                    ...styles.shadow,
                    display: keyboardOpen ? 'none' : 'flex'
                }
            })}
        >
            <Tab.Screen
                name="Learn"
                component={LearnScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons
                                    name="list"
                                    size={24}
                                    color={focused ? '#02cfc5' : '#A59CFB'}
                                    style={{
                                        width: 25,
                                        height: 25,
                                    }}
                                />
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: focused ? '#02cfc5' : '#A59CFB'
                                    }}
                                >
                                    HOME
                                </Text>
                            </View>
                        );
                    }
                }}
            />
            <Tab.Screen
                name="Practise"
                component={PractiseScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons
                                    name="book-outline"
                                    size={24}
                                    color={focused ? '#02cfc5' : '#A59CFB'}
                                    style={{
                                        width: 25,
                                        height: 25,
                                    }}
                                />
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: focused ? '#02cfc5' : '#A59CFB'
                                    }}
                                >
                                    PRACTISE
                                </Text>
                            </View>
                        );
                    }
                }}
            />
            {/* <Tab.Screen
                name="Chat"
                component={ChatScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Ionicons
                                name="chatbox-outline"
                                size={24}
                                // color="black"
                                style={{
                                    width: 30,
                                    height: 30,
                                    color: '#fff'
                                }}
                            />
                        )
                    },
                    
                }}
            /> */}
            <Tab.Screen
                name="Ai"
                component={AiScreenNavigation}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <MaterialCommunityIcons
                                    name="robot-happy-outline"
                                    size={24}
                                    color={focused ? '#02cfc5' : '#A59CFB'}
                                    style={{
                                        width: 25,
                                        height: 25,
                                        marginTop: -3,
                                        marginBottom: 3
                                    }}
                                />
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: focused ? '#02cfc5' : '#A59CFB'
                                    }}
                                >
                                    AI
                                </Text>
                            </View>
                        );
                    }
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <AntDesign
                                    name="user"
                                    size={24}
                                    color={focused ? '#02cfc5' : '#A59CFB'}
                                    style={{
                                        width: 25,
                                        height: 25,
                                    }}
                                />
                                <Text
                                    style={{
                                        fontSize: 12,
                                        color: focused ? '#02cfc5' : '#A59CFB'
                                    }}
                                >
                                    PROFILE
                                </Text>
                            </View>
                        );
                    }
                }}
            />
        </Tab.Navigator >
    )
}

export default HomeTabs

const styles = StyleSheet.create({
    shadow: {
        // shadowColor: '#7F5DF0',
        // shadowOffset: {
        //     width: 0,
        //     height: 10,
        // },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.5,
        // elevation: 5
    }
})