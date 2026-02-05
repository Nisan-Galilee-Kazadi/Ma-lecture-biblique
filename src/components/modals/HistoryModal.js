import React, { useContext } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { X, CheckSquare, ExternalLink, History as HistoryIcon } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { AppContext } from '../../context/AppContext';
import { Linking } from 'react-native';
import { BIBLE_BOOKS_MAP } from '../../constants/bibleData';

export default function HistoryModal({ visible, onClose }) {
    const { history, theme } = useContext(AppContext);

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

        const url = `https://www.jw.org/finder?wtlocale=F&pub=nwt&bible=${bStr}${sStr}001-${bStr}${eStr}999&prefer=lang`;
        Linking.openURL(url);
    };

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

const styles = StyleSheet.create({
    settingsOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    settingsBox: { width: '100%', height: '85%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, position: 'absolute', bottom: 0 },
    settingsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    settingsTitle: { fontSize: 20, fontWeight: 'bold' },
    historyItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 0.5 },
    historyIconBox: { width: 40 },
    historyBook: { fontSize: 16, fontWeight: '500' },
    historyDate: { fontSize: 12, color: '#888', marginTop: 3 },
});
