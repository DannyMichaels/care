import { useState, useEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import { Text, List, Button, ActivityIndicator, Divider } from 'react-native-paper';
import { getAllBlocks, unblockUser } from '@care/shared';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function BlockedUsersScreen() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const data = await getAllBlocks();
        setBlocks(data);
      } catch {} finally {
        setLoading(false);
      }
    };
    fetchBlocks();
  }, []);

  const handleUnblock = async (userId) => {
    await unblockUser(userId);
    setBlocks((prev) => prev.filter((b) => b.blocked?.id !== userId));
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <ScreenWrapper>
      <Text variant="headlineSmall" style={styles.title}>Blocked Users</Text>
      {blocks.length === 0 ? (
        <Text style={styles.empty}>No blocked users</Text>
      ) : (
        <FlatList
          data={blocks}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={Divider}
          renderItem={({ item }) => (
            <List.Item
              title={item.blocked?.name}
              right={() => (
                <Button
                  mode="outlined"
                  compact
                  onPress={() => handleUnblock(item.blocked?.id)}>
                  Unblock
                </Button>
              )}
            />
          )}
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: { padding: 24, paddingBottom: 8 },
  empty: { padding: 24, opacity: 0.6 },
});
