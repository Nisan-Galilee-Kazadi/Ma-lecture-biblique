import React, { useState, useEffect, createContext, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  SafeAreaView,
  Dimensions,
  Image,
  Switch,
  Platform,
  FlatList,
  Linking,
  BackHandler,
  Animated,
  SectionList,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Home,
  BookOpen,
  Settings as SettingsIcon,
  CheckSquare,
  Square,
  User,
  FileText,
  X,
  Save,
  RotateCcw,
  Bell,
  Moon,
  Sun,
  Camera,
  Flame,
  Star,
  Calendar,
  ExternalLink,
  History as HistoryIcon,
  Tag as TagIcon,
  Plus,
  Trash2,
  Search,
  Info
} from 'lucide-react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// --- Configuration des Couleurs JW Style ---
const COLORS = {
  jwBlue: '#4a6da7',
  jwBlueDark: '#3b5998',
  primary: '#4a6da7', // Retour au bleu
  israelite: '#ef4444',
  christian: '#3b82f6',
  prophetic: '#f97316',
  bgLight: '#f4f4f4',
  bgPure: '#ffffff',
  bgDark: '#121212',
  cardDark: '#1e1e1e',
  textLight: '#333333',
  textDark: '#e0e0e0',
  border: '#dddddd',
  accent: '#f2f2f2'
};

const BIBLE_QUOTES = [
  { text: "Ta parole est une lampe pour mon pied, et une lumière pour mon sentier.", ref: "Psaume 119:105" },
  { text: "L’herbe se dessèche, la fleur se fane, mais la parole de notre Dieu demeure pour toujours.", ref: "Isaïe 40:8" },
  { text: "Heureux l’homme qui... prend plaisir dans la loi de Jéhovah, et sa loi, il la lit à voix basse jour et nuit.", ref: "Psaume 1:1,2" },
  { text: "Car la parole de Dieu est vivante et puissante.", ref: "Hébreux 4:12" }
];

const BIBLE_BOOKS_MAP = {
  'GENÈSE': 1, 'EXODE': 2, 'LÉVITIQUE': 3, 'NOMBRES': 4, 'DEUTÉRONOME': 5,
  'JOSUÉ': 6, 'JUGES': 7, 'RUTH': 8, '1 SAMUEL': 9, '2 SAMUEL': 10,
  '1 ROIS': 11, '2 ROIS': 12, '1 CHRONIQUES': 13, '2 CHRONIQUES': 14,
  'ESDRAS': 15, 'NÉHÉMIE': 16, 'ESTHER': 17, 'JOB': 18, 'PSAUMES': 19,
  'PROVERBES': 20, 'ECCLÉSIASTE': 21, 'CHANT DE SALOMON': 22, 'ISAÏE': 23,
  'JÉRÉMIE': 24, 'LAMENTATIONS': 25, 'ÉZÉCHIEL': 26, 'DANIEL': 27, 'OSÉE': 28,
  'JOËL': 29, 'AMOS': 30, 'ABDIAS': 31, 'JONAS': 32, 'MICHÉE': 33,
  'NAHUM': 34, 'HABACUC': 35, 'SOPHONIE': 36, 'AGGÉE': 37, 'ZACHARIE': 38,
  'MALACHIE': 39, 'MATTHIEU': 40, 'MARC': 41, 'LUC': 42, 'JEAN': 43,
  'ACTES': 44, 'ROMAINS': 45, '1 CORINTHIENS': 46, '2 CORINTHIENS': 47, 'GALATES': 48,
  'ÉPHÉSIENS': 49, 'PHILIPPIENS': 50, 'COLOSSIENS': 51, '1 THESSALONICIENS': 52, '2 THESSALONICIENS': 53,
  '1 TIMOTHÉE': 54, '2 TIMOTHÉE': 55, 'TITE': 56, 'PHILÉMON': 57, 'HÉBREUX': 58,
  'JACQUES': 59, '1 PIERRE': 60, '2 PIERRE': 61, '1 JEAN': 62, '2 JEAN': 63,
  '3 JEAN': 64, 'JUDE': 65, 'RÉVÉLATION': 66
};

