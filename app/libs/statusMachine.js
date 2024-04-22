import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple XOR encryption/decryption for demonstration purposes
const secretKey = 'your-secret-key';
const encrypt = (data) => {
    let result = '';
    for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(data.charCodeAt(i) ^ secretKey.charCodeAt(i % secretKey.length));
    }
    return result;
};
const decrypt = (data) => {
    return encrypt(data); // XOR is its own inverse
};

// Custom storage with encryption/decryption
const customStorage = createJSONStorage(() => ({
    getItem: async (name) => {
        const encryptedData = await AsyncStorage.getItem(name);
        return encryptedData ? decrypt(encryptedData) : null;
    },
    setItem: async (name, value) => {
        const encryptedData = encrypt(value);
        await AsyncStorage.setItem(name, encryptedData);
    },
    removeItem: async (name) => {
        await AsyncStorage.removeItem(name);
    },
}));

const useStore = create(
    persist(
        (set) => ({
            keyboardOpen: false,
            roles: [],


            currentSubject: '',
            currentShortenedSubject: '',
            currentSubjectExercises: [],
            currentSubjectSelectedExercises: [],

            aiEssayCheckUsages: 0,

            sentBecomeTesterRequest: false,

            language : '',


            setCurrentSubject: (value) => set({ currentSubject: value }),
            setCurrentShortenedSubject: (value) => set({ currentShortenedSubject: value }),
            setCurrentSubjectExercises: (value) => set({ currentSubjectExercises: value }),
            setCurrentSubjectSelectedExercises: (value) => set({ currentSubjectSelectedExercises: value }),

            setKeyboardOpen: (value) => set({ keyboardOpen: value }),
            setRoles: (value) => set({ roles: value }),

            setAiEssayCheckUsages: (value) => set({ aiEssayCheckUsages: value }),

            setSentBecomeTesterRequest: (value) => set({ sentBecomeTesterRequest: value }),

            setLanguage: (value) => set({ language: value }),
        }),
        {
            name: "myStore", // Unique name for your store
            storage: customStorage, // Use custom storage with encryption/decryption
        }
    )
);

export default useStore;
