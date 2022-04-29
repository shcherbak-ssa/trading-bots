import { NOTIFICATION_LIFE_TIME, StoreMutation } from 'shared/constants';
import { store } from 'app/store';


export class Notifications {
  static showSuccessNotification(title: string, message: string): void {
    Notifications.showNotification('success', title, message);
  }

  static showErrorNotification(title: string, message: string): void {
    Notifications.showNotification('error', title, message);
  }


  private static showNotification(type: 'error' | 'info' | 'success', title: string, message: string): void {
    store.commit({
      type: StoreMutation.APP_SHOW_NOTIFICATION,
      severity: type,
      summary: title,
      detail: message,
      life: NOTIFICATION_LIFE_TIME,
      group: 'notification',
    });
  }
}