// --- Données du Plan de Lecture (Plan Officiel JW.ORG - 368 sections) ---
const readingPlan = {
  'ÉCRITS DE MOÏSE': [
    { book: 'GENÈSE', sections: [{ ch: '1-3' }, { ch: '4-7' }, { ch: '8-11' }, { ch: '12-15', m: 'o' }, { ch: '16-18', m: 'o' }, { ch: '19-22', m: 'o' }, { ch: '23-24', m: 'o' }, { ch: '25-27', m: 'o' }, { ch: '28-30', m: 'o' }, { ch: '31-32', m: 'o' }, { ch: '33-34', m: 'o' }, { ch: '35-37', m: 'o' }, { ch: '38-40', m: 'o' }, { ch: '41-42', m: 'o' }, { ch: '43-45', m: 'o' }, { ch: '46-48', m: 'o' }, { ch: '49-50', m: 'o' }] },
    { book: 'EXODE', sections: [{ ch: '1-4', m: 'o' }, { ch: '5-7', m: 'o' }, { ch: '8-10', m: 'o' }, { ch: '11-13', m: 'o' }, { ch: '14-15', m: 'o' }, { ch: '16-18', m: 'o' }, { ch: '19-21', m: 'o' }, { ch: '22-25' }, { ch: '26-28' }, { ch: '29-30' }, { ch: '31-33', m: 'o' }, { ch: '34-35', m: 'o' }, { ch: '36-38' }, { ch: '39-40' }] },
    { book: 'LÉVITIQUE', sections: [{ ch: '1-4' }, { ch: '5-7' }, { ch: '8-10' }, { ch: '11-13' }, { ch: '14-15' }, { ch: '16-18' }, { ch: '19-21' }, { ch: '22-23' }, { ch: '24-25' }, { ch: '26-27' }] },
    { book: 'NOMBRES', sections: [{ ch: '1-3' }, { ch: '4-6' }, { ch: '7-9' }, { ch: '10-12', m: 'o' }, { ch: '13-15', m: 'o' }, { ch: '16-18', m: 'o' }, { ch: '19-21', m: 'o' }, { ch: '22-24', m: 'o' }, { ch: '25-27', m: 'o' }, { ch: '28-30' }, { ch: '31-32', m: 'o' }, { ch: '33-36', m: 'o' }] },
    { book: 'DEUTÉRONOME', sections: [{ ch: '1-2' }, { ch: '3-4', m: 'o' }, { ch: '5-7' }, { ch: '8-10' }, { ch: '11-13' }, { ch: '14-16' }, { ch: '17-19', m: 'o' }, { ch: '20-22' }, { ch: '23-26' }, { ch: '27-28' }, { ch: '29-31', m: 'o' }, { ch: '32', m: 'o' }, { ch: '33-34', m: 'o' }] }
  ],
  "ENTRÉE D'ISRAËL EN TERRE PROMISE": [
    { book: 'JOSUÉ', sections: [{ ch: '1-4', m: 'o' }, { ch: '5-7', m: 'o' }, { ch: '8-9', m: 'o' }, { ch: '10-12', m: 'o' }, { ch: '13-15', m: 'o' }, { ch: '16-18', m: 'o' }, { ch: '19-21', m: 'o' }, { ch: '22-24', m: 'o' }] },
    { book: 'JUGES', sections: [{ ch: '1-2', m: 'o' }, { ch: '3-5', m: 'o' }, { ch: '6-7', m: 'o' }, { ch: '8-9', m: 'o' }, { ch: '10-11', m: 'o' }, { ch: '12-13', m: 'o' }, { ch: '14-16', m: 'o' }, { ch: '17-19', m: 'o' }, { ch: '20-21', m: 'o' }] },
    { book: 'RUTH', sections: [{ ch: '1-4', m: 'o' }] }
  ],
  "PÉRIODE DES ROIS D'ISRAËL": [
    { book: '1 SAMUEL', sections: [{ ch: '1-2', m: 'o' }, { ch: '3-6', m: 'o' }, { ch: '7-9', m: 'o' }, { ch: '10-12', m: 'o' }, { ch: '13-14', m: 'o' }, { ch: '15-16', m: 'o' }, { ch: '17-18', m: 'o' }, { ch: '19-21', m: 'o' }, { ch: '22-24', m: 'o' }, { ch: '25-27', m: 'o' }, { ch: '28-31', m: 'o' }] },
    { book: '2 SAMUEL', sections: [{ ch: '1-2', m: 'o' }, { ch: '3-5', m: 'o' }, { ch: '6-8', m: 'o' }, { ch: '9-12', m: 'o' }, { ch: '13-14', m: 'o' }, { ch: '15-16', m: 'o' }, { ch: '17-18', m: 'o' }, { ch: '19-20', m: 'o' }, { ch: '21-22', m: 'o' }, { ch: '23-24', m: 'o' }] },
    { book: '1 ROIS', sections: [{ ch: '1-2', m: 'o' }, { ch: '3-5', m: 'o' }, { ch: '6-7', m: 'o' }, { ch: '8', m: 'o' }, { ch: '9-10', m: 'o' }, { ch: '11-12', m: 'o' }, { ch: '13-14', m: 'o' }, { ch: '15-17', m: 'o' }, { ch: '18-19', m: 'o' }, { ch: '20-21', m: 'o' }, { ch: '22', m: 'o' }] },
    { book: '2 ROIS', sections: [{ ch: '1-3', m: 'o' }, { ch: '4-5', m: 'o' }, { ch: '6-8', m: 'o' }, { ch: '9-10', m: 'o' }, { ch: '11-13', m: 'o' }, { ch: '14-15', m: 'o' }, { ch: '16-17', m: 'o' }, { ch: '18-19', m: 'o' }, { ch: '20-22', m: 'o' }, { ch: '23-25', m: 'o' }] },
    { book: '1 CHRONIQUES', sections: [{ ch: '1-2' }, { ch: '3-5' }, { ch: '6-7' }, { ch: '8-10' }, { ch: '11-12' }, { ch: '13-15' }, { ch: '16-17' }, { ch: '18-20' }, { ch: '21-23' }, { ch: '24-26' }, { ch: '27-29' }] },
    { book: '2 CHRONIQUES', sections: [{ ch: '1-3' }, { ch: '4-6' }, { ch: '7-9' }, { ch: '10-14' }, { ch: '15-18' }, { ch: '19-22' }, { ch: '23-25' }, { ch: '26-28' }, { ch: '29-30' }, { ch: '31-33' }, { ch: '34-36' }] }
  ],
  "RETOUR D'EXIL DES JUIFS": [
    { book: 'ESDRAS', sections: [{ ch: '1-3', m: 'o' }, { ch: '4-7', m: 'o' }, { ch: '8-10', m: 'o' }] },
    { book: 'NÉHÉMIE', sections: [{ ch: '1-3', m: 'o' }, { ch: '4-6', m: 'o' }, { ch: '7-8', m: 'o' }, { ch: '9-10', m: 'o' }, { ch: '11-13', m: 'o' }] },
    { book: 'ESTHER', sections: [{ ch: '1-4', m: 'o' }, { ch: '5-10', m: 'o' }] }
  ],
  "CHANTS ET PAROLES DE SAGESSE": [
    { book: 'JOB', sections: [{ ch: '1-5' }, { ch: '6-9' }, { ch: '10-14' }, { ch: '15-18' }, { ch: '19-20' }, { ch: '21-24' }, { ch: '25-29' }, { ch: '30-31' }, { ch: '32-34' }, { ch: '35-38' }, { ch: '39-42' }] },
    { book: 'PSAUMES', sections: [{ ch: '1-8' }, { ch: '9-16' }, { ch: '17-19' }, { ch: '20-25' }, { ch: '26-31' }, { ch: '32-35' }, { ch: '36-38' }, { ch: '39-42' }, { ch: '43-47' }, { ch: '48-52' }, { ch: '53-58' }, { ch: '59-64' }, { ch: '65-68' }, { ch: '69-72' }, { ch: '73-77' }, { ch: '78-79' }, { ch: '80-86' }, { ch: '87-90' }, { ch: '91-96' }, { ch: '97-103' }, { ch: '104-105' }, { ch: '106-108' }, { ch: '109-115' }, { ch: '116-119:63' }, { ch: '119:64-176' }, { ch: '120-129' }, { ch: '130-138' }, { ch: '139-144' }, { ch: '145-150' }] },
    { book: 'PROVERBES', sections: [{ ch: '1-4' }, { ch: '5-8' }, { ch: '9-12' }, { ch: '13-16' }, { ch: '17-19' }, { ch: '20-22' }, { ch: '23-27' }, { ch: '28-31' }] },
    { book: 'ECCLÉSIASTE', sections: [{ ch: '1-4' }, { ch: '5-8' }, { ch: '9-12' }] },
    { book: 'CHANT DE SALOMON', sections: [{ ch: '1-8' }] }
  ],
  'PROPHÈTES': [
    { book: 'ISAÏE', sections: [{ ch: '1-4' }, { ch: '5-7' }, { ch: '8-10' }, { ch: '11-14' }, { ch: '15-19' }, { ch: '20-24' }, { ch: '25-28' }, { ch: '29-31' }, { ch: '32-35' }, { ch: '36-37' }, { ch: '38-40' }, { ch: '41-43' }, { ch: '44-47' }, { ch: '48-50' }, { ch: '51-55' }, { ch: '56-58' }, { ch: '59-62' }, { ch: '63-66' }] },
    { book: 'JÉRÉMIE', sections: [{ ch: '1-3' }, { ch: '4-5' }, { ch: '6-7' }, { ch: '8-10' }, { ch: '11-13' }, { ch: '14-16' }, { ch: '17-20' }, { ch: '21-23' }, { ch: '24-26' }, { ch: '27-29' }, { ch: '30-31' }, { ch: '32-33' }, { ch: '34-36' }, { ch: '37-39' }, { ch: '40-42' }, { ch: '43-44' }, { ch: '45-48' }, { ch: '49-50' }, { ch: '51-52' }] },
    { book: 'LAMENTATIONS', sections: [{ ch: '1-2' }, { ch: '3-5' }] },
    { book: 'ÉZÉCHIEL', sections: [{ ch: '1-3' }, { ch: '4-6' }, { ch: '7-9' }, { ch: '10-12' }, { ch: '13-15' }, { ch: '16' }, { ch: '17-18' }, { ch: '19-21' }, { ch: '22-23' }, { ch: '24-26' }, { ch: '27-28' }, { ch: '29-31' }, { ch: '32-33' }, { ch: '34-36' }, { ch: '37-38' }, { ch: '39-40' }, { ch: '41-43' }, { ch: '44-45' }, { ch: '46-48' }] },
    { book: 'DANIEL', sections: [{ ch: '1-2' }, { ch: '3-4' }, { ch: '5-7' }, { ch: '8-10' }, { ch: '11-12' }] },
    { book: 'OSÉE', sections: [{ ch: '1-7' }, { ch: '8-14' }] },
    { book: 'JOËL', sections: [{ ch: '1-3' }] },
    { book: 'AMOS', sections: [{ ch: '1-5' }, { ch: '6-9' }] },
    { book: 'ABDIAS/JONAS', sections: [{ ch: '1' }] },
    { book: 'MICHÉE', sections: [{ ch: '1-7' }] },
    { book: 'NAHUM/HABACUC', sections: [{ ch: '1-3' }] },
    { book: 'SOPHONIE/AGGÉE', sections: [{ ch: '1-3' }] },
    { book: 'ZACHARIE', sections: [{ ch: '1-7' }, { ch: '8-11' }, { ch: '12-14' }] },
    { book: 'MALACHIE', sections: [{ ch: '1-4' }] }
  ],
  'VIE ET MINISTÈRE DE JÉSUS': [
    { book: 'MATTHIEU', sections: [{ ch: '1-4' }, { ch: '5-7' }, { ch: '8-10' }, { ch: '11-13' }, { ch: '14-17' }, { ch: '18-20' }, { ch: '21-23' }, { ch: '24-25' }, { ch: '26' }, { ch: '27-28' }] },
    { book: 'MARC', sections: [{ ch: '1-3', m: 'b' }, { ch: '4-5', m: 'b' }, { ch: '6-8', m: 'b' }, { ch: '9-10', m: 'b' }, { ch: '11-13', m: 'b' }, { ch: '14-16', m: 'b' }] },
    { book: 'LUC', sections: [{ ch: '1-2' }, { ch: '3-5' }, { ch: '6-7' }, { ch: '8-9' }, { ch: '10-11' }, { ch: '12-13' }, { ch: '14-17' }, { ch: '18-19' }, { ch: '20-22' }, { ch: '23-24' }] },
    { book: 'JEAN', sections: [{ ch: '1-3' }, { ch: '4-5' }, { ch: '6-7' }, { ch: '8-9' }, { ch: '10-12' }, { ch: '13-15' }, { ch: '16-18' }, { ch: '19-21' }] }
  ],
  "DÉVELOPPEMENT DE L'ASSEMBLÉE CHRÉTIENNE": [
    { book: 'ACTES', sections: [{ ch: '1-3', m: 'b' }, { ch: '4-6', m: 'b' }, { ch: '7-8', m: 'b' }, { ch: '9-11', m: 'b' }, { ch: '12-14', m: 'b' }, { ch: '15-16', m: 'b' }, { ch: '17-19', m: 'b' }, { ch: '20-21', m: 'b' }, { ch: '22-23', m: 'b' }, { ch: '24-26', m: 'b' }, { ch: '27-28', m: 'b' }] }
  ],
  "LETTRES DE PAUL": [
    { book: 'ROMAINS', sections: [{ ch: '1-3' }, { ch: '4-7' }, { ch: '8-11' }, { ch: '12-16' }] },
    { book: '1 CORINTHIENS', sections: [{ ch: '1-6' }, { ch: '7-10' }, { ch: '11-14' }, { ch: '15-16' }] },
    { book: '2 CORINTHIENS', sections: [{ ch: '1-6' }, { ch: '7-10' }, { ch: '11-13' }] },
    { book: 'GALATES', sections: [{ ch: '1-6' }] },
    { book: 'ÉPHÉSIENS', sections: [{ ch: '1-6' }] },
    { book: 'PHILIPPIENS', sections: [{ ch: '1-4' }] },
    { book: 'COLOSSIENS', sections: [{ ch: '1-4' }] },
    { book: '1 THESSALONICIENS', sections: [{ ch: '1-5' }] },
    { book: '2 THESSALONICIENS', sections: [{ ch: '1-3' }] },
    { book: '1 TIMOTHÉE', sections: [{ ch: '1-6' }] },
    { book: '2 TIMOTHÉE', sections: [{ ch: '1-4' }] },
    { book: 'TITE/PHILÉMON', sections: [{ ch: '1-3' }] }
  ],
  "ÉCRITS DES AUTRES APÔTRES ET DISCIPLES": [
    { book: 'HÉBREUX', sections: [{ ch: '1-6' }, { ch: '7-10' }, { ch: '11-13' }] },
    { book: 'JACQUES', sections: [{ ch: '1-5' }] },
    { book: '1 PIERRE', sections: [{ ch: '1-5' }] },
    { book: '2 PIERRE', sections: [{ ch: '1-3' }] },
    { book: '1 JEAN', sections: [{ ch: '1-5' }] },
    { book: '2 JEAN/3 JEAN/JUDE', sections: [{ ch: '1' }] },
    { book: 'RÉVÉLATION', sections: [{ ch: '1-4' }, { ch: '5-9' }, { ch: '10-14' }, { ch: '15-18' }, { ch: '19-22' }] }
  ]
};

const totalSections = 368;

// --- Nouvel Écran de Chargement ---
function LoadingScreen() {
  const [progress] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(progress, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#f4f4f4', justifyContent: 'center', alignItems: 'center' }}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
        <Image source={require('./assets/icon.png')} style={{ width: 120, height: 120, borderRadius: 30 }} />
        <Text style={{ marginTop: 20, fontSize: 22, color: COLORS.jwBlue, fontWeight: 'bold', letterSpacing: 1 }}>
          Ma Lecture de la Bible
        </Text>
      </Animated.View>
      <View style={{ width: '70%', height: 6, backgroundColor: '#ddd', borderRadius: 3, marginTop: 40, overflow: 'hidden' }}>
        <Animated.View style={{ height: '100%', backgroundColor: COLORS.jwBlue, width }} />
      </View>
      <Text style={{ marginTop: 15, fontSize: 12, color: '#999' }}>Initialisation de votre plan...</Text>
    </View>
  );
}



// --- Helper pour les liens JW.ORG ---
const openJWLink = (bookName, section) => {
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

// --- Utils: Base64 pour "chiffrement" des sauvegardes ---
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
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
const base64Encode = (str) => btoa_poly(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
const base64Decode = (str) => decodeURIComponent(atob_poly(str).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));

// --- Context ---
const AppContext = createContext();

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPhoto, setUserPhoto] = useState(null);
  const [progress, setProgress] = useState({});
  const [history, setHistory] = useState([]);
  const [notes, setNotes] = useState([]); // Array of objects {id, book, section, text, tags, date}
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [noteEditorVisible, setNoteEditorVisible] = useState(false);
  const [reminderConfig, setReminderConfig] = useState({});
  const [activeNote, setActiveNote] = useState({ id: '', text: '', tags: [] });
  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    loadAppState();
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('daily-reading', {
        name: 'Rappels de lecture',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: COLORS.jwBlue,
      });
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (showSettings) { setShowSettings(false); return true; }
      if (showHistory) { setShowHistory(false); return true; }
      if (noteEditorVisible) { setNoteEditorVisible(false); return true; }
      return false;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [showSettings, showHistory, noteEditorVisible]);

  const loadAppState = async () => {
    try {
      const results = await AsyncStorage.multiGet([
        'userName', 'userPhoto', 'bibleProgress', 'bibleHistory', 'bibleNotes', 'isDarkMode', 'reminderConfig'
      ]);
      const data = Object.fromEntries(results);

      if (data.userName) {
        setUserName(data.userName);
        setIsFirstLaunch(false);
      }
      if (data.userPhoto) setUserPhoto(data.userPhoto);
      if (data.bibleProgress) setProgress(JSON.parse(data.bibleProgress));
      if (data.bibleHistory) setHistory(JSON.parse(data.bibleHistory));
      if (data.bibleNotes) setNotes(JSON.parse(data.bibleNotes));
      if (data.isDarkMode !== null) setIsDarkMode(JSON.parse(data.isDarkMode));
      if (data.reminderConfig) setReminderConfig(JSON.parse(data.reminderConfig));

      // Petit délai pour l'animation
      setTimeout(() => setIsAppLoading(false), 2000);
    } catch (e) {
      console.error(e);
      setIsAppLoading(false);
    }
  };


  const themeColors = isDarkMode ? {
    bg: COLORS.bgDark,
    header: '#333',
    card: COLORS.cardDark,
    text: COLORS.textDark,
    border: '#333'
  } : {
    bg: COLORS.bgLight,
    header: COLORS.jwBlue,
    card: COLORS.bgPure,
    text: COLORS.textLight,
    border: COLORS.border
  };

  if (isAppLoading) return <LoadingScreen />;

  if (isFirstLaunch) {

    return <OnboardingScreen onComplete={(name) => {
      setUserName(name);
      setIsFirstLaunch(false);
      AsyncStorage.setItem('userName', name);
    }} />;
  }

  return (
    <AppContext.Provider value={{
      userName, setUserName, userPhoto, setUserPhoto,
      progress, setProgress, history, setHistory,
      notes, setNotes, isDarkMode, setIsDarkMode,
      reminderConfig, setReminderConfig,
      theme: themeColors,
      openNoteEditor: (note) => {
        setActiveNote(note || { id: '', text: '', tags: [] });
        setNoteEditorVisible(true);
      }
    }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.bg }}>
        <ExpoStatusBar style="light" backgroundColor={COLORS.jwBlue} />
        <NavigationContainer>
          <TabNavigator
            onSettingsPress={() => setShowSettings(true)}
            onHistoryPress={() => setShowHistory(true)}
          />
        </NavigationContainer>

        {/* Modaux Globaux */}
        <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
        <HistoryModal visible={showHistory} onClose={() => setShowHistory(false)} />
        <NoteEditorModal
          visible={noteEditorVisible}
          currentNote={activeNote}
          onClose={() => setNoteEditorVisible(false)}
        />
      </SafeAreaView>
    </AppContext.Provider>
  );
}

// --- Navigation ---
const Tab = createBottomTabNavigator();

