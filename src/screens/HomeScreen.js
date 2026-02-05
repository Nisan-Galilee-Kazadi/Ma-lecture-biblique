import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Linking } from 'react-native';
import { Flame, BookOpen, User, ExternalLink, FileText } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { BIBLE_QUOTES, totalSections } from '../constants/bibleData';
import { AppContext } from '../context/AppContext';

export default function HomeScreen() {
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

const styles = StyleSheet.create({
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
    quoteCardJW: { padding: 25, borderRadius: 20, alignItems: 'center', gap: 12, marginBottom: 15 },
    quoteTextJW: { fontSize: 16, fontStyle: 'italic', textAlign: 'center', lineHeight: 24 },
    quoteRefJW: { color: COLORS.jwBlue, fontWeight: 'bold' },
    catTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.jwBlue, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
    noteItem: { padding: 20, borderRadius: 15, marginBottom: 15, elevation: 1 },
    noteText: { fontSize: 15, lineHeight: 22 },
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
});
