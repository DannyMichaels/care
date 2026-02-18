import { useState, useEffect, useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Card, Text, FAB, Paragraph, useTheme, ActivityIndicator } from 'react-native-paper';
import { getAllInsights } from '@care/shared';
import { useCurrentUser } from '../../context/CurrentUserContext';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function InsightsListScreen({ navigation }) {
  const [{ currentUser }] = useCurrentUser();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const fetchInsights = useCallback(async () => {
    try {
      const data = await getAllInsights();
      setInsights(data || []);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchInsights);
    return () => {
        unsubscribe();
    }
  }, [navigation, fetchInsights]);

  if (loading) {
    return <ActivityIndicator style={styles.loader} />;
  }

  return (
    <ScreenWrapper>
      <Text variant="headlineMedium" style={styles.title}>Insights</Text>
      <FlatList
        data={insights}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => navigation.navigate('InsightDetail', { id: item.id })}>
            <Card.Title title={item.title} subtitle={`by ${item.user?.name || 'Unknown'}`} />
            <Card.Content>
              <Paragraph numberOfLines={2}>{item.description}</Paragraph>
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={styles.list}
      />
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('InsightCreate')}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1 },
  title: { padding: 16 },
  list: { padding: 12 },
  card: { marginBottom: 12 },
  fab: { position: 'absolute', right: 16, bottom: 16 },
});