function TabNavigator({ onSettingsPress, onHistoryPress }) {
  const { theme } = useContext(AppContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Accueil') return <Home size={size} color={color} />;
          if (route.name === 'Plan') return <BookOpen size={size} color={color} />;
          if (route.name === 'Notes') return <FileText size={size} color={color} />;
          if (route.name === 'À Propos') return <Info size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.jwBlue,
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border, height: 60, paddingBottom: 8 },
        headerStyle: { backgroundColor: COLORS.jwBlue },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        headerRight: () => (
          <View style={{ flexDirection: 'row', marginRight: 10 }}>
            {/* This delete button is placed here as per user's instruction, but typically would be context-specific */}
            {/* Assuming 'note' and 'deleteNote' are available in this scope, which they are not in the current TabNavigator context */}
            {/* For a global header, this might not be the intended placement for a note-specific delete button */}
            {/* If this button is meant for a specific screen, it should be moved to that screen's headerRight option */}
            {/* For now, it's added as per the provided snippet. */}
            {/* <TouchableOpacity onPress={() => deleteNote(note.id)} style={{ padding: 5 }}>
              <Trash2 size={18} color={COLORS.jwBlue} />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={onHistoryPress} style={{ padding: 8 }}>
              <HistoryIcon size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onSettingsPress} style={{ padding: 8 }}>
              <SettingsIcon size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )
      })}
    >
      <Tab.Screen name="Accueil" component={HomeScreen} />
      <Tab.Screen name="Plan" component={ReadingScreen} />
      <Tab.Screen name="Notes" component={NotesScreen} />
      <Tab.Screen name="À Propos" component={AboutScreen} />
    </Tab.Navigator>
  );
}

// --- Écrans ---

function OnboardingScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const slideAnim = useState(new Animated.Value(50))[0];
  const opacityAnim = useState(new Animated.Value(0))[0];

  const steps = [
    {
      title: "Bienvenue !",
      desc: "Prêt à transformer votre lecture de la Bible en une habitude quotidienne ?",
      icon: <BookOpen size={60} color="#fff" />,
      color: COLORS.jwBlue
    },
    {
      title: "Tableau de Bord",
      desc: "Suivez votre progression annuelle globale et découvrez une pensée biblique chaque jour.",
      icon: <Home size={60} color="#fff" />,
      color: COLORS.primary
    },
    {
      title: "Plan de Lecture",
      desc: "368 sections pour lire toute la Bible. Cochez-les au fur et à mesure pour rester motivé.",
      icon: <CheckSquare size={60} color="#fff" />,
      color: '#2e7d32'
    },
    {
      title: "Notes Personnelles",
      desc: "Notez vos méditations et organisez-les avec des tags pour les retrouver facilement.",
      icon: <FileText size={60} color="#fff" />,
      color: '#ed6c02'
    },
    {
      title: "Accès JW.ORG",
      desc: "Chaque section contient un lien direct vers la Bibliothèque en ligne (WOL) pour approfondir.",
      icon: <ExternalLink size={60} color="#fff" />,
      color: '#1976d2'
    },
    {
      title: "Sécurisation des Données",
      desc: "Exportez vos notes et votre progression pour ne jamais les perdre, même si vous changez de téléphone.",
      icon: <Save size={60} color="#fff" />,
      color: '#7b1fa2'
    },
    {
      title: "Personnalisation",
      desc: "Configurez des rappels et activez le Mode Sombre pour une lecture reposante le soir.",
      icon: <SettingsIcon size={60} color="#fff" />,
      color: '#455a64'
    },
    {
      title: "Finalisons ensemble",
      desc: "Comment devrions-nous vous appeler ? Votre profil peut être complété plus tard dans les paramètres.",
      icon: <User size={60} color="#fff" />,
      color: COLORS.jwBlue,
      input: true
    }
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true })
    ]).start();
  }, [step]);

  const nextStep = () => {
    if (step < steps.length - 1) {
      slideAnim.setValue(30);
      opacityAnim.setValue(0);
      setStep(step + 1);
    } else {
      if (name.length > 2) onComplete(name);
    }
  };

  const currentStep = steps[step];

  return (
    <View style={styles.onboarding}>
      <Animated.View style={[styles.onboardingContent, { transform: [{ translateY: slideAnim }], opacity: opacityAnim }]}>
        <View style={[styles.logoCircle, { backgroundColor: currentStep.color }]}>{currentStep.icon}</View>
        <Text style={[styles.onboardingTitle, { color: currentStep.color }]}>{currentStep.title}</Text>
        <Text style={[styles.onboardingDev, { textAlign: 'center', marginBottom: 25, fontSize: 15, lineHeight: 22 }]}>
          {currentStep.desc}
        </Text>

        {currentStep.input && (
          <TextInput
            style={[styles.onboardingInput, { borderColor: currentStep.color }]}
            placeholder="Votre nom..."
            value={name}
            onChangeText={setName}
            autoFocus
          />
        )}

        <View style={{ flexDirection: 'row', gap: 6, marginBottom: 30 }}>
          {steps.map((_, i) => (
            <View key={i} style={{ width: step === i ? 20 : 8, height: 8, borderRadius: 4, backgroundColor: i === step ? currentStep.color : '#ddd' }} />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.onboardingBtn, { backgroundColor: (currentStep.input && name.length <= 2) ? '#ccc' : currentStep.color }]}
          onPress={nextStep}
          disabled={currentStep.input && name.length <= 2}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
            {step === steps.length - 1 ? "C'est parti !" : "Suivant"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}



function HomeScreen() {
  const { userName, userPhoto, progress, theme, notes, openNoteEditor } = useContext(AppContext);
  const completed = Object.values(progress).filter(Boolean).length;
  const percent = (completed / totalSections) * 100;

  const [quote, setQuote] = useState(BIBLE_QUOTES[0]);

  useEffect(() => {
    const randomQuote = BIBLE_QUOTES[Math.floor(Math.random() * BIBLE_QUOTES.length)];
    setQuote(randomQuote);
  }, []);

  const recentNotes = notes.slice(0, 3);

  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.bg }]} showsVerticalScrollIndicator={false}>
      <View style={[styles.jwHeroCard, { backgroundColor: COLORS.primary }]}>
        <View style={{ position: 'absolute', right: -20, top: -20, opacity: 0.1 }}>
          <Flame size={150} color="#fff" />
        </View>
        <View style={{ position: 'absolute', left: -30, bottom: -30, opacity: 0.05 }}>
          <BookOpen size={200} color="#fff" />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            {userPhoto ? (
              <Image source={{ uri: userPhoto }} style={styles.heroAvatar} />
            ) : (
              <View style={styles.heroAvatarPlaceholder}>
                <User color="#fff" size={30} />
              </View>
            )}
            <View style={{ marginLeft: 15, flex: 1 }}>
              <Text style={styles.heroGreeting} numberOfLines={1}>Salut, {userName}</Text>
              <Text style={styles.heroSubText}>Vers l'objectif annuel !</Text>
            </View>
          </View>
        </View>

        <View style={styles.heroProgressBox}>
          <View style={styles.heroProgressHeader}>
            <Text style={styles.heroProgressTitle}>Progression Totale</Text>
            <Text style={styles.heroPercentText}>{percent.toFixed(1)}%</Text>
          </View>
          <View style={styles.heroProgressBarBg}>
            <View style={[styles.heroProgressBarFill, { width: `${percent}%`, backgroundColor: '#fff' }]} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
            <Text style={styles.heroProgressDetail}>{completed} / {totalSections} sections</Text>
            <Text style={styles.heroProgressDetail}>{totalSections - completed} restantes</Text>
          </View>
        </View>
      </View>

      {/* Quote of the Day */}
      <View style={[styles.quoteCardJW, { backgroundColor: theme.card, borderColor: COLORS.primary + '22', borderWidth: 1 }]}>
        <Text style={[styles.quoteTextJW, { color: theme.text }]}>"{quote.text}"</Text>
        <Text style={styles.quoteRefJW}>{quote.ref}</Text>
      </View>

      <View style={{ marginBottom: 25, marginTop: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
          <Text style={styles.catTitle}>Notes Récentes</Text>
          <TouchableOpacity onPress={() => Linking.openURL('https://wol.jw.org/fr')}>
            <Text style={{ color: COLORS.primary, fontSize: 12, fontWeight: 'bold' }}>Voir WOL </Text>
          </TouchableOpacity>
        </View>

        {recentNotes.length > 0 ? (
          recentNotes.map(note => (
            <TouchableOpacity
              key={note.id}
              style={[styles.noteItem, { backgroundColor: theme.card, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: COLORS.primary }]}
              onPress={() => openNoteEditor(note)}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FileText size={14} color={COLORS.primary} style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 12, color: COLORS.primary, fontWeight: 'bold' }}>Réflexion</Text>
                </View>
                <Text style={{ fontSize: 11, color: '#888' }}>{note.date}</Text>
              </View>
              <Text style={[styles.noteText, { color: theme.text }]} numberOfLines={2}>{note.text}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={{ padding: 30, alignItems: 'center', backgroundColor: theme.card, borderRadius: 20, borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc' }}>
            <FileText size={30} color="#ccc" style={{ marginBottom: 10 }} />
            <Text style={{ color: '#888', fontStyle: 'italic' }}>Commencez à noter vos pensées...</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.actionBtn, {
          backgroundColor: COLORS.primary,
          paddingVertical: 20,
          borderRadius: 20,
          marginBottom: 30,
          width: '100%',
        }]}
        onPress={() => Linking.openURL('https://wol.jw.org/fr')}
      >
        <ExternalLink size={24} color="#fff" />
        <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 15, fontSize: 18 }}>Bibliothèque en ligne</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const LegendModal = ({ visible, info, onClose, theme }) => {
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const opacityAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
        Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true })
      ]).start();
    } else {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.legendModalBox, {
          backgroundColor: theme.card,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20
        }]}>
          <View style={{ alignItems: 'center', marginBottom: 25 }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: info.type === 'o' ? COLORS.prophetic + '15' : COLORS.christian + '15',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 15
            }}>
              {info.type === 'o' ? (
                <Text style={{ color: COLORS.prophetic, fontSize: 50, fontWeight: 'bold' }}>♦</Text>
              ) : (
                <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.christian }} />
              )}
            </View>
            <Text style={[styles.legendModalTitle, { color: theme.text, textAlign: 'center', fontSize: 22 }]}>
              {info.type === 'o' ? "Aperçu Historique" : "Aperçu Chronologique"}
            </Text>
          </View>

          <View style={{ backgroundColor: theme.bg, padding: 20, borderRadius: 15, marginBottom: 25 }}>
            <Text style={[styles.legendModalBody, { color: theme.text, textAlign: 'center', lineHeight: 24, fontSize: 16 }]}>
              {info.message}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.legendCloseBtn, { backgroundColor: COLORS.primary, height: 55, borderRadius: 18 }]}
            onPress={onClose}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>J'ai compris</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};


function ReadingScreen() {
  const { progress, setProgress, history, setHistory, theme, openNoteEditor } = useContext(AppContext);
  const [legendVisible, setLegendVisible] = useState(false);
  const [legendInfo, setLegendInfo] = useState({ type: '', message: '' });

  const sections = Object.entries(readingPlan).map(([title, data]) => ({
    title,
    data: data.flatMap(book => book.sections.map(s => ({ ...s, bookName: book.book })))
  }));

  const showLegend = (type) => {
    const message = type === 'o'
      ? "Les chapitres marqués d’un losange ROUGE donnent un aperçu historique des manières d’agir de Dieu avec les Israélites."
      : "Les chapitres marqués d’un rond BLEU donnent un aperçu chronologique du développement de l’assemblée chrétienne.";
    setLegendInfo({ type, message });
    setLegendVisible(true);
  };

  const toggleCheck = (book, sectionObj) => {
    const section = sectionObj.ch;
    const id = `${book}-${section}`;
    const newState = !progress[id];

    // Optimistic Update
    const newProgress = { ...progress, [id]: newState };
    setProgress(newProgress);
    AsyncStorage.setItem('bibleProgress', JSON.stringify(newProgress));

    if (newState) {
      const entry = { id, book, section, date: new Date().toLocaleDateString('fr-FR') };
      const newHistory = [entry, ...history];
      setHistory(newHistory);
      AsyncStorage.setItem('bibleHistory', JSON.stringify(newHistory));
    } else {
      const newHistory = history.filter(h => h.id !== id);
      setHistory(newHistory);
      AsyncStorage.setItem('bibleHistory', JSON.stringify(newHistory));
    }
  };

  const renderSectionItem = ({ item }) => {
    const bookName = item.bookName;
    const section = item.ch;
    const id = `${bookName}-${section}`;
    const isDone = progress[id];
    const historyEntry = history.find(h => h.id === id);
    const completionDate = historyEntry ? historyEntry.date : null;

    return (
      <View style={[styles.sectionRowJW, { borderBottomColor: theme.border, flexDirection: 'column', alignItems: 'flex-start', paddingVertical: 15, paddingHorizontal: 15, backgroundColor: theme.card, marginBottom: 1, borderRadius: 5 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => toggleCheck(bookName, item)}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}
            >
              {isDone ? <CheckSquare size={24} color={COLORS.primary} /> : <Square size={24} color="#ccc" />}
              <View style={{ width: 12 }} />
            </TouchableOpacity>

            {item.m && (
              <TouchableOpacity onPress={() => showLegend(item.m)} style={{ paddingVertical: 5, paddingRight: 10 }}>
                {item.m === 'o' ? (
                  <Text style={{ color: COLORS.prophetic, fontSize: 18, marginTop: -2 }}>♦</Text>
                ) : (
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.christian }} />
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => toggleCheck(bookName, item)}
              style={{ flex: 1 }}
            >
              <Text style={[styles.sectionTxtJW, { color: theme.text, fontWeight: isDone ? 'bold' : 'normal', fontSize: 16 }]}>
                {bookName} {section}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => openJWLink(bookName, section)}
            style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.accent, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}
          >
            <Text style={{ fontSize: 11, color: COLORS.primary, fontWeight: 'bold', marginRight: 5 }}>JW.ORG</Text>
            <ExternalLink size={14} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, width: '100%', paddingLeft: 40 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
            {isDone && completionDate && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Calendar size={12} color="#888" style={{ marginRight: 5 }} />
                <Text style={{ fontSize: 11, color: '#888' }}>{completionDate}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={() => openNoteEditor({ id: '', text: `Note sur ${bookName} ${section} : `, tags: [] })}
            style={{ flexDirection: 'row', alignItems: 'center', borderColor: COLORS.primary, borderWidth: 0.8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 }}
          >
            <FileText size={16} color={COLORS.primary} />
            <Text style={{ fontSize: 12, color: COLORS.primary, marginLeft: 6, fontWeight: 'bold' }}>Noter</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <LegendModal
        visible={legendVisible}
        info={legendInfo}
        onClose={() => setLegendVisible(false)}
        theme={theme}
      />
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.bookName + item.ch + index}
        renderItem={renderSectionItem}
        renderSectionHeader={({ section: { title } }) => (
          <View style={{ backgroundColor: theme.bg, paddingVertical: 15, paddingHorizontal: 15 }}>
            <Text style={styles.catTitle}>{title}</Text>
          </View>
        )}
        stickySectionHeadersEnabled={false}
        initialNumToRender={15}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}



function NoteEditorModal({ visible, currentNote, onClose }) {
  const { notes, setNotes, theme } = useContext(AppContext);
  const [noteContent, setNoteContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (visible) {
      setNoteContent(currentNote.text);
      setTags(currentNote.tags || []);
    }
  }, [visible, currentNote]);

  const saveNote = () => {
    if (noteContent.trim()) {
      let newNotes;
      if (currentNote.id) {
        newNotes = notes.map(n => n.id === currentNote.id ? { ...currentNote, text: noteContent, tags, date: new Date().toLocaleDateString() } : n);
      } else {
        newNotes = [{ id: Date.now().toString(), text: noteContent, tags, date: new Date().toLocaleDateString() }, ...notes];
      }
      setNotes(newNotes);
      AsyncStorage.setItem('bibleNotes', JSON.stringify(newNotes));
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: theme.bg }}>
        <View style={{
          backgroundColor: COLORS.jwBlue,
          paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
          paddingBottom: 10
        }}>
          <View style={[styles.modalHeader, { backgroundColor: COLORS.jwBlue, height: 60, elevation: 4 }]}>
            <TouchableOpacity onPress={onClose} style={{ padding: 15 }}><X size={26} color="#fff" /></TouchableOpacity>
            <Text style={[styles.modalTitle, { fontSize: 20 }]}>Note</Text>
            <TouchableOpacity onPress={saveNote} style={{ padding: 15 }}><Save size={26} color="#fff" /></TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.modalScroll}>

          <TextInput
            style={[styles.modalNoteInput, { color: theme.text, backgroundColor: theme.card }]}
            multiline
            placeholder="Écrivez vos pensées..."
            placeholderTextColor="#888"
            value={noteContent}
            onChangeText={setNoteContent}
          />
          <View style={styles.tagsSection}>
            <View style={styles.tagInputRow}>
              <TextInput
                style={[styles.tagInput, { color: theme.text }]}
                placeholder="Ajouter un tag..."
                value={tagInput}
                onChangeText={setTagInput}
              />
              <TouchableOpacity
                style={styles.addTagBtn}
                onPress={() => {
                  if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                    setTags([...tags, tagInput.trim()]);
                    setTagInput('');
                  }
                }}
              >
                <Plus size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.tagCloud}>
              {tags.map(tag => (
                <TouchableOpacity
                  key={tag}
                  style={styles.tagBadgeLarge}
                  onPress={() => setTags(tags.filter(t => t !== tag))}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                  <X size={14} color="#fff" />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.inputLabel, { color: theme.text, marginTop: 20, marginBottom: 10 }]}>Suggestions :</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
              {['Encouragement', 'Prophétie', 'Histoire', 'Conseil', 'Réunion', 'Prédication', 'Étude perso'].concat(Array.from(new Set(notes.flatMap(n => n.tags)))).filter(t => !tags.includes(t)).map(tag => (
                <TouchableOpacity
                  key={tag}
                  style={[styles.filterTag, { backgroundColor: theme.card }]}
                  onPress={() => setTags([...tags, tag])}
                >
                  <Text style={{ color: theme.text }}>+ {tag}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

function NotesScreen() {
  const { notes, setNotes, theme, openNoteEditor } = useContext(AppContext);
  const [tagInput, setTagInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSearchTag, setActiveSearchTag] = useState(null);

  // Extraire tous les tags uniques existants
  const allExistingTags = Array.from(new Set(notes.flatMap(n => n.tags)));

  const saveNote = () => {
    if (currentNote.text.trim()) {
      let newNotes;
      if (currentNote.id) {
        newNotes = notes.map(n => n.id === currentNote.id ? { ...currentNote, date: new Date().toLocaleDateString() } : n);
      } else {
        newNotes = [{ ...currentNote, id: Date.now().toString(), date: new Date().toLocaleDateString() }, ...notes];
      }
      setNotes(newNotes);
      AsyncStorage.setItem('bibleNotes', JSON.stringify(newNotes));
    }
    setModalVisible(false);
  };

  const deleteNote = (id) => {
    Alert.alert("Supprimer", "Voulez-vous supprimer cette note ?", [
      { text: "Annuler" },
      {
        text: "Supprimer", style: "destructive", onPress: () => {
          const newNotes = notes.filter(n => n.id !== id);
          setNotes(newNotes);
          AsyncStorage.setItem('bibleNotes', JSON.stringify(newNotes));
        }
      }
    ]);
  };

  const filteredNotes = notes.filter(note => {
    const matchesQuery = note.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesTag = activeSearchTag ? note.tags.includes(activeSearchTag) : true;
    return matchesQuery && matchesTag;
  });

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {/* Barre de recherche */}
      <View style={[styles.searchBarContainer, { backgroundColor: theme.card }]}>
        <View style={[styles.searchWrapper, { backgroundColor: theme.bg }]}>
          <Search size={18} color="#888" />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Rechercher par texte ou tag..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filtre par Tag (Style JW Library) */}
      {allExistingTags.length > 0 && (
        <View style={styles.tagFiltersScroll}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 15 }}>
            <TouchableOpacity
              style={[styles.filterTag, !activeSearchTag && styles.filterTagActive]}
              onPress={() => setActiveSearchTag(null)}
            >
              <Text style={[styles.filterTagText, !activeSearchTag && { color: '#fff' }]}>Tous</Text>
            </TouchableOpacity>
            {allExistingTags.map(tag => (
              <TouchableOpacity
                key={tag}
                style={[styles.filterTag, activeSearchTag === tag && styles.filterTagActive]}
                onPress={() => setActiveSearchTag(tag === activeSearchTag ? null : tag)}
              >
                <Text style={[styles.filterTagText, activeSearchTag === tag && { color: '#fff' }]}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <FlatList
        data={filteredNotes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.noteItem, { backgroundColor: theme.card }]}
            onPress={() => openNoteEditor(item)}
          >
            <View style={styles.noteHeaderRow}>
              <Text style={[styles.noteDate, { color: '#888' }]}>{item.date}</Text>
              <TouchableOpacity onPress={() => deleteNote(item.id)}><Trash2 size={16} color={COLORS.jwBlue} /></TouchableOpacity>
            </View>
            <Text style={[styles.noteText, { color: theme.text }]} numberOfLines={3}>{item.text}</Text>
            <View style={styles.tagRow}>
              {item.tags.map((tag, i) => (
                <View key={i} style={styles.tagBadge}><TagIcon size={10} color="#fff" style={{ marginRight: 4 }} /><Text style={styles.tagText}>{tag}</Text></View>
              ))}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 50, color: '#888' }}>Aucune note trouvée.</Text>}
        contentContainerStyle={{ padding: 15 }}
      />


      <TouchableOpacity style={styles.fab} onPress={() => openNoteEditor()}>
        <Plus size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function AboutScreen() {
  const { theme } = useContext(AppContext);
  return (
    <ScrollView style={[styles.screen, { backgroundColor: theme.bg }]}>
      <View style={[styles.jwCard, { backgroundColor: theme.card }]}>
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <View style={styles.logoCircle}><BookOpen size={40} color="#fff" /></View>
          <Text style={[styles.jwGreeting, { color: COLORS.jwBlue, textAlign: 'center' }]}>Ma Lecture de la Bible</Text>
          <Text style={{ color: '#888', fontSize: 12 }}>Version 1.2.0</Text>
        </View>

        <Text style={[styles.sectionTitleJW, { color: theme.text }]}>Utilité de l'application</Text>
        <Text style={[styles.aboutText, { color: theme.text }]}>
          Cette application est conçue pour aider chaque chrétien à maintenir un rythme de lecture biblique quotidien.
          En suivant ce plan de 368 sections, vous pouvez lire l'intégralité de la Parole de Dieu en une année.
        </Text>

        <Text style={[styles.sectionTitleJW, { color: theme.text, marginTop: 20 }]}>Comment l'utiliser ?</Text>
        <View style={styles.guideStep}>
          <CheckSquare size={18} color={COLORS.jwBlue} />
          <Text style={[styles.guideText, { color: theme.text }]}>Cochez chaque section après lecture pour suivre votre progression.</Text>
        </View>
        <View style={styles.guideStep}>
          <ExternalLink size={18} color={COLORS.jwBlue} />
          <Text style={[styles.guideText, { color: theme.text }]}>Utilisez le lien JW.ORG pour ouvrir directement les chapitres dans la Traduction du monde nouveau.</Text>
        </View>
        <View style={styles.guideStep}>
          <FileText size={18} color={COLORS.jwBlue} />
          <Text style={[styles.guideText, { color: theme.text }]}>Prenez des notes et organisez-les avec des étiquettes (tags).</Text>
        </View>

        <View style={styles.dividerJW} />

        <Text style={[styles.quoteTextJW, { marginTop: 10, color: theme.text }]}>
          "Ta parole est une lampe pour mon pied, et une lumière pour mon sentier."
        </Text>
        <Text style={[styles.quoteRefJW, { textAlign: 'center' }]}>— Psaume 119:105</Text>

        <View style={styles.creatorInfo}>
          <Text style={{ color: '#888', fontSize: 12 }}>Développé par</Text>
          <Text style={[styles.creatorName, { color: theme.text }]}>votre frère</Text>
        </View>
      </View>
    </ScrollView>
  );
}

function HistoryModal({ visible, onClose }) {
  const { history, theme } = useContext(AppContext);
  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.settingsOverlay}>
        <View style={[styles.settingsBox, { backgroundColor: theme.card, height: '90%' }]}>
          <View style={styles.settingsHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <HistoryIcon size={24} color={COLORS.jwBlue} style={{ marginRight: 10 }} />
              <Text style={[styles.settingsTitle, { color: theme.text }]}>Historique de lecture</Text>
            </View>
            <TouchableOpacity onPress={onClose}><X size={24} color={theme.text} /></TouchableOpacity>
          </View>

          <FlatList
            data={history}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={[styles.historyItem, { borderBottomColor: theme.border }]}>
                <View style={styles.historyIconBox}><CheckSquare size={20} color={COLORS.jwBlue} /></View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.historyBook, { color: theme.text }]}>{item.book} {item.section}</Text>
                  <Text style={styles.historyDate}>{item.date}</Text>
                </View>
                <TouchableOpacity onPress={() => openJWLink(item.book, item.section)}>
                  <ExternalLink size={18} color="#aaa" />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 50, color: '#888' }}>Aucun historique.</Text>}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </View>
      </View>
    </Modal>
  );
}

