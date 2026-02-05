import React, { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { BookOpen, CheckSquare, ExternalLink, FileText } from 'lucide-react-native';
import { COLORS } from '../constants/theme';
import { AppContext } from '../context/AppContext';

export default function AboutScreen() {
    const { theme } = useContext(AppContext);
    return (
        <ScrollView style={[styles.screen, { backgroundColor: theme.bg }]}>
            <View style={[styles.jwCard, { backgroundColor: theme.card }]}>
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                    <View style={styles.logoCircle}><BookOpen size={40} color="#fff" /></View>
                    <Text style={[styles.jwGreeting, { color: COLORS.jwBlue, textAlign: 'center' }]}>Ma Lecture de la Bible</Text>
                    <Text style={{ color: '#888', fontSize: 12 }}>Version 1.2.0</Text>
                </View>

                <Text style={[styles.sectionTitleJW, { color: theme.text }]}>Utilité de l'application</Text>
                <Text style={[styles.aboutText, { color: theme.text }]}>
                    Cette application est conçue pour aider chaque chrétien à maintenir un rythme de lecture biblique quotidien.
                    En suivant ce plan de 368 sections, vous pouvez lire l'intégralité de la Parole de Dieu en une année.
                </Text>

                <Text style={[styles.sectionTitleJW, { color: theme.text, marginTop: 20 }]}>Comment l'utiliser ?</Text>
                <View style={styles.guideStep}>
                    <CheckSquare size={18} color={COLORS.jwBlue} />
                    <Text style={[styles.guideText, { color: theme.text }]}>Cochez chaque section après lecture pour suivre votre progression.</Text>
                </View>
                <View style={styles.guideStep}>
                    <ExternalLink size={18} color={COLORS.jwBlue} />
                    <Text style={[styles.guideText, { color: theme.text }]}>Utilisez le lien JW.ORG pour ouvrir directement les chapitres dans la Traduction du monde nouveau.</Text>
                </View>
                <View style={styles.guideStep}>
                    <FileText size={18} color={COLORS.jwBlue} />
                    <Text style={[styles.guideText, { color: theme.text }]}>Prenez des notes et organisez-les avec des étiquettes (tags).</Text>
                </View>

                <View style={styles.dividerJW} />

                <Text style={[styles.quoteTextJW, { marginTop: 10, color: theme.text }]}>
                    "Ta parole est une lampe pour mon pied, et une lumière pour mon sentier."
                </Text>
                <Text style={[styles.quoteRefJW, { textAlign: 'center' }]}>— Psaume 119:105</Text>

                <View style={styles.creatorInfo}>
                    <Text style={{ color: '#888', fontSize: 12 }}>Développé par</Text>
                    <Text style={[styles.creatorName, { color: theme.text }]}>votre frère</Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, padding: 15 },
    jwCard: { padding: 25, borderRadius: 20, marginBottom: 15, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
    logoCircle: { backgroundColor: COLORS.jwBlue, borderRadius: 50, padding: 20, marginBottom: 20 },
    jwGreeting: { fontSize: 24, fontWeight: 'bold' },
    sectionTitleJW: { fontSize: 16, fontWeight: 'bold', marginBottom: 15 },
    aboutText: { fontSize: 15, lineHeight: 22, marginBottom: 15 },
    guideStep: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 15 },
    guideText: { fontSize: 14, flex: 1 },
    dividerJW: { height: 1, backgroundColor: '#eee', marginVertical: 20 },
    quoteTextJW: { fontSize: 16, fontStyle: 'italic', textAlign: 'center', lineHeight: 24 },
    quoteRefJW: { color: COLORS.jwBlue, fontWeight: 'bold' },
    creatorInfo: { alignItems: 'center', marginTop: 30 },
    creatorName: { fontWeight: 'bold', fontSize: 16 },
});
