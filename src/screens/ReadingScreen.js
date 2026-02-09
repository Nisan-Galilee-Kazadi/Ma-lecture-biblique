import React, { useContext, useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { View, Text, SectionList, TouchableOpacity, StyleSheet, Animated, ActivityIndicator } from 'react-native';
import { CheckSquare, Square, ExternalLink, Calendar, FileText, LayoutGrid, ArrowUp } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppContext } from '../context/AppContext';
import { COLORS } from '../constants/theme';
import { readingPlan, BIBLE_BOOKS_MAP } from '../constants/bibleData';
import { openJWLink } from '../utils/jwLinks';
import { LegendModal } from '../components/modals/LegendModal';
import { BookGridModal } from '../components/modals/BookGridModal';

export default function ReadingScreen() {
    const { progress, setProgress, history, setHistory, theme, openNoteEditor, isAppLoading } = useContext(AppContext);
    const [legendVisible, setLegendVisible] = useState(false);
    const [bookModalVisible, setBookModalVisible] = useState(false);
    const [legendInfo, setLegendInfo] = useState({ type: '', message: '' });
    const listRef = useRef(null);

    // Scroller vers la progression actuelle
    useEffect(() => {
        if (!isAppLoading && listRef.current) {
            let targetSection = 0;
            let targetItem = 0;
            let found = false;

            for (let s = 0; s < sections.length; s++) {
                for (let i = 0; i < sections[s].data.length; i++) {
                    const item = sections[s].data[i];
                    if (!progress[`${item.bookName}-${item.ch}`]) {
                        targetSection = s;
                        targetItem = i;
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }

            setTimeout(() => {
                listRef.current?.scrollToLocation({
                    sectionIndex: targetSection,
                    itemIndex: targetItem,
                    animated: true,
                    viewPosition: 0
                });
            }, 600);
        }
    }, [isAppLoading]);

    const sections = Object.entries(readingPlan).map(([title, data]) => ({
        title,
        data: data.flatMap(book => book.sections.map(s => ({ ...s, bookName: book.book })))
    }));

    const handleScrollToBook = (bookName) => {
        setBookModalVisible(false);

        const bookMapping = {
            'ABDIAS': 'ABDIAS/JONAS',
            'JONAS': 'ABDIAS/JONAS',
            'NAHUM': 'NAHUM/HABACUC',
            'HABACUC': 'NAHUM/HABACUC',
            'SOPHONIE': 'SOPHONIE/AGGÉE',
            'AGGÉE': 'SOPHONIE/AGGÉE'
        };

        const searchName = bookMapping[bookName] || bookName;
        let sectionIndex = -1;
        let itemIndex = -1;

        for (let i = 0; i < sections.length; i++) {
            const sectionData = sections[i].data;
            // Correct findIndex logic: We are looking for the FIRST item that matches the book.
            const index = sectionData.findIndex(item => {
                return item.bookName === searchName ||
                    item.bookName === bookName ||
                    (item.bookName.includes('/') && item.bookName.includes(bookName));
            });

            if (index !== -1) {
                sectionIndex = i;
                itemIndex = index;
                break;
            }
        }

        if (sectionIndex !== -1 && listRef.current) {
            setTimeout(() => {
                try {
                    listRef.current.scrollToLocation({
                        sectionIndex,
                        itemIndex,
                        animated: true,
                        viewPosition: 0
                    });
                } catch (error) {
                    console.log('Scroll error:', error);
                    // Fallback for list inconsistency
                    listRef.current.scrollToLocation({
                        sectionIndex,
                        itemIndex: 0,
                        animated: true,
                        viewPosition: 0
                    });
                }
            }, 500); // Increased timeout slightly for safety
        }
    };


    const showLegend = (type) => {
        const message = type === 'o'
            ? "Les chapitres marqués d’un losange ORANGE donnent un aperçu historique des manières d’agir de Dieu avec les Israélites."
            : "Les chapitres marqués d’un rond BLEU donnent un aperçu chronologique du développement de l’assemblée chrétienne.";
        setLegendInfo({ type, message });
        setLegendVisible(true);
    };

    const toggleCheck = useCallback(async (book, sectionObj) => {
        try {
            const section = sectionObj.ch;
            const id = `${book}-${section}`;
            const newState = !progress[id];

            const newProgress = { ...progress, [id]: newState };
            setProgress(newProgress);

            if (newState) {
                const entry = { id, book, section, date: new Date().toLocaleDateString('fr-FR') };
                const newHistory = [entry, ...history];
                setHistory(newHistory);

                // Sauvegarde asynchrone sans bloquer l'UI
                Promise.all([
                    AsyncStorage.setItem('bibleProgress', JSON.stringify(newProgress)),
                    AsyncStorage.setItem('bibleHistory', JSON.stringify(newHistory))
                ]).catch(err => console.error('Erreur sauvegarde:', err));
            } else {
                const newHistory = history.filter(h => h.id !== id);
                setHistory(newHistory);

                Promise.all([
                    AsyncStorage.setItem('bibleProgress', JSON.stringify(newProgress)),
                    AsyncStorage.setItem('bibleHistory', JSON.stringify(newHistory))
                ]).catch(err => console.error('Erreur sauvegarde:', err));
            }
        } catch (error) {
            console.error('Erreur toggleCheck:', error);
        }
    }, [progress, history, setProgress, setHistory]);

    const renderSectionItem = ({ item }) => {
        const bookName = item.bookName;
        const section = item.ch;
        const id = `${bookName}-${section}`;
        const isDone = progress[id];
        const historyEntry = history.find(h => h.id === id);
        const completionDate = historyEntry ? historyEntry.date : null;

        return (
            <View
                nativeID={id}
                style={[styles.sectionRowJW, { borderBottomColor: theme.border, flexDirection: 'column', alignItems: 'flex-start', paddingVertical: 15, paddingHorizontal: 15, backgroundColor: theme.card, marginBottom: 1, borderRadius: 5 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => toggleCheck(bookName, item)}
                            style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}
                        >
                            {isDone ? <CheckSquare size={24} color={COLORS.primary} /> : <Square size={24} color="#ccc" />}
                            <View style={{ width: 12 }} />
                        </TouchableOpacity>

                        {item.m && (
                            <TouchableOpacity onPress={() => showLegend(item.m)} style={{ paddingVertical: 5, paddingRight: 10 }}>
                                {item.m === 'o' ? (
                                    <Text style={{ color: COLORS.prophetic, fontSize: 18, marginTop: -2 }}>♦</Text>
                                ) : (
                                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.christian }} />
                                )}
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            onPress={() => toggleCheck(bookName, item)}
                            style={{ flex: 1 }}
                        >
                            <Text style={[styles.sectionTxtJW, { color: theme.text, fontWeight: isDone ? 'bold' : 'normal', fontSize: 16 }]}>
                                {bookName} {section}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        onPress={() => openJWLink(bookName, section)}
                        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.accent, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}
                    >
                        <Text style={{ fontSize: 11, color: COLORS.primary, fontWeight: 'bold', marginRight: 5 }}>JW.ORG</Text>
                        <ExternalLink size={14} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, width: '100%', paddingLeft: 40 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                        {isDone && completionDate && (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Calendar size={12} color="#888" style={{ marginRight: 5 }} />
                                <Text style={{ fontSize: 11, color: '#888' }}>{completionDate}</Text>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity
                        onPress={() => openNoteEditor({ id: '', text: `Note sur ${bookName} ${section} : `, tags: [] })}
                        style={{ flexDirection: 'row', alignItems: 'center', borderColor: COLORS.primary, borderWidth: 0.8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 }}
                    >
                        <FileText size={16} color={COLORS.primary} />
                        <Text style={{ fontSize: 12, color: COLORS.primary, marginLeft: 6, fontWeight: 'bold' }}>Noter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.bg }}>
            {isAppLoading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.bg }}>
                    <ActivityIndicator size="large" color={COLORS.jwBlue} />
                    <Text style={{ color: theme.text, marginTop: 15, fontSize: 16 }}>Chargement du plan...</Text>
                </View>
            ) : (
                <>
                    <SectionList
                        ref={listRef}
                        sections={sections}
                        keyExtractor={(item, index) => item.bookName + item.ch + index}
                        renderItem={renderSectionItem}
                        renderSectionHeader={({ section: { title } }) => (
                            <View style={{ backgroundColor: theme.bg, paddingVertical: 15, paddingHorizontal: 15 }}>
                                <Text style={styles.catTitle}>{title}</Text>
                            </View>
                        )}
                        stickySectionHeadersEnabled={false}
                        initialNumToRender={15}
                        maxToRenderPerBatch={10}
                        windowSize={5}
                        removeClippedSubviews={true}
                        getItemLayout={(data, index) => ({
                            length: 120, // Hauteur approximative d'un item
                            offset: 120 * index,
                            index,
                        })}
                        contentContainerStyle={{ paddingBottom: 100 }}
                    />

                    {/* Grid Menu FAB */}
                    <TouchableOpacity
                        style={[styles.fab, { bottom: 20 }]}
                        onPress={() => setBookModalVisible(true)}
                    >
                        <LayoutGrid size={24} color="#fff" />
                    </TouchableOpacity>
                </>
            )}

            <LegendModal
                visible={legendVisible}
                info={legendInfo}
                onClose={() => setLegendVisible(false)}
                theme={theme}
            />
            <BookGridModal
                visible={bookModalVisible}
                onClose={() => setBookModalVisible(false)}
                onSelectBook={handleScrollToBook}
                theme={theme}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    catTitle: { fontSize: 14, fontWeight: 'bold', color: COLORS.jwBlue, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
    sectionRowJW: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 0.5, borderBottomColor: '#f7f7f7' },
    sectionTxtJW: { fontSize: 16 },
    fab: { position: 'absolute', right: 20, backgroundColor: COLORS.jwBlue, width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
});
