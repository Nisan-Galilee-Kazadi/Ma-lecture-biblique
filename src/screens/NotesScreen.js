import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, FlatList, StyleSheet, Alert } from 'react-native';
import { Search, Trash2, Tag as TagIcon, Plus } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/theme';
import { AppContext } from '../context/AppContext';

export default function NotesScreen() {
    const { notes, setNotes, theme, openNoteEditor } = useContext(AppContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSearchTag, setActiveSearchTag] = useState(null);

    // Extraire tous les tags uniques existants
    const allExistingTags = Array.from(new Set(notes.flatMap(n => n.tags)));

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

const styles = StyleSheet.create({
    searchBarContainer: { padding: 15, paddingBottom: 5 },
    searchWrapper: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 45, borderRadius: 12, elevation: 1 },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
    tagFiltersScroll: { paddingVertical: 10 },
    filterTag: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', marginRight: 10, borderWidth: 1, borderColor: '#eee' },
    filterTagActive: { backgroundColor: COLORS.jwBlue, borderColor: COLORS.jwBlue },
    filterTagText: { fontSize: 13, color: '#666' },
    noteItem: { padding: 20, borderRadius: 15, marginBottom: 15, elevation: 1 },
    noteHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    noteDate: { fontSize: 12 },
    noteText: { fontSize: 15, lineHeight: 22 },
    tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
    tagBadge: { backgroundColor: COLORS.jwBlue, paddingVertical: 3, paddingHorizontal: 8, borderRadius: 5, flexDirection: 'row', alignItems: 'center' },
    tagText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
    fab: { position: 'absolute', right: 20, bottom: 20, backgroundColor: COLORS.jwBlue, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
});
