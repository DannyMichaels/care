import { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar, Card, Paragraph, ActivityIndicator, Divider } from 'react-native-paper';
import { getOneUser, toTitleCase, getAge } from '@care/shared';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function UserDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getOneUser(id);
        setUser(data);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (!user) return <Text style={{ padding: 24 }}>User not found</Text>;

  return (
    <ScreenWrapper scroll contentContainerStyle={styles.container}>
      <View style={styles.header}>
        {user.image ? (
          <Avatar.Image size={80} source={{ uri: user.image }} />
        ) : (
          <Avatar.Text size={80} label={user.name?.[0]?.toUpperCase()} />
        )}
        <Text variant="headlineMedium" style={styles.name}>{toTitleCase(user.name)}</Text>
        {user.birthday && (
          <Text variant="bodyMedium" style={styles.meta}>Age: {getAge(user.birthday)}</Text>
        )}
      </View>

      <Divider style={styles.divider} />

      <Text variant="titleMedium" style={styles.sectionTitle}>
        {user.insights?.length || 0} Insight{user.insights?.length !== 1 ? 's' : ''}
      </Text>
      {user.insights?.map((insight) => (
        <Card
          key={insight.id}
          style={styles.card}
          onPress={() => navigation.navigate('InsightDetail', { id: insight.id })}
        >
          <Card.Title title={insight.title} />
          <Card.Content>
            <Paragraph numberOfLines={2}>{insight.description}</Paragraph>
          </Card.Content>
        </Card>
      ))}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  header: { alignItems: 'center', marginBottom: 16 },
  name: { marginTop: 12 },
  meta: { opacity: 0.6, marginTop: 4 },
  divider: { marginVertical: 16 },
  sectionTitle: { marginBottom: 8 },
  card: { marginBottom: 8 },
});
