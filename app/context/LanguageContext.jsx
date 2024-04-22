import React from 'react';
import { NativeModules, I18nManager, Platform } from 'react-native';
import en from '../assets/lang/en.json';
import ru from '../assets/lang/ru.json';

const LanguageContext = React.createContext(null);

export  function LanguageProvider({ initialState = 'en', children }) {

    const deviceLanguage = NativeModules.I18nManager.localeIdentifier;
    const languageCode = deviceLanguage.split('_')[0];

    // console.log("languageCode")
    // console.log("languageCode")
    // console.log(languageCode)

    if (languageCode === "en") {
        initialState = "en"
    } else if (languageCode === "ru") {
        initialState = "ru"
    }

    const [lang, setLang] = React.useState(initialState);
    const languages = { en, ru };

    return (
        <LanguageContext.Provider value={[languages[lang], setLang, lang]}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = React.useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    const [translations, setLang, lang] = context;

    const translate = (key) => {
        const keys = key.split('.');
        let value = translations;
        keys.forEach(k => {
            value = value[k];
        });
        return value;
    };

    return [translate, setLang, lang];
}