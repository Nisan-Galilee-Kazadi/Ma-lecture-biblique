import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/theme';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [userName, setUserName] = useState('');
    const [userPhoto, setUserPhoto] = useState(null);
    const [progress, setProgress] = useState({});
    const [history, setHistory] = useState([]);
    const [notes, setNotes] = useState([]);
    const [isFirstLaunch, setIsFirstLaunch] = useState(true);
    const [reminderConfig, setReminderConfig] = useState({});
    const [activeNote, setActiveNote] = useState({ id: '', text: '', tags: [] });
    const [noteEditorVisible, setNoteEditorVisible] = useState(false);
    const [isAppLoading, setIsAppLoading] = useState(true);

    useEffect(() => {
        loadAppState();
        setupNotifications();
    }, []);

    const setupNotifications = async () => {
        try {
            // Demander les permissions de notification
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                return;
            }

            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('daily-reading', {
                    name: 'Rappels de lecture',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: COLORS.jwBlue,
                });
            }
        } catch (error) {
            // Erreur silencieuse pour les notifications
        }
    };

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

            setTimeout(() => {
                setIsAppLoading(false);
            }, 1000);
        } catch (e) {
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

    const openNoteEditor = (note) => {
        setActiveNote(note || { id: '', text: '', tags: [] });
        setNoteEditorVisible(true);
    };

    return (
        <AppContext.Provider value={{
            userName, setUserName, userPhoto, setUserPhoto,
            progress, setProgress, history, setHistory,
            notes, setNotes, isDarkMode, setIsDarkMode,
            reminderConfig, setReminderConfig,
            theme: themeColors,
            isFirstLaunch, setIsFirstLaunch,
            isAppLoading,
            activeNote, setActiveNote,
            noteEditorVisible, setNoteEditorVisible,
            openNoteEditor
        }}>
            {children}
        </AppContext.Provider>
    );
};
