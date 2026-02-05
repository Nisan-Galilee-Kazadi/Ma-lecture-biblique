import React, { useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, BookOpen, FileText, Info, History as HistoryIcon, Settings as SettingsIcon } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { AppContext } from '../context/AppContext';
import HomeScreen from '../screens/HomeScreen';
import ReadingScreen from '../screens/ReadingScreen';
import NotesScreen from '../screens/NotesScreen';
import AboutScreen from '../screens/AboutScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator({ onSettingsPress, onHistoryPress }) {
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
