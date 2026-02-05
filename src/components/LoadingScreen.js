import React, { useState, useEffect } from 'react';
import { View, Text, Image, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function LoadingScreen() {
    const [progress] = useState(new Animated.Value(0));
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.parallel([
            Animated.timing(progress, {
                toValue: 1,
                duration: 2500,
                useNativeDriver: false,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const width = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={{ flex: 1, backgroundColor: '#f4f4f4', justifyContent: 'center', alignItems: 'center' }}>
            <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
                <Image source={require('../../assets/icon.png')} style={{ width: 120, height: 120, borderRadius: 30 }} />
                <Text style={{ marginTop: 20, fontSize: 22, color: COLORS.jwBlue, fontWeight: 'bold', letterSpacing: 1 }}>
                    Ma Lecture de la Bible
                </Text>
            </Animated.View>
            <View style={{ width: '70%', height: 6, backgroundColor: '#ddd', borderRadius: 3, marginTop: 40, overflow: 'hidden' }}>
                <Animated.View style={{ height: '100%', backgroundColor: COLORS.jwBlue, width }} />
            </View>
            <Text style={{ marginTop: 15, fontSize: 12, color: '#999' }}>Initialisation de votre plan...</Text>
        </View>
    );
}
