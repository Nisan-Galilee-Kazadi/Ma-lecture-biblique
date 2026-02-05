import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Animated, StyleSheet } from 'react-native';
import { BookOpen, Home, CheckSquare, FileText, ExternalLink, Save, Settings as SettingsIcon, User } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

export default function OnboardingScreen({ onComplete }) {
    const [step, setStep] = useState(0);
    const [name, setName] = useState('');
    const [slideAnim] = useState(new Animated.Value(50));
    const [opacityAnim] = useState(new Animated.Value(0));

    const steps = [
        {
            title: "Bienvenue !",
            desc: "Prêt à transformer votre lecture de la Bible en une habitude quotidienne ?",
            icon: <BookOpen size={60} color="#fff" />,
            color: COLORS.jwBlue
        },
        {
            title: "Tableau de Bord",
            desc: "Suivez votre progression annuelle globale et découvrez une pensée biblique chaque jour.",
            icon: <Home size={60} color="#fff" />,
            color: COLORS.primary
        },
        {
            title: "Plan de Lecture",
            desc: "368 sections pour lire toute la Bible. Cochez-les au fur et à mesure pour rester motivé.",
            icon: <CheckSquare size={60} color="#fff" />,
            color: '#2e7d32'
        },
        {
            title: "Notes Personnelles",
            desc: "Notez vos méditations et organisez-les avec des tags pour les retrouver facilement.",
            icon: <FileText size={60} color="#fff" />,
            color: '#ed6c02'
        },
        {
            title: "Accès JW.ORG",
            desc: "Chaque section contient un lien direct vers la Bibliothèque en ligne (WOL) pour approfondir.",
            icon: <ExternalLink size={60} color="#fff" />,
            color: '#1976d2'
        },
        {
            title: "Sécurisation des Données",
            desc: "Exportez vos notes et votre progression pour ne jamais les perdre, même si vous changez de téléphone.",
            icon: <Save size={60} color="#fff" />,
            color: '#7b1fa2'
        },
        {
            title: "Personnalisation",
            desc: "Configurez des rappels et activez le Mode Sombre pour une lecture reposante le soir.",
            icon: <SettingsIcon size={60} color="#fff" />,
            color: '#455a64'
        },
        {
            title: "Finalisons ensemble",
            desc: "Comment devrions-nous vous appeler ? Votre profil peut être complété plus tard dans les paramètres.",
            icon: <User size={60} color="#fff" />,
            color: COLORS.jwBlue,
            input: true
        }
    ];

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true })
        ]).start();
    }, [step]);

    const nextStep = () => {
        if (step < steps.length - 1) {
            slideAnim.setValue(30);
            opacityAnim.setValue(0);
            setStep(step + 1);
        } else {
            if (name.length > 2) onComplete(name);
        }
    };

    const currentStep = steps[step];

    return (
        <View style={styles.onboarding}>
            <Animated.View style={[styles.onboardingContent, { transform: [{ translateY: slideAnim }], opacity: opacityAnim }]}>
                <View style={[styles.logoCircle, { backgroundColor: currentStep.color }]}>{currentStep.icon}</View>
                <Text style={[styles.onboardingTitle, { color: currentStep.color }]}>{currentStep.title}</Text>
                <Text style={[styles.onboardingDev, { textAlign: 'center', marginBottom: 25, fontSize: 15, lineHeight: 22 }]}>
                    {currentStep.desc}
                </Text>

                {currentStep.input && (
                    <TextInput
                        style={[styles.onboardingInput, { borderColor: currentStep.color }]}
                        placeholder="Votre nom..."
                        value={name}
                        onChangeText={setName}
                        autoFocus
                    />
                )}

                <View style={{ flexDirection: 'row', gap: 6, marginBottom: 30 }}>
                    {steps.map((_, i) => (
                        <View key={i} style={{ width: step === i ? 20 : 8, height: 8, borderRadius: 4, backgroundColor: i === step ? currentStep.color : '#ddd' }} />
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.onboardingBtn, { backgroundColor: (currentStep.input && name.length <= 2) ? '#ccc' : currentStep.color }]}
                    onPress={nextStep}
                    disabled={currentStep.input && name.length <= 2}
                >
                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>
                        {step === steps.length - 1 ? "C'est parti !" : "Suivant"}
                    </Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    onboarding: { flex: 1, backgroundColor: COLORS.jwBlue, justifyContent: 'center', alignItems: 'center' },
    onboardingContent: { backgroundColor: '#fff', width: '85%', padding: 40, borderRadius: 30, alignItems: 'center' },
    logoCircle: { backgroundColor: COLORS.jwBlue, borderRadius: 50, padding: 20, marginBottom: 20 },
    onboardingTitle: { fontSize: 24, fontWeight: 'bold' },
    onboardingDev: { fontSize: 12, color: '#888', marginBottom: 30 },
    onboardingInput: { width: '100%', borderBottomWidth: 1, borderColor: '#ddd', padding: 10, marginBottom: 30 },
    onboardingBtn: { width: '100%', height: 50, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
});
