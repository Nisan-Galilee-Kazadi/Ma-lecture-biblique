/**
 * Utilitaires pour l'encodage/décodage Base64
 * Utilisé pour chiffrer les sauvegardes de données
 */

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

/**
 * Polyfill pour btoa (conversion en Base64)
 */
const btoa_poly = (input = '') => {
    let str = input;
    let output = '';
    for (let block = 0, charCode, i = 0, map = chars;
        str.charAt(i | 0) || (map = '=', i % 1);
        output += map.charAt(63 & block >> 8 - i % 1 * 8)) {
        charCode = str.charCodeAt(i += 3 / 4);
        if (charCode > 0xFF) throw new Error("'btoa' failed");
        block = block << 8 | charCode;
    }
    return output;
};

/**
 * Polyfill pour atob (décodage Base64)
 */
const atob_poly = (input = '') => {
    let str = input.replace(/[=]+$/, '');
    let output = '';
    for (let bc = 0, bs = 0, buffer, i = 0;
        buffer = str.charAt(i++);
        ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
            bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
        buffer = chars.indexOf(buffer);
    }
    return output;
};

/**
 * Encode une chaîne en Base64
 * @param {string} str - Chaîne à encoder
 * @returns {string} Chaîne encodée en Base64
 */
export const base64Encode = (str) => {
    return btoa_poly(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
            String.fromCharCode('0x' + p1)
        )
    );
};

/**
 * Décode une chaîne Base64
 * @param {string} str - Chaîne Base64 à décoder
 * @returns {string} Chaîne décodée
 */
export const base64Decode = (str) => {
    return decodeURIComponent(
        atob_poly(str).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join('')
    );
};
