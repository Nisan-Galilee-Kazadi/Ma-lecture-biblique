import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { X } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';
import { BIBLE_BOOKS_MAP, BOOK_ABBREVIATIONS } from '../../constants/bibleData';

export const BookGridModal = ({ visible, onClose, onSelectBook, theme }) => {
    const hebrewBooks = Object.keys(BIBLE_BOOKS_MAP).slice(0, 39);
    const greekBooks = Object.keys(BIBLE_BOOKS_MAP).slice(39);

    const getBookColor = (book) => {
        const index = Object.keys(BIBLE_BOOKS_MAP).indexOf(book) + 1;
        // Pentateuque (1-5) : Foncé
        if (index <= 5) return COLORS.jwBlue;
        // Historiques (6-17) : Clair
        if (index >= 6 && index <= 17) return COLORS.christian;
        // Poétiques & Prophétiques (18-39) : Foncé
        if (index >= 18 && index <= 39) return COLORS.jwBlue;
        // Évangiles (40-43) : Foncé
        if (index >= 40 && index <= 43) return COLORS.jwBlue;
        // Actes (44) : Clair
        if (index === 44) return COLORS.christian;
        // Lettres (45-65) : Clair
        if (index >= 45 && index <= 65) return COLORS.christian;
        // Révélation (66) : Foncé
        return COLORS.jwBlue;
    };

    const renderGrid = (books) => (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: 6 }}>
            {books.map((book) => (
                <TouchableOpacity
                    key={book}
                    style={{
                        width: '18%',
                        aspectRatio: 1,
                        backgroundColor: getBookColor(book),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 2,
                        borderWidth: 1,
                        borderColor: '#fff',
                    }}
                    onPress={() => onSelectBook(book)}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 13 }}>
                        {BOOK_ABBREVIATIONS[book] || book.substring(0, 2)}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={[styles.settingsBox, { backgroundColor: theme.card, height: '90%', padding: 0 }]}>
                    <View style={[styles.settingsHeader, { padding: 20, paddingBottom: 10 }]}>
                        <Text style={[styles.settingsTitle, { color: theme.text }]}>Navigation Rapide</Text>
                        <TouchableOpacity onPress={onClose}><X size={24} color={theme.text} /></TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={{ padding: 15, paddingBottom: 40 }}>
                        <Text style={{ color: theme.text, fontWeight: 'bold', marginBottom: 10, marginTop: 5 }}>ÉCRITURES HÉBRAÏQUES ET ARAMÉENNES</Text>
                        {renderGrid(hebrewBooks)}

                        <Text style={{ color: theme.text, fontWeight: 'bold', marginBottom: 10, marginTop: 25 }}>ÉCRITURES GRECQUES CHRÉTIENNES</Text>
                        {renderGrid(greekBooks)}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
    settingsBox: { width: '100%', height: '85%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25, position: 'absolute', bottom: 0 },
    settingsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    settingsTitle: { fontSize: 20, fontWeight: 'bold' },
});
