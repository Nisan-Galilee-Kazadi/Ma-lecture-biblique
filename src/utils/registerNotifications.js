import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Demande les permissions de notification et retourne le token
 * @returns {Promise<string|null>} Le token de notification ou null en cas d'échec
 */
export async function registerForPushNotificationsAsync() {
    let token = null;

    try {

        // Vérifier si les notifications sont disponibles
        if (!Notifications.isDevicePushTokenAvailable && Platform.OS === 'ios') {
            console.log('⚠️ Push tokens non disponibles sur cet appareil iOS');
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') return null;

        // Obtenir le token (pour les notifications push externes si besoin)
        try {
            token = (await Notifications.getExpoPushTokenAsync()).data;
        } catch (tokenError) {
            console.warn('⚠️ Impossible d\'obtenir le token push:', tokenError.message);
            // Continuer sans token pour les notifications locales
        }

        // Configuration Android spécifique pour les canaux de notification
        if (Platform.OS === 'android') {
            console.log('🤖 Configuration des canaux Android...');

            // Canal par défaut
            await Notifications.setNotificationChannelAsync('default', {
                name: 'Rappels de Lecture',
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#4a6da7',
                sound: 'default',
            });
            console.log('✅ Canal "default" configuré');

            // Canal daily-reading (utilisé dans l'app)
            await Notifications.setNotificationChannelAsync('daily-reading', {
                name: 'Rappels de lecture quotidienne',
                description: 'Rappels pour votre lecture biblique quotidienne',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#4a6da7',
                sound: 'default',
                enableLights: true,
                enableVibrate: true,
            });
            console.log('✅ Canal "daily-reading" configuré');
        }

        // Lister les notifications déjà programmées (seulement sur mobile)
        if (Platform.OS !== 'web') {
            try {
                const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
                console.log('📅 Notifications déjà programmées:', scheduledNotifications.length);
            } catch (error) {
                console.log('ℹ️ Impossible de lister les notifications sur cette plateforme');
            }
        } else {
            console.log('🌐 Mode web: listing des notifications non disponible');
        }

        return token;
    } catch (error) {
        console.error('💥 Erreur lors de l\'enregistrement des notifications:', error);
        return null;
    }
}
