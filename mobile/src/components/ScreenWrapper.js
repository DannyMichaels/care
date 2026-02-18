import { StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ScreenWrapper({ children, scroll, keyboardAvoiding, style, contentContainerStyle }) {
  let content = children;

  if (scroll) {
    content = (
      <ScrollView
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    );
  }

  if (keyboardAvoiding) {
    content = (
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  return (
    <SafeAreaView style={[styles.flex, style]} edges={['top']}>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
