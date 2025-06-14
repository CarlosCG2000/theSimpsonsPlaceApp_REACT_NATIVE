import { I18n } from 'i18n-js';
import { getLocales } from 'react-native-localize';
import en from './en';
import es from './es';

const locale = getLocales()[0].languageTag; // lenguageCode // Obtenemos el idioma del dispositivo, solo al arrancar la aplicación

const i18n = new I18n(
    {
        en,
        es,
    },
    {
        locale,
        enableFallback: true,
    }
);


function t(key: keyof typeof en, options?: any): string {
    return i18n.t(key, options);
}

export default t;
