import { Linking } from 'react-native';
import { BIBLE_BOOKS_MAP } from '../constants/bibleData';

/**
 * Ouvre un lien vers JW.ORG pour un livre et une section donnés
 * @param {string} bookName - Nom du livre biblique (ex: "GENÈSE")
 * @param {string} section - Section à ouvrir (ex: "1-3" ou "5")
 */
export const openJWLink = (bookName, section) => {
    const bookNum = BIBLE_BOOKS_MAP[bookName.toUpperCase()] || 1;
    let chStart = 1, chEnd = 1;

    if (section && section.includes('-')) {
        const parts = section.split('-');
        chStart = parseInt(parts[0]);
        chEnd = parseInt(parts[1]);
    } else if (section) {
        chStart = chEnd = parseInt(section);
    }

    const bStr = bookNum.toString().padStart(2, '0');
    const sStr = chStart.toString().padStart(3, '0');
    const eStr = chEnd.toString().padStart(3, '0');

    // Format finder NWT: bible=BOOKCHAPTER001-BOOKCHAPTER999
    const url = `https://www.jw.org/finder?wtlocale=F&pub=nwt&bible=${bStr}${sStr}001-${bStr}${eStr}999&prefer=lang`;
    Linking.openURL(url);
};
