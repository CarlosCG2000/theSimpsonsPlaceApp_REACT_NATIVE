import { NativeModules } from 'react-native';

const { ReminderNotificationManager } = NativeModules;

export async function scheduleReminderNotification(
    title: string,
    body: string,
    delayInSeconds: number
) {
    try {
        console.log('Notificacion programada');
        const result = await ReminderNotificationManager.scheduleNotification(
            title,
            body,
            delayInSeconds
        );
        console.log('Resultado: ' + result);
    } catch (error) {
        console.error('Error al programar la notificación:', error);
    }
}
