import React, { useState, useEffect, useContext } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView, Platform, StatusBar, StyleSheet, Alert } from 'react-native';
import { X, Save, Plus } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../../constants/theme';
import { AppContext } from '../../context/AppContext';

export default function NoteEditorModal({ visible, currentNote, onClose }) {
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

    const saveNote = async () => {
        try {
            // Validation des données
            if (!noteContent.trim()) {
                return; // Ne rien faire si la note est vide
            }

            // Limiter la longueur de la note
            if (noteContent.length > 10000) {
                Alert.alert("Erreur", "La note est trop longue (maximum 10000 caractères)");
                return;
            }

            // Valider les tags
            const validTags = tags.filter(tag => tag.trim().length > 0 && tag.length < 50);

            let newNotes;
            if (currentNote.id) {
                // Mise à jour d'une note existante
                newNotes = notes.map(n => 
                    n.id === currentNote.id 
                        ? { ...currentNote, text: noteContent, tags: validTags, date: new Date().toLocaleDateString() } 
                        : n
                );
            } else {
                // Création d'une nouvelle note
                newNotes = [
                    { id: Date.now().toString(), text: noteContent, tags: validTags, date: new Date().toLocaleDateString() }, 
                    ...notes
                ];
            }

            setNotes(newNotes);
            await AsyncStorage.setItem('bibleNotes', JSON.stringify(newNotes));
            onClose();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la note:', error);
            Alert.alert("Erreur", "Impossible de sauvegarder la note. Veuillez réessayer.");
        }
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

const styles = StyleSheet.create({
    modalHeader: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15 },
    modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    modalNoteInput: { flex: 1, height: 300, padding: 20, fontSize: 18, textAlignVertical: 'top' },
    tagsSection: { padding: 20 },
    tagInputRow: { flexDirection: 'row', gap: 10, marginBottom: 15 },
    tagInput: { flex: 1, height: 45, borderRadius: 10, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    addTagBtn: { backgroundColor: COLORS.jwBlue, width: 45, height: 45, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
    tagCloud: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    tagBadgeLarge: { backgroundColor: COLORS.jwBlue, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
    tagText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
    inputLabel: { fontSize: 14, marginBottom: 8, opacity: 0.6 },
    filterTag: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', marginRight: 10, borderWidth: 1, borderColor: '#eee' },
});
