import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function StarRating({ value, onChange }) {
  return (
    <View style={styles.row}>
      <Text variant="bodyLarge" style={styles.label}>Rating</Text>
      <View style={styles.stars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <TouchableOpacity key={n} onPress={() => onChange(n)}>
            <MaterialCommunityIcons
              name={n <= value ? 'star' : 'star-outline'}
              size={36}
              color="#FFB300"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    marginRight: 12,
    opacity: 0.7,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
});
