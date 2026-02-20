import { useRef, useEffect, useMemo, useState, memo } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, IconButton, useTheme } from 'react-native-paper';
import { useDate } from '../context/DateContext';
import { buildCalendarDays } from '@care/shared';
import DatePickerModal from './DatePickerModal';

const CARD_W = 56;
const CARD_MX = 4;
const CARD_TOTAL = CARD_W + CARD_MX * 2;

const DayCard = memo(function DayCard({ day, isSelected, isTodayUnselected, colors, onSelect }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.card,
        { backgroundColor: colors.surfaceVariant },
        isSelected && { backgroundColor: colors.primary },
      ]}
      onPress={() => onSelect(day.dateStr)}
    >
      {day.isToday && isSelected && (
        <Text style={[styles.todayLabel, { color: colors.onPrimary }]}>
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
      {isTodayUnselected && (
        <View style={[styles.todayDot, { backgroundColor: colors.primary }]} />
      )}
    </TouchableOpacity>
  );
}, (prev, next) => (
  prev.day.dateStr === next.day.dateStr
  && prev.isSelected === next.isSelected
  && prev.isTodayUnselected === next.isTodayUnselected
));

export default function DateCarousel() {
  const { selectedDate, setSelectedDate } = useDate();
  const { colors } = useTheme();
  const scrollRef = useRef(null);
  const days = useMemo(() => buildCalendarDays(selectedDate), [selectedDate]);
  const [showPicker, setShowPicker] = useState(false);
  const [visibleYear, setVisibleYear] = useState(
    () => parseInt(selectedDate.substring(0, 4), 10)
  );
  const hasMounted = useRef(false);
  const todayStr = useMemo(() => new Date().toLocaleDateString('en-CA'), []);

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

  const handleGoToToday = () => {
    setSelectedDate(todayStr);
  };

  return (
    <View>
      <View style={styles.header}>
        <IconButton icon="calendar" size={20} onPress={() => setShowPicker(true)} />
        <Text variant="labelMedium" style={[styles.year, { color: colors.onSurface }]}>
          {visibleYear}
        </Text>
        <IconButton icon="crosshairs-gps" size={20} onPress={handleGoToToday} />
      </View>

      <DatePickerModal
        visible={showPicker}
        value={new Date(selectedDate + 'T00:00:00')}
        mode="date"
        onConfirm={handlePickerConfirm}
        onDismiss={() => setShowPicker(false)}
      />

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scroll}
        onScroll={handleScroll}
        scrollEventThrottle={64}
      >
        {days.map((day) => (
          <DayCard
            key={day.dateStr}
            day={day}
            isSelected={day.dateStr === selectedDate}
            isTodayUnselected={day.isToday && day.dateStr !== selectedDate}
            colors={colors}
            onSelect={setSelectedDate}
          />
        ))}
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
  todayLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
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
