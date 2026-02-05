import React, { useState, useContext } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { X, Trash2 } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS } from '../../constants/theme';
import { AppContext } from '../../context/AppContext';

const DAYS_FR = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export default function ReminderModal({ visible, onClose, currentConfig, onSave }) {
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

const styles = StyleSheet.create({
    settingsOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    settingsBox: { width: '100%', borderRadius: 30, padding: 25 },
    settingsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    settingsTitle: { fontSize: 20, fontWeight: 'bold' },
    onboardingBtn: { width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
});