// --- Rappels et Notifications ---
const DAYS_MAP = { 'Dimanche': 1, 'Lundi': 2, 'Mardi': 3, 'Mercredi': 4, 'Jeudi': 5, 'Vendredi': 6, 'Samedi': 7 };
const DAYS_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const scheduleNotification = async (reminderConfig) => {
  if (Platform.OS === 'web') {
    Alert.alert("Info", "Les notifications ne sont pas disponibles sur le Web.");
    return;
  }

  await Notifications.cancelAllScheduledNotificationsAsync();
  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== 'granted') {
    Alert.alert("Permission refusée", "Veuillez activer les notifications dans les réglages.");
    return;
  }

  let count = 0;
  for (const day of DAYS_FR) {
    const time = reminderConfig[day];
    if (time) {
      const [hours, minutes] = time.split(':').map(Number);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "📖 Temps de lecture !",
          body: `C'est l'heure de votre lecture pour ce ${day} !`,
        },
        trigger: {
          hour: hours,
          minute: minutes,
          weekday: DAYS_MAP[day],
          repeats: true,
          channelId: 'daily-reading'
        },
      });
      count++;
    }
  }

  if (count > 0) {
    Alert.alert("Succès", `${count} rappel(s) configuré(s) !`);
  }
};

function ReminderModal({ visible, onClose, currentConfig, onSave }) {
  const [config, setConfig] = useState(currentConfig || {});
  const [showPicker, setShowPicker] = useState(false);
  const [activeDay, setActiveDay] = useState(null);
  const { theme } = useContext(AppContext);

  const onTimeChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate && activeDay) {
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;
      setConfig({ ...config, [activeDay]: timeStr });
    }
    setActiveDay(null);
  };

  const handleDayClick = (day) => {
    setActiveDay(day);
    setShowPicker(true);
  };

  const handleRemoveDay = (day) => {
    const newCfg = { ...config };
    delete newCfg[day];
    setConfig(newCfg);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.settingsOverlay}>
        <View style={[styles.settingsBox, { backgroundColor: theme.card, height: 'auto', maxHeight: '80%', position: 'relative', bottom: 'auto' }]}>
          <View style={styles.settingsHeader}>
            <Text style={[styles.settingsTitle, { color: theme.text }]}>Rappels hebdomadaires</Text>
            <TouchableOpacity onPress={onClose}><X size={24} color={theme.text} /></TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ marginVertical: 10 }}>
            {DAYS_FR.map(day => (
              <View key={day} style={{ paddingVertical: 15, borderBottomWidth: 0.5, borderBottomColor: theme.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: theme.text, fontWeight: 'bold', flex: 1 }}>{day}</Text>
                {config[day] ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <TouchableOpacity onPress={() => handleDayClick(day)}>
                      <Text style={{ color: COLORS.jwBlue, fontWeight: 'bold', fontSize: 16 }}>{config[day]}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleRemoveDay(day)} style={{ padding: 5 }}>
                      <Trash2 size={18} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleDayClick(day)}
                    style={{ backgroundColor: '#eeeeee', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 }}
                  >
                    <Text style={{ color: '#888888' }}>Configurer</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={[styles.onboardingBtn, { backgroundColor: COLORS.jwBlue, marginTop: 10 }]}
            onPress={() => { onSave(config); onClose(); }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Sauvegarder les rappels</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showPicker && Platform.OS !== 'web' && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'android' ? 'clock' : 'spinner'}
          onChange={onTimeChange}
        />
      )}
    </Modal>
  );
}

