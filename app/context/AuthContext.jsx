// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import React, { createContext, useContext, useEffect, useState } from 'react';

// const TOKEN_KEY = 'my-jwt';
// const API_URL = "https://expressserver-kgeo.onrender.com";
// // const API_URL = "http://optimistic-rene-alexos.koyeb.app";
// // const API_URL = process.env.API_URL;

// const AuthContext = createContext({});

// export const useAuth = () => {
//     return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//     const [authState, setAuthState] = useState({
//         token: null,
//         authenticated: false,
//         roles: []
//     });

//     useEffect(() => {
//         const loadToken = async () => {
//             const token = await AsyncStorage.getItem(TOKEN_KEY);
//             console.log("🚀 ~ loadToken ~ token:", token);

//             if (token) {
//                 axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//                 setAuthState({
//                     token: token,
//                     authenticated: true,
//                 });
//             }
//         };
//         loadToken();
//     }, []);

//     const getMyInfo = async() => {
//         const loadToken = async () => {
//             const token = await AsyncStorage.getItem(TOKEN_KEY);
//             console.log("🚀 ~ loadToken ~ token:", token);

//             if (token) {
//                 axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//                 setAuthState({
//                     token: token,
//                     authenticated: true,
//                 });
//             }
//         };
//         loadToken();
//     }

//     const register = async (fullName, username, password) => {
//         try {
//             console.log("registering")
//             const result = await axios.post(`${API_URL}/auth/register`, { fullName, username, password });
//             return {success: true};
//         } catch (error) {
//             if (error.response) {
//                 console.log(error.response.data);
//                 return { success: false, message: error.response.data };
//             } else if (error.request) {
//                 console.log(error.request);
//                 return { success: false, message: 'No response received from the server.' };
//             } else {
//                 console.log('Error', error.message);
//                 return { success: false, message: error.message };
//             }
//         }
//     };

//     const login = async (username, password) => {
//         try {
//             const result = await axios.post(`${API_URL}/auth/login`, { username, password });
//             console.log("🚀 ~ login ~ result:", result);

//             setAuthState({
//                 token: result.data.token,
//                 authenticated: true,
//             });

//             axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;
//             await AsyncStorage.setItem(TOKEN_KEY, result.data.token);

//             return {success: true};

//         } catch (error) {
//             if (error.response) {
//                 console.log(error.response.data);
//                 return { success: false, message: error.response.data };
//             } else if (error.request) {
//                 console.log(error.request);
//                 return { success: false, message: 'No response received from the server.' };
//             } else {
//                 console.log('Error', error.message);
//                 return { success: false, message: error.message };
//             }
//         }
//     };

//     const logout = async () => {
//         await AsyncStorage.removeItem(TOKEN_KEY);
//         axios.defaults.headers.common['Authorization'] = '';
//         setAuthState({
//             token: null,
//             authenticated: false,
//         });
//     };

//     const value = {
//         onRegister: register,
//         onLogin: login,
//         onLogout: logout,
//         authState,
//     };

//     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };










import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import EncryptedStorage from 'react-native-encrypted-storage';
import { GetUserDetails } from '../libs/queries';
import useStore from '../libs/statusMachine';
import { useLanguage } from './LanguageContext';

const TOKEN_KEY = 'my-jwt';

// const API_URL = "https://expressserver-kgeo.onrender.com";


// const API_URL = 'https://expressserver-1.onrender.com';

// const API_URL = 'http://10.192.215.208:3000';


// const API_URL = 'http://10.192.215.208:3000';
// const API_URL = "http://192.168.0.176:3000";

// const EXERCISE_URL = "https://sdamgiaserver.onrender.com";
// const API_URL = "https://expressserver-pq6l.onrender.com";
const API_URL = process.env.API_URL;

const AuthContext = createContext({});

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        token: null,
        authenticated: false,
        roles: []
    });

    const {setRoles, setAiEssayCheckUsages} = useStore()

    const [translate, setLang, lang] = useLanguage();

    useEffect(() => {
        const loadToken = async () => {
            const token = await EncryptedStorage.getItem(TOKEN_KEY);
            console.log("🚀 ~ loadToken ~ token:", token);

            if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                setAuthState({
                    token: token,
                    authenticated: true,
                });
                const details = await GetUserDetails(token);
                console.log(details.user)
                setRoles(details.user.roles);
                setAiEssayCheckUsages(details.user.aiEssayCheckUsages)
                setLang(details.user.language)
            }
        };
        loadToken();
    }, []);

    const register = async (fullName, username, password) => {
        try {
            console.log("registering")
            console.log("lang", lang)
            const result = await axios.post(`${API_URL}/auth/register`, { fullName, username, password, language: lang });
            return { success: true };
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
                return { success: false, message: error.response.data };
            } else if (error.request) {
                console.log(error.request);
                return { success: false, message: 'No response received from the server.' };
            } else {
                console.log('Error', error.message);
                return { success: false, message: error.message };
            }
        }
    };

    const login = async (username, password) => {
        try {
            console.log("calledApi")
            const result = await axios.post(`${API_URL}/auth/login`, { username, password });
            console.log("🚀 ~ login ~ result:", result);

            setAuthState({
                token: result.data.token,
                authenticated: true,
            });
            
            // console.log(result.data)
            setRoles(result.data.roles);
            setAiEssayCheckUsages(result.data.aiEssayCheckUsages)
            setLang(result.data.language)

            axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.token}`;
            await EncryptedStorage.setItem(TOKEN_KEY, result.data.token);

            return { success: true };

        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
                return { success: false, message: error.response.data };
            } else if (error.request) {
                console.log(error.request);
                return { success: false, message: 'No response received from the server.' };
            } else {
                console.log('Error', error.message);
                return { success: false, message: error.message };
            }
        }
    };

    const logout = async () => {
        await EncryptedStorage.removeItem(TOKEN_KEY);
        axios.defaults.headers.common['Authorization'] = '';
        setAuthState({
            token: null,
            authenticated: false,
        });
    };

    const value = {
        onRegister: register,
        onLogin: login,
        onLogout: logout,
        authState,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
