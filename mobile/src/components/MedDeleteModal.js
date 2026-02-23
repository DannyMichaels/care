import { View, StyleSheet } from 'react-native';
import { Button, Text, Portal, Dialog, useTheme } from 'react-native-paper';

export default function MedDeleteModal({
  visible,
  onDismiss,
  name,
  scheduled,
  onSkipDay,
  onStopMed,
  onDeleteMed,
}) {
  if (!scheduled) {
    return (
      <Portal>
        <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
          <Dialog.Content>
            <Text variant="titleMedium">
              Are you sure you want to delete {name}?
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.row}>
            <Button mode="outlined" onPress={onDismiss} style={styles.rowButton}>
              Cancel
            </Button>
            <Button mode="contained" buttonColor="#F44336" textColor="#fff" onPress={onDeleteMed} style={styles.rowButton}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  }

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Content>
          <Text variant="titleMedium" style={styles.title}>
            What would you like to do with {name}?
          </Text>
          <Button
            mode="contained"
            buttonColor="#9E9E9E"
            textColor="#fff"
            onPress={onSkipDay}
            style={styles.button}
          >
            Skip this day
          </Button>
          <Button
            mode="contained"
            buttonColor="#FF9800"
            textColor="#fff"
            onPress={onStopMed}
            style={styles.button}
          >
            Stop after today
          </Button>
          <Text variant="bodySmall" style={styles.hint}>
            Still shows today, stops appearing tomorrow. History preserved.
          </Text>
          <Button
            mode="contained"
            buttonColor="#F44336"
            textColor="#fff"
            onPress={onDeleteMed}
            style={styles.button}
          >
            Delete medication
          </Button>
          <Button mode="outlined" onPress={onDismiss} style={styles.button}>
            Cancel
          </Button>
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 12,
  },
  title: {
    marginBottom: 16,
  },
  button: {
    marginBottom: 8,
  },
  hint: {
    color: '#999',
    textAlign: 'center',
    marginTop: -4,
    marginBottom: 8,
  },
  row: {
    justifyContent: 'space-evenly',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  rowButton: {
    flex: 1,
  },
});
