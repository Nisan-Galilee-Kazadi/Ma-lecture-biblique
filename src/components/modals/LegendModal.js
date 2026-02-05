import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

export const LegendModal = ({ visible, info, onClose, theme }) => {
    const scaleAnim = useState(new Animated.Value(0.8))[0];
    const opacityAnim = useState(new Animated.Value(0))[0];

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(scaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
                Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true })
            ]).start();
        } else {
            scaleAnim.setValue(0.8);
            opacityAnim.setValue(0);
        }
    }, [visible]);

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <Animated.View style={[styles.legendModalBox, {
                    backgroundColor: theme.card,
                    transform: [{ scale: scaleAnim }],
                    opacity: opacityAnim,
                    elevation: 20,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.3,
                    shadowRadius: 20
                }]}>
                    <View style={{ alignItems: 'center', marginBottom: 25 }}>
                        <View style={{
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            backgroundColor: info.type === 'o' ? COLORS.prophetic + '15' : COLORS.christian + '15',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 15
                        }}>
                            {info.type === 'o' ? (
                                <Text style={{ color: COLORS.prophetic, fontSize: 50, fontWeight: 'bold' }}>♦</Text>
                            ) : (
                                <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.christian }} />
                            )}
                        </View>
                        <Text style={[styles.legendModalTitle, { color: theme.text, textAlign: 'center', fontSize: 22 }]}>
                            {info.type === 'o' ? "Aperçu Historique" : "Aperçu Chronologique"}
                        </Text>
                    </View>

                    <View style={{ backgroundColor: theme.bg, padding: 20, borderRadius: 15, marginBottom: 25 }}>
                        <Text style={[styles.legendModalBody, { color: theme.text, textAlign: 'center', lineHeight: 24, fontSize: 16 }]}>
                            {info.message}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.legendCloseBtn, { backgroundColor: COLORS.primary, height: 55, borderRadius: 18 }]}
                        onPress={onClose}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>J'ai compris</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
    legendModalBox: { width: '80%', padding: 25, borderRadius: 20 },
    legendModalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
    legendModalBody: { fontSize: 15, lineHeight: 22, opacity: 0.8 },
    legendCloseBtn: { backgroundColor: COLORS.jwBlue, padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 20 },
});
