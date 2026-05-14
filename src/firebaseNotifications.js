
import { PushNotifications } from '@capacitor/push-notifications';

export const setupNotifications = async () => {

  let permStatus = await PushNotifications.requestPermissions();

  if (permStatus.receive === 'granted') {
    await PushNotifications.register();
  }

  PushNotifications.addListener('registration', token => {
    console.log('FCM TOKEN:', token.value);
  });

  PushNotifications.addListener('registrationError', err => {
    console.log('Registration error:', err);
  });

  PushNotifications.addListener('pushNotificationReceived', notification => {
    console.log('Push received:', notification);
  });

  PushNotifications.addListener('pushNotificationActionPerformed', notification => {
    console.log('Notification action:', notification);
  });

};
