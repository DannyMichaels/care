import { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Modal } from 'react-native';
import { Text, Card, Button, TextInput, Divider, ActivityIndicator, IconButton, Portal, useTheme as usePaperTheme } from 'react-native-paper';
import { getOneInsight, destroyInsight, postComment, destroyComment, postLike, destroyLike, postReport } from '@care/shared';
import { useCurrentUser } from '../../context/CurrentUserContext';
import ScreenWrapper from '../../components/ScreenWrapper';

export default function InsightDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const [{ currentUser }] = useCurrentUser();
  const theme = usePaperTheme();
  const [insight, setInsight] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [reportVisible, setReportVisible] = useState(false);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    fetchInsight();
  }, [id]);

  const fetchInsight = async () => {
    try {
      const data = await getOneInsight(id);
      setInsight(data);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert('Delete Insight', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await destroyInsight(id);
          navigation.goBack();
        },
      },
    ]);
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    await postComment({ content: comment }, id);
    setComment('');
    fetchInsight();
  };

  const handleDeleteComment = async (commentId) => {
    await destroyComment(id, commentId);
    fetchInsight();
  };

  const handleReport = async () => {
    try {
      const report = await postReport({ insight_id: id, reason: reportReason });
      setInsight((prev) => ({ ...prev, my_report: report }));
      setReportVisible(false);
      setReportReason('');
    } catch {}
  };

  const handleLike = async () => {
    const existing = insight.likes?.find((l) => l.user_id === currentUser?.id);
    if (existing) {
      await destroyLike(existing.id);
    } else {
      await postLike({ insight_id: id });
    }
    fetchInsight();
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (!insight) return <Text style={{ padding: 24 }}>Insight not found</Text>;

  const isOwner = insight.user?.id === currentUser?.id;
  const isLiked = insight.likes?.some((l) => l.user_id === currentUser?.id);

  return (
    <ScreenWrapper scroll contentContainerStyle={styles.container}>
      <Text variant="headlineMedium">{insight.title}</Text>
      <Text variant="bodySmall" style={styles.meta}>
        by{' '}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Community', { screen: 'UserDetail', params: { id: insight.user?.id } })}>
          {insight.user?.name}
        </Text>
        {' '}| {insight.likes?.length || 0} likes
      </Text>

      <Text variant="bodyLarge" style={styles.body}>{insight.body || insight.description}</Text>

      <View style={styles.actions}>
        <Button icon={isLiked ? 'heart' : 'heart-outline'} onPress={handleLike}>
          {isLiked ? 'Liked' : 'Like'} ({insight.likes?.length || 0})
        </Button>
        {isOwner && (
          <>
            <Button onPress={() => navigation.navigate('InsightEdit', { id, item: insight })}>Edit</Button>
            <Button onPress={handleDelete} textColor="red">Delete</Button>
          </>
        )}
        {!isOwner && !insight?.my_report && (
          <Button icon="flag" onPress={() => setReportVisible(true)}>Report</Button>
        )}
        {insight?.my_report && (
          <Text variant="bodySmall" style={{ opacity: 0.6 }}>Report {insight.my_report.status}</Text>
        )}
      </View>

      <Divider style={styles.divider} />
      <Text variant="titleMedium">Comments ({insight.comments?.length || 0})</Text>

      {insight.comments?.map((c) => (
        <Card key={c.id} style={styles.commentCard}>
          <Card.Content>
            <Text variant="bodyMedium">{c.content}</Text>
            <Text
              variant="bodySmall"
              style={[styles.commentMeta, styles.link]}
              onPress={() => navigation.navigate('Community', { screen: 'UserDetail', params: { id: c.user?.id } })}>
              {c.user?.name}
            </Text>
          </Card.Content>
          {c.user_id === currentUser?.id && (
            <Card.Actions>
              <IconButton icon="delete" size={16} onPress={() => handleDeleteComment(c.id)} />
            </Card.Actions>
          )}
        </Card>
      ))}

      <View style={styles.commentInput}>
        <TextInput
          label="Add a comment"
          value={comment}
          onChangeText={setComment}
          mode="outlined"
          style={{ flex: 1 }}
        />
        <IconButton icon="send" onPress={handleComment} />
      </View>

      <Portal>
        <Modal visible={reportVisible} transparent animationType="slide" onRequestClose={() => setReportVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
              <Text variant="titleLarge" style={{ marginBottom: 12 }}>Report Insight</Text>
              <TextInput
                label="Reason for reporting"
                value={reportReason}
                onChangeText={setReportReason}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={{ marginBottom: 12 }}
              />
              <Button
                mode="contained"
                onPress={handleReport}
                disabled={!reportReason.trim()}
                style={{ marginBottom: 8 }}>
                Submit Report
              </Button>
              <Button onPress={() => setReportVisible(false)}>Cancel</Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24 },
  meta: { opacity: 0.6, marginTop: 4, marginBottom: 16 },
  body: { marginBottom: 16, lineHeight: 24 },
  actions: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  divider: { marginVertical: 16 },
  commentCard: { marginTop: 8 },
  commentMeta: { opacity: 0.6, marginTop: 4 },
  commentInput: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 8 },
  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 24 },
  modalContent: { borderRadius: 12, padding: 24 },
  link: { textDecorationLine: 'underline' },
});
