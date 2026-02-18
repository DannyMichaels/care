import { useState, useEffect, useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Card, Text, Avatar, Searchbar, ActivityIndicator } from 'react-native-paper';
import { getAllUsers, toTitleCase } from '@care/shared';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function CommunityScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getAllUsers();
      setUsers(data || []);
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchUsers);
    return () => {
        unsubscribe();
    }
  }, [navigation, fetchUsers]);

  const filteredUsers = users.filter((u) =>
    u.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <ScreenWrapper>
      <Text variant="headlineMedium" style={styles.title}>Community</Text>
      <Searchbar
        placeholder="Search users"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => navigation.navigate('UserDetail', { id: item.id })}>
            <Card.Title
              title={toTitleCase(item.name)}
              subtitle={`${item.insights_count ?? item.insights?.length ?? 0} insights`}
              left={(props) =>
                item.image ? (
                  <Avatar.Image {...props} source={{ uri: item.image }} />
                ) : (
                  <Avatar.Text {...props} label={item.name?.[0]?.toUpperCase()} />
                )
              }
            />
          </Card>
        )}
        contentContainerStyle={styles.list}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: { padding: 16 },
  search: { marginHorizontal: 12, marginBottom: 8 },
  list: { padding: 12 },
  card: { marginBottom: 8 },
});
