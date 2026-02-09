import React, { useState, useEffect, useContext } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, Image, TextInput, Switch, Alert, StyleSheet, Platform } from 'react-native';
import { X, Camera, Bell, Info, Save, RotateCcw, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { COLORS } from '../../constants/theme';
import { AppContext } from '../../context/AppContext';
import { base64Encode, base64Decode } from '../../utils/encryption';
import ReminderModal from './ReminderModal';

const DAYS_MAP = { 'Dimanche': 1, 'Lundi': 2, 'Mardi': 3, 'Mercredi': 4, 'Jeudi': 5, 'Vendredi': 6, 'Samedi': 7 };
const DAYS_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];


export default function SettingsModal({ visible, onClose }) {
    const {
        isDarkMode, setIsDarkMode,
        userName, setUserName,
        userPhoto, setUserPhoto,
        theme, progress, setProgress,
        notes, setNotes,
        history, setHistory,
        reminderConfig, setReminderConfig,
        setIsFirstLaunch
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
                        channelId: 'daily-reading',
                    },
                    trigger: {
                        hour: hours,
                        minute: minutes,
                        weekday: DAYS_MAP[day],
                        repeats: true,
                    },
                });
                count++;
            }
        }

        if (count > 0) {
            console.log(`${count} rappel(s) configuré(s) !`);
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
                Alert.alert("Info", "L'exportation n'est pas disponible sur navigateur Web.");
                return;
            }

            const filePath = `${FileSystem.cacheDirectory}${fileName}`;
            await FileSystem.writeAsStringAsync(filePath, encrypted, { encoding: 'utf8' });

            await Sharing.shareAsync(filePath, {
                mimeType: 'application/json',
                dialogTitle: 'Exporter ma sauvegarde',
                UTI: 'public.json'
            });
        } catch (e) {
            console.error(e);
            Alert.alert("Erreur de sauvegarde", e.message || "Impossible d'exporter les données.");
        }
    };


    const importData = async () => {
        try {
            const res = await DocumentPicker.getDocumentAsync({ type: '*/*' });
            if (!res.canceled && res.assets && res.assets.length > 0) {
                const fileContent = await FileSystem.readAsStringAsync(res.assets[0].uri);

                let data;
                try {
                    const decoded = base64Decode(fileContent);
                    data = JSON.parse(decoded);
                } catch (e) {
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
                                try {
                                    await AsyncStorage.setItem('reminderConfig', JSON.stringify(config));
                                    setReminderConfig(config);
                                    await scheduleNotification(config);

                                    Alert.alert("Succès", "Les rappels ont été sauvegardés et programmés !");
                                } catch (error) {
                                    console.error('Erreur lors de la sauvegarde des rappels:', error);
                                    Alert.alert("Erreur", "Impossible de sauvegarder les rappels. Veuillez réessayer.");
                                }
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
    settingsOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    settingsBox: { width: '100%', height: '85%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, position: 'absolute', bottom: 0 },
    settingsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    settingsTitle: { fontSize: 20, fontWeight: 'bold' },
    profileEdit: { alignItems: 'center', marginBottom: 30 },
    profileImg: { width: 100, height: 100, borderRadius: 50 },
    profileImgPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.jwBlue, justifyContent: 'center', alignItems: 'center' },
    inputGroupJW: { marginBottom: 20 },
    inputLabel: { fontSize: 14, marginBottom: 8, opacity: 0.6 },
    jInput: { height: 50, borderBottomWidth: 1, fontSize: 16 },
    onboardingBtn: { width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    settingRowJW: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20, borderTopWidth: 0.5, borderTopColor: '#f0f0f0' },
    settingItemAction: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15 },
    settingDivider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 15 },
    sectionTitleJW: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
});
