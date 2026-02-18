import { useRef, useEffect, useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { useDate } from '../context/DateContext';
import { daysBetween } from '@care/shared';
import DatePickerModal from './DatePickerModal';

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
const CARD_W = 56;
const CARD_MX = 4;
const CARD_TOTAL = CARD_W + CARD_MX * 2;
const FUTURE_DAYS = 7;

function buildDays(selectedDate) {
  const now = new Date();
  const defaultStart = new Date(now);
  defaultStart.setDate(defaultStart.getDate() - 365);

  const selectedStart = new Date(selectedDate + 'T00:00:00');
  const earliest = selectedStart < defaultStart ? selectedStart : defaultStart;
  const totalPast = daysBetween(earliest, now);

  const days = [];
  for (let i = totalPast; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    days.push({
      dateStr: d.toLocaleDateString('en-CA'),
      dayOfWeek: SHORT_DAYS[d.getDay()],
      dayOfMonth: d.getDate(),
      month: SHORT_MONTHS[d.getMonth()],
      year: d.getFullYear(),
      isToday: i === 0,
      isFuture: false,
    });
  }
  for (let i = 1; i <= FUTURE_DAYS; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    days.push({
      dateStr: d.toLocaleDateString('en-CA'),
      dayOfWeek: SHORT_DAYS[d.getDay()],
      dayOfMonth: d.getDate(),
      month: SHORT_MONTHS[d.getMonth()],
      year: d.getFullYear(),
      isToday: false,
      isFuture: true,
    });
  }
  return days;
}

export default function DateCarousel() {
  const { selectedDate, setSelectedDate } = useDate();
  const { colors } = useTheme();
  const scrollRef = useRef(null);
  const days = useMemo(() => buildDays(selectedDate), [selectedDate]);
  const [showPicker, setShowPicker] = useState(false);
  const [visibleYear, setVisibleYear] = useState(
    () => parseInt(selectedDate.substring(0, 4), 10)
  );
  const hasMounted = useRef(false);

  useEffect(() => {
    const idx = days.findIndex((d) => d.dateStr === selectedDate);
    if (idx >= 0 && scrollRef.current) {
      const x = Math.max(0, idx * CARD_TOTAL - 140);
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x, animated: hasMounted.current });
      }, 50);
    }
    if (!hasMounted.current) hasMounted.current = true;
  }, [selectedDate, days]);

  const handleScroll = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const centerIdx = Math.round((offsetX + 140) / CARD_TOTAL);
    const clamped = Math.max(0, Math.min(centerIdx, days.length - 1));
    if (days[clamped] && days[clamped].year !== visibleYear) {
      setVisibleYear(days[clamped].year);
    }
  };

  const handlePickerConfirm = (date) => {
    setShowPicker(false);
    setSelectedDate(date.toLocaleDateString('en-CA'));
  };

  return (
    <View>
      <View style={styles.header}>
        <IconButton icon="calendar" size={20} onPress={() => setShowPicker(true)} />
        <Text variant="labelMedium" style={[styles.year, { color: colors.onSurface }]}>
          {visibleYear}
        </Text>
      </View>

      <DatePickerModal
        visible={showPicker}
        value={new Date(selectedDate + 'T00:00:00')}
        mode="date"
        maximumDate={new Date()}
        onConfirm={handlePickerConfirm}
        onDismiss={() => setShowPicker(false)}
      />

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        onScroll={handleScroll}
        scrollEventThrottle={64}
      >
        {days.map((day) => {
          const isSelected = day.dateStr === selectedDate;
          return (
            <TouchableOpacity
              key={day.dateStr}
              activeOpacity={day.isFuture ? 1 : 0.7}
              style={[
                styles.card,
                { backgroundColor: colors.surfaceVariant },
                day.isFuture && styles.futureCard,
                isSelected && { backgroundColor: colors.primary },
              ]}
              onPress={() => !day.isFuture && setSelectedDate(day.dateStr)}
            >
              {day.isToday && (
                <Text style={[styles.todayLabel, isSelected && { color: colors.onPrimary }]}>
                  TODAY
                </Text>
              )}
              <Text
                style={[
                  styles.dayText,
                  { color: colors.onSurfaceVariant },
                  isSelected && { color: colors.onPrimary },
                ]}
              >
                {day.dayOfWeek}
              </Text>
              <Text
                style={[
                  styles.dayNum,
                  { color: colors.onSurface },
                  isSelected && { color: colors.onPrimary },
                ]}
              >
                {day.dayOfMonth}
              </Text>
              <Text
                style={[
                  styles.monthText,
                  { color: colors.onSurfaceVariant },
                  isSelected && { color: colors.onPrimary },
                ]}
              >
                {day.month}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
  },
  year: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '600',
    opacity: 0.7,
  },
  scroll: { paddingHorizontal: 8, paddingVertical: 8 },
  card: {
    width: CARD_W,
    minHeight: 72,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: CARD_MX,
    paddingVertical: 6,
  },
  futureCard: { opacity: 0.3 },
  todayLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  dayText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  dayNum: {
    fontSize: 16,
    fontWeight: '700',
  },
  monthText: {
    fontSize: 10,
    textTransform: 'uppercase',
  },
});
