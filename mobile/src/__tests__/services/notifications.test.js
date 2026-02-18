import * as Notifications from 'expo-notifications';

// Must import after mocks are set up by jest.setup.js
const { scheduleLocalMedReminder, registerForPushNotifications } = require('../../services/notifications');

jest.mock('@care/shared', () => ({
  registerPushToken: jest.fn().mockResolvedValue({}),
}));

describe('notifications service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('scheduleLocalMedReminder', () => {
    it('schedules a notification for future medication', async () => {
      const futureTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      const medication = {
        id: 1,
        name: 'Aspirin',
        time: futureTime.toISOString(),
      };

      await scheduleLocalMedReminder(medication);

      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalledWith({
        content: {
          title: 'Medication Reminder',
          body: 'Time to take Aspirin!',
          data: { medication_id: 1 },
        },
        trigger: expect.objectContaining({
          seconds: expect.any(Number),
        }),
      });
    });

    it('does not schedule for past medication time', async () => {
      const pastTime = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
      const medication = {
        id: 1,
        name: 'Aspirin',
        time: pastTime.toISOString(),
      };

      await scheduleLocalMedReminder(medication);

      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it('does not schedule without time', async () => {
      const medication = { id: 1, name: 'Aspirin' };

      await scheduleLocalMedReminder(medication);

      expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });
  });

  describe('registerForPushNotifications', () => {
    it('returns push token when permissions granted', async () => {
      const token = await registerForPushNotifications();

      expect(token).toBe('ExponentPushToken[test]');
    });

    it('returns null when permissions denied', async () => {
      Notifications.getPermissionsAsync.mockResolvedValueOnce({ status: 'denied' });
      Notifications.requestPermissionsAsync.mockResolvedValueOnce({ status: 'denied' });

      const token = await registerForPushNotifications();

      expect(token).toBeNull();
    });
  });
});
