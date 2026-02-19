import { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Card, Text, FAB, Paragraph, IconButton, useTheme, ActivityIndicator } from 'react-native-paper';
import { getAllInsights, postLike, destroyLike } from '@care/shared';
import { useCurrentUser } from '../../context/CurrentUserContext';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function InsightsListScreen({ navigation }) {
  const [{ currentUser }] = useCurrentUser();
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const handleLike = async (item) => {
    const existing = item.likes?.find((l) => l.user_id === currentUser?.id);
    try {
      if (existing) {
        await destroyLike(existing.id);
      } else {
        await postLike({ insight_id: item.id });
      }
      fetchInsights();
    } catch {}
  };

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
            <Card.Actions>
              <View style={styles.likeRow}>
                <IconButton
                  icon={item.likes?.some((l) => l.user_id === currentUser?.id) ? 'heart' : 'heart-outline'}
                  iconColor={item.likes?.some((l) => l.user_id === currentUser?.id) ? '#E91E63' : undefined}
                  size={20}
                  onPress={() => handleLike(item)}
                />
                <Text variant="bodySmall">{item.likes?.length || 0}</Text>
              </View>
              <View style={styles.likeRow}>
                <IconButton icon="comment-outline" size={20} onPress={() => navigation.navigate('InsightDetail', { id: item.id })} />
                <Text variant="bodySmall">{item.comments?.length || 0}</Text>
              </View>
            </Card.Actions>
          </Card>
        )}
        contentContainerStyle={styles.list}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        color="#fff"
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
  likeRow: { flexDirection: 'row', alignItems: 'center' },
  fab: { position: 'absolute', right: 16, bottom: 16, backgroundColor: '#1E88E5' },
});
