import { useRef, useEffect, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, Switch, useTheme } from 'react-native-paper';
import { useDate } from '../context/DateContext';

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const RANGE = 30;

function buildDays() {
  const days = [];
  const today = new Date();
  for (let i = -RANGE; i <= RANGE; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    days.push({
      dateStr: d.toLocaleDateString('en-CA'),
      dayOfWeek: SHORT_DAYS[d.getDay()],
      dayOfMonth: d.getDate(),
      isToday: i === 0,
    });
  }
  return days;
}

export default function DateCarousel() {
  const { selectedDate, setSelectedDate, showAllDates, setShowAllDates } = useDate();
  const theme = useTheme();
  const scrollRef = useRef(null);
  const days = useMemo(() => buildDays(), []);

  useEffect(() => {
    const idx = days.findIndex((d) => d.dateStr === selectedDate);
    if (idx >= 0 && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: idx * 56 - 140, animated: false });
      }, 100);
    }
  }, []);

  if (showAllDates) {
    return (
      <View style={styles.allRow}>
        <Text variant="titleMedium">All Dates</Text>
        <Switch value={showAllDates} onValueChange={() => setShowAllDates(false)} />
      </View>
    );
  }

  return (
    <View>
      <View style={styles.header}>
        <Switch value={showAllDates} onValueChange={() => setShowAllDates(true)} />
        <Text variant="labelSmall" style={{ opacity: 0.6 }}>All</Text>
      </View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {days.map((day) => {
          const isSelected = day.dateStr === selectedDate;
          return (
            <TouchableOpacity
              key={day.dateStr}
              style={[
                styles.dayPill,
                isSelected && { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setSelectedDate(day.dateStr)}
            >
              <Text
                variant="labelSmall"
                style={[styles.dayText, isSelected && styles.selectedText]}
              >
                {day.dayOfWeek}
              </Text>
              <Text
                variant="titleMedium"
                style={[styles.dayNum, isSelected && styles.selectedText]}
              >
                {day.dayOfMonth}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 4 },
  allRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  scroll: { paddingHorizontal: 8, paddingVertical: 8 },
  dayPill: {
    width: 48,
    height: 64,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  dayText: { opacity: 0.6 },
  dayNum: { fontWeight: 'bold' },
  selectedText: { color: '#fff', opacity: 1 },
});
