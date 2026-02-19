import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import Markdown from 'react-native-markdown-display';
import { PRIVACY_POLICY } from '@care/shared';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function PrivacyPolicyScreen() {
  const theme = useTheme();

  const mdStyles = StyleSheet.create({
    body: { color: theme.colors.onBackground, paddingHorizontal: 16 },
    heading1: { fontSize: 24, marginBottom: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.outline, paddingBottom: 8 },
    heading2: { fontSize: 18, marginTop: 20, marginBottom: 8 },
    heading3: { fontSize: 15, marginTop: 16, marginBottom: 6 },
    paragraph: { marginBottom: 12, lineHeight: 22 },
    list_item: { marginBottom: 4 },
    link: { color: theme.colors.primary },
    strong: { fontWeight: '600' },
  });

  return (
    <ScreenWrapper scroll contentContainerStyle={styles.scroll}>
      <Markdown style={mdStyles}>{PRIVACY_POLICY}</Markdown>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingVertical: 16 },
});
