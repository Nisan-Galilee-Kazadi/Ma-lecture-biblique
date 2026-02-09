import React from 'react';
import { SafeAreaView } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { AppContextProvider, AppContext } from './src/context/AppContext';
import { registerForPushNotificationsAsync } from './src/utils/registerNotifications';
import LoadingScreen from './src/components/LoadingScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import TabNavigator from './src/navigation/TabNavigator';
import HistoryModal from './src/components/modals/HistoryModal';
import SettingsModal from './src/components/modals/SettingsModal';
import NoteEditorModal from './src/components/modals/NoteEditorModal';
import { COLORS } from './src/constants/theme';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function AppContent() {
  const {
    isAppLoading,
    isFirstLaunch,
    setIsFirstLaunch,
    setUserName,
    theme
  } = React.useContext(AppContext);

  const [showSettings, setShowSettings] = React.useState(false);
  const [showHistory, setShowHistory] = React.useState(false);
  const [noteEditorVisible, setNoteEditorVisible] = React.useState(false);
  const [activeNote, setActiveNote] = React.useState({ id: '', text: '', tags: [] });

  const openNoteEditor = React.useCallback((note) => {
    setActiveNote(note || { id: '', text: '', tags: [] });
    setNoteEditorVisible(true);
  }, []);

  if (isAppLoading) {
    return <LoadingScreen />;
  }

  if (isFirstLaunch) {
    return (
      <OnboardingScreen
        onComplete={(name) => {
          setUserName(name);
          setIsFirstLaunch(false);
        }}
      />
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }}>
      <ExpoStatusBar style="light" backgroundColor={COLORS.jwBlue} />
      <NavigationContainer>
        <TabNavigator
          onSettingsPress={() => setShowSettings(true)}
          onHistoryPress={() => setShowHistory(true)}
        />
      </NavigationContainer>

      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />
      <HistoryModal visible={showHistory} onClose={() => setShowHistory(false)} />
      <NoteEditorModal visible={noteEditorVisible} currentNote={activeNote} onClose={() => setNoteEditorVisible(false)} />
    </SafeAreaView>
  );
}

export default function App() {
  React.useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}