function SettingsModal({ visible, onClose }) {
  const {
    isDarkMode, setIsDarkMode,
    userName, setUserName,
    userPhoto, setUserPhoto,
    theme, progress, setProgress,
    notes, setNotes,
    history, setHistory,
    reminderConfig, setReminderConfig
  } = useContext(AppContext);

  const [tempName, setTempName] = useState(userName);
  const [tempPhoto, setTempPhoto] = useState(userPhoto);
  const [hasChanges, setHasChanges] = useState(false);
  const [reminderVisible, setReminderVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setTempName(userName);
      setTempPhoto(userPhoto);
      setHasChanges(false);
    }
  }, [visible, userName, userPhoto]);

  const confirmProfileChanges = async () => {
    setUserName(tempName);
    setUserPhoto(tempPhoto);
    await AsyncStorage.multiSet([
      ['userName', tempName],
      ['userPhoto', tempPhoto || '']
    ]);
    setHasChanges(false);
    Alert.alert("Succès", "Profil mis à jour !");
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.8 });
    if (!result.canceled) {
      setTempPhoto(result.assets[0].uri);
      setHasChanges(true);
    }
  };

  const exportData = async () => {
    try {
      const data = {
        progress,
        notes,
        history,
        userName,
        userPhoto,
        isDarkMode,
        reminderConfig,
        exportDate: new Date().toLocaleDateString('fr-FR')
      };

      const json = JSON.stringify(data);
      const encrypted = base64Encode(json);
      const safeName = (userName || 'user').replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const dateStr = new Date().toISOString().split('T')[0];
      const fileName = `${safeName}-${dateStr}-${Date.now()}.json`;

      if (Platform.OS === 'web') {
        const blob = new Blob([encrypted], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = fileName;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        Alert.alert("Succès", "Sauvegarde téléchargée !");
        return;
      }

      // Chemin temporaire propre sur Android/iOS
      const filePath = `${FileSystem.cacheDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(filePath, encrypted, { encoding: FileSystem.EncodingType.UTF8 });

      await Sharing.shareAsync(filePath, {
        mimeType: 'text/plain',
        dialogTitle: 'Exporter ma sauvegarde sécurisée',
        UTI: 'public.json'
      });
    } catch (e) {
      console.error(e);
      Alert.alert("Erreur", "La sauvegarde a échoué.");
    }
  };


  const importData = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        const fileContent = await FileSystem.readAsStringAsync(res.assets[0].uri);

        let data;
        try {
          // Tenter de décoder le Base64 (nouveau format)
          const decoded = base64Decode(fileContent);
          data = JSON.parse(decoded);
        } catch (e) {
          // Repli sur le JSON brut (ancien format / compatibilité)
          try {
            data = JSON.parse(fileContent);
          } catch (e2) {
            Alert.alert("Erreur", "Le fichier de sauvegarde est corrompu ou invalide.");
            return;
          }
        }

        Alert.alert("Restaurer", "Cela remplacera vos données actuelles. Continuer ?", [
          { text: "Annuler" },
          {
            text: "Restaurer", style: "destructive", onPress: async () => {
              await AsyncStorage.multiSet([
                ['bibleProgress', JSON.stringify(data.progress || {})],
                ['bibleNotes', JSON.stringify(data.notes || [])],
                ['bibleHistory', JSON.stringify(data.history || [])],
                ['userName', data.userName || ''],
                ['userPhoto', data.userPhoto || ''],
                ['reminderConfig', JSON.stringify(data.reminderConfig || {})]
              ]);

              setProgress(data.progress || {});
              setNotes(data.notes || []);
              setHistory(data.history || []);
              setReminderConfig(data.reminderConfig || {});
              if (data.userName) setUserName(data.userName);
              if (data.userPhoto) setUserPhoto(data.userPhoto);
              if (data.isDarkMode !== undefined) setIsDarkMode(data.isDarkMode);

              Alert.alert("Succès", "Données importées avec succès !");
            }
          }
        ]);
      }
    } catch (e) {
      Alert.alert("Erreur", "L'importation a échoué.");
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.settingsOverlay}>
        <View style={[styles.settingsBox, { backgroundColor: theme.card }]}>
          <View style={styles.settingsHeader}>
            <Text style={[styles.settingsTitle, { color: theme.text }]}>Paramètres</Text>
            <TouchableOpacity onPress={onClose}><X size={24} color={theme.text} /></TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.profileEdit} onPress={pickImage}>
              {tempPhoto ? <Image source={{ uri: tempPhoto }} style={styles.profileImg} /> : <View style={styles.profileImgPlaceholder}><Camera color="#fff" /></View>}
              <Text style={{ marginTop: 10, color: COLORS.jwBlue }}>Changer la photo</Text>
            </TouchableOpacity>

            <View style={styles.inputGroupJW}>
              <Text style={[styles.inputLabel, { color: theme.text }]}>Nom d'utilisateur</Text>
              <TextInput
                style={[styles.jInput, { color: theme.text, borderColor: theme.border }]}
                value={tempName}
                onChangeText={(v) => { setTempName(v); setHasChanges(true); }}
              />
            </View>

            {hasChanges && (
              <TouchableOpacity
                style={[styles.onboardingBtn, { backgroundColor: COLORS.jwBlue, marginBottom: 20, height: 45 }]}
                onPress={confirmProfileChanges}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Enregistrer le profil</Text>
              </TouchableOpacity>
            )}

            <View style={styles.settingRowJW}>
              <View>
                <Text style={{ color: theme.text, fontWeight: 'bold' }}>Mode Sombre</Text>
                <Text style={{ color: '#888', fontSize: 12 }}>Adapter l'interface pour la nuit</Text>
              </View>
              <Switch value={isDarkMode} onValueChange={(v) => { setIsDarkMode(v); AsyncStorage.setItem('isDarkMode', JSON.stringify(v)); }} />
            </View>

            <View style={styles.settingRowJW}>
              <View>
                <Text style={{ color: theme.text, fontWeight: 'bold' }}>Rappels hebdomadaires</Text>
                <Text style={{ color: '#888', fontSize: 12 }}>{Object.keys(reminderConfig).length > 0 ? `${Object.keys(reminderConfig).length} jours configurés` : 'Non configuré'}</Text>
              </View>
              <TouchableOpacity onPress={() => setReminderVisible(true)}>
                <Bell size={24} color={COLORS.jwBlue} />
              </TouchableOpacity>
            </View>

            <ReminderModal
              visible={reminderVisible}
              onClose={() => setReminderVisible(false)}
              currentConfig={reminderConfig}
              onSave={async (config) => {
                setReminderConfig(config);
                await AsyncStorage.setItem('reminderConfig', JSON.stringify(config));
                scheduleNotification(config);
              }}
            />

            <TouchableOpacity
              style={styles.settingItemAction}
              onPress={() => { onClose(); setIsFirstLaunch(true); }}
            >
              <Info size={20} color={COLORS.jwBlue} />
              <View style={{ marginLeft: 15 }}>
                <Text style={{ color: theme.text }}>Relancer le Guide d'utilisation</Text>
                <Text style={{ color: '#888', fontSize: 11 }}>Revoir toutes les fonctionnalités</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.settingDivider} />

            <Text style={[styles.sectionTitleJW, { color: theme.text, fontSize: 14, marginTop: 10 }]}>Données & Sécurité</Text>


            <TouchableOpacity style={styles.settingItemAction} onPress={exportData}>
              <Save size={20} color={COLORS.jwBlue} />
              <View style={{ marginLeft: 15 }}>
                <Text style={{ color: theme.text }}>Exporter une sauvegarde</Text>
                <Text style={{ color: '#888', fontSize: 11 }}>Sauvegarder notes, tags et progression</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItemAction} onPress={importData}>
              <RotateCcw size={20} color={COLORS.jwBlue} />
              <View style={{ marginLeft: 15 }}>
                <Text style={{ color: theme.text }}>Importer une sauvegarde</Text>
                <Text style={{ color: '#888', fontSize: 11 }}>Restaurer depuis un fichier existant</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.settingItemAction}
              onPress={() => Alert.alert("Réinitialiser", "Voulez-vous effacer vos données de lecture ? (Profil conservé)", [
                { text: "Annuler", style: "cancel" },
                {
                  text: "Oui, tout effacer",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      // Suppression stockage local
                      const keys = ['bibleProgress', 'bibleHistory', 'bibleNotes', 'reminderConfig'];
                      await AsyncStorage.multiRemove(keys);

                      // Remise à zéro des états (décocher + supprimer notes/tags)
                      setProgress({});
                      setNotes([]);
                      setHistory([]);
                      setReminderConfig({});

                      onClose(); // Fermer pour rafraîchir l'interface

                      setTimeout(() => {
                        Alert.alert("Succès", "Progression et notes effacées. Profil conservé.");
                      }, 500);
                    } catch (err) {
                      Alert.alert("Erreur", "La réinitialisation a échoué.");
                    }
                  }
                }
              ])}
            >
              <Trash2 size={20} color="#ef4444" />
              <View style={{ marginLeft: 15 }}>
                <Text style={{ color: '#ef4444', fontWeight: 'bold' }}>Effacer ma progression</Text>
                <Text style={{ color: '#888', fontSize: 11 }}>Action irréversible</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  onboarding: { flex: 1, backgroundColor: COLORS.jwBlue, justifyContent: 'center', alignItems: 'center' },
  onboardingContent: { backgroundColor: '#fff', width: '85%', padding: 40, borderRadius: 30, alignItems: 'center' },
  logoCircle: { backgroundColor: COLORS.jwBlue, p: 20, borderRadius: 50, padding: 20, marginBottom: 20 },
  onboardingTitle: { fontSize: 24, fontWeight: 'bold' },
  onboardingDev: { fontSize: 12, color: '#888', marginBottom: 30 },
  onboardingInput: { width: '100%', borderBottomWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 30 },
  onboardingBtn: { width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },

  screen: { flex: 1, padding: 15 },
  jwHeroCard: {
    padding: 25,
    borderRadius: 30,
    marginBottom: 20,
    elevation: 8,
    shadowColor: COLORS.jwBlue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  heroAvatar: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, borderColor: '#fff' },
  heroAvatarPlaceholder: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#fff' },
  heroGreeting: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  heroSubText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  heroProgressBox: { marginTop: 25 },
  heroProgressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  heroProgressTitle: { color: '#fff', fontSize: 14, fontWeight: '600' },
  heroPercentText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  heroProgressBarBg: { height: 10, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 5, overflow: 'hidden' },
  heroProgressBarFill: { height: '100%', backgroundColor: '#fff' },
  heroProgressDetail: { fontSize: 11, color: 'rgba(255,255,255,0.7)' },
  streakBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },

  jwCard: {
    padding: 25,
    borderRadius: 20,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8
  },

  quoteCardJW: { padding: 25, borderRadius: 20, alignItems: 'center', gap: 12, marginBottom: 15 },
  quoteTextJW: { fontSize: 16, fontStyle: 'italic', textAlign: 'center', lineHeight: 24 },
  quoteRefJW: { color: COLORS.jwBlue, fontWeight: 'bold' },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionBtn: {
    flex: 1,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3
  },

  catGroup: { marginBottom: 30 },
  catTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.jwBlue, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  bookCard: { borderRadius: 15, padding: 15, marginBottom: 15 },
  bookHeader: { fontSize: 16, fontWeight: 'bold', borderBottomWidth: 0.5, borderBottomColor: '#eee', paddingBottom: 8, marginBottom: 12 },
  sectionGrid: { gap: 1 },
  sectionRowJW: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#f7f7f7' },
  sectionMain: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  sectionLabelWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', marginLeft: 12 },
  dotJW: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
  sectionTxtJW: { fontSize: 16 },

  noteItem: { padding: 20, borderRadius: 15, marginBottom: 15, elevation: 1 },
  noteHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  noteDate: { fontSize: 12 },
  noteText: { fontSize: 15, lineHeight: 22 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  tagBadge: { backgroundColor: COLORS.jwBlue, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 5, flexDirection: 'row', alignItems: 'center' },
  tagText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: COLORS.jwBlue, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },

  modalHeader: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalNoteInput: { flex: 1, height: 300, padding: 20, fontSize: 18, textAlignVertical: 'top' },
  tagsSection: { padding: 20 },
  sectionTitleJW: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
  tagInputRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  tagInput: { flex: 1, height: 45, borderRadius: 10, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  addTagBtn: { backgroundColor: COLORS.jwBlue, width: 45, height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  tagCloud: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tagBadgeLarge: { backgroundColor: COLORS.jwBlue, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },

  historyItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 0.5 },
  historyIconBox: { width: 40 },
  historyBook: { fontSize: 16, fontWeight: '500' },
  historyDate: { fontSize: 12, color: '#888', marginTop: 3 },

  settingsOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  settingsBox: { width: '100%', height: '85%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, position: 'absolute', bottom: 0 },
  settingsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
  settingsTitle: { fontSize: 20, fontWeight: 'bold' },
  profileEdit: { alignItems: 'center', marginBottom: 30 },
  profileImg: { width: 100, height: 100, borderRadius: 50 },
  profileImgPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.jwBlue, justifyContent: 'center', alignItems: 'center' },
  inputGroupJW: { marginBottom: 20 },
  inputLabel: { fontSize: 14, marginBottom: 8, opacity: 0.6 },
  jInput: { height: 50, borderBottomWidth: 1, fontSize: 16 },
  settingRowJW: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, borderTopWidth: 0.5, borderTopColor: '#f0f0f0' },
  dangerBtnJW: { flexDirection: 'row', alignItems: 'center', marginTop: 30, padding: 15, backgroundColor: '#fff5f5', borderRadius: 15 },

  searchBarContainer: { padding: 15, paddingBottom: 5 },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 45, borderRadius: 12, elevation: 1 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },

  tagFiltersScroll: { paddingVertical: 10 },
  filterTag: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', marginRight: 10, borderWidth: 1, borderColor: '#eee' },
  filterTagActive: { backgroundColor: COLORS.jwBlue, borderColor: COLORS.jwBlue },
  filterTagText: { fontSize: 13, color: '#666' },

  legendModalBox: { width: '80%', padding: 25, borderRadius: 20 },
  legendModalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  legendModalBody: { fontSize: 15, lineHeight: 22, opacity: 0.8 },
  legendCloseBtn: { backgroundColor: COLORS.jwBlue, padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 20 },

  aboutText: { fontSize: 15, lineHeight: 22, marginBottom: 15 },
  guideStep: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 15 },
  guideText: { fontSize: 14, flex: 1 },
  dividerJW: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
  creatorInfo: { alignItems: 'center', marginTop: 30 },

  settingDivider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 15 },
  settingItemAction: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
});
