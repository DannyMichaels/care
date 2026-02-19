import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { View, ScrollView, Image, StyleSheet } from 'react-native';
import { List, Text, Badge, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAllMeds, getAllMoods, getAllFoods, getAllSymptoms, getAllAffirmations, filterByDate, MED_ICON_DISPLAY_MAP } from '@care/shared';
import { useCurrentUser } from '../../context/CurrentUserContext';
import { useDate } from '../../context/DateContext';
import DateCarousel from '../../components/DateCarousel';
import ScreenWrapper from '../../components/ScreenWrapper';
import { formatMedTime, getCountdown, MOOD_ICON_MAP, getFoodEmoji, getGreeting } from '../../utils/homeUtils';

export default function HomeScreen({ navigation }) {
  const [{ currentUser }] = useCurrentUser();
  const { selectedDate } = useDate();
  const theme = useTheme();
  const [now, setNow] = useState(() => new Date());

  const [meds, setMeds] = useState([]);
  const [moods, setMoods] = useState([]);
  const [foods, setFoods] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [affirmations, setAffirmations] = useState([]);

  const fetchAll = useCallback(async () => {
    try {
      const [m, mo, f, s, a] = await Promise.all([
        getAllMeds(), getAllMoods(), getAllFoods(), getAllSymptoms(), getAllAffirmations(),
      ]);
      setMeds(m || []);
      setMoods(mo || []);
      setFoods(f || []);
      setSymptoms(s || []);
      setAffirmations(a || []);
    } catch {}
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchAll);
    return () => {
      unsubscribe();
    }
  }, [navigation, fetchAll]);

  const filteredMeds = useMemo(() => filterByDate(meds, selectedDate, false, 'time'), [meds, selectedDate]);
  const filteredMoods = useMemo(() => filterByDate(moods, selectedDate, false, 'time'), [moods, selectedDate]);
  const filteredFoods = useMemo(() => filterByDate(foods, selectedDate, false, 'time'), [foods, selectedDate]);
  const filteredSymptoms = useMemo(() => filterByDate(symptoms, selectedDate, false, 'time'), [symptoms, selectedDate]);
  const filteredAffirmations = useMemo(() => filterByDate(affirmations, selectedDate, false, 'affirmation_date'), [affirmations, selectedDate]);

  const hasUrgentMed = useMemo(() => {
    return filteredMeds?.some?.((med) => {
      if (med.is_taken || !med.time) return false;
      const diff = new Date(med.time) - now;
      return diff > 0 && diff < 60000;
    });
  }, [filteredMeds, now]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), hasUrgentMed ? 1000 : 60000);
    return () => clearInterval(id);
  }, [hasUrgentMed]);

  const getSectionIcon = (section, item) => {
    switch (section.type) {
      case 'med':
        return () => (
          <MaterialCommunityIcons
            name={MED_ICON_DISPLAY_MAP[item.icon] || 'pill'}
            size={24}
            color={item.icon_color || '#7E57C2'}
            style={styles.itemIcon}
          />
        );
      case 'mood': {
        const mood = MOOD_ICON_MAP[item.status?.toLowerCase()] || MOOD_ICON_MAP.okay;
        return () => (
          <MaterialCommunityIcons name={mood.icon} size={24} color={mood.color} style={styles.itemIcon} />
        );
      }
      case 'food':
        return () => <Text style={styles.foodEmoji}>{getFoodEmoji(item.name)}</Text>;
      case 'symptom':
        return () => (
          <MaterialCommunityIcons name="thermometer" size={24} color="#FF7043" style={styles.itemIcon} />
        );
      case 'affirmation':
        return () => (
          <MaterialCommunityIcons name="heart" size={24} color="#E91E63" style={styles.itemIcon} />
        );
      default:
        return undefined;
    }
  };

  const sections = [
    { title: 'Medications', data: filteredMeds, icon: 'pill', createScreen: 'MedCreate', editScreen: 'MedEdit', nameField: 'name', type: 'med' },
    { title: 'Diet', data: filteredFoods, icon: 'food-apple', createScreen: 'FoodCreate', editScreen: 'FoodEdit', nameField: 'name', type: 'food', singular: 'Food' },
    { title: 'Symptoms', data: filteredSymptoms, icon: 'thermometer', createScreen: 'SymptomCreate', editScreen: 'SymptomEdit', nameField: 'name', type: 'symptom' },
    { title: 'Moods', data: filteredMoods, icon: 'emoticon-outline', createScreen: 'MoodCreate', editScreen: 'MoodEdit', nameField: 'status', type: 'mood' },
    { title: 'Affirmations', data: filteredAffirmations, icon: 'heart-outline', createScreen: 'AffirmationCreate', editScreen: 'AffirmationEdit', nameField: 'content', type: 'affirmation' },
  ];

  return (
    <ScreenWrapper>
      <View style={styles.headerRow}>
        <Image
          source={require('../../../assets/icon.png')}
          style={styles.logo}
        />
        <Text variant="headlineMedium" style={styles.greeting}>
          {getGreeting().text}, {currentUser?.name}
        </Text>
        <MaterialCommunityIcons
          name={getGreeting().icon}
          size={28}
          color={getGreeting().color}
        />
      </View>
      <DateCarousel />
      <ScrollView style={styles.list}>
        {sections.map((section) => (
          <View key={section.title} style={[styles.card, { backgroundColor: theme.colors.surfaceVariant }]}>
            <List.Accordion
              title={section.title}
              left={(props) => <List.Icon {...props} icon={section.icon} />}
              right={() => <Badge style={{ backgroundColor: theme.colors.primary }}>{section.data.length}</Badge>}
              style={styles.accordionHeader}
            >
              {section.data.map((item) => {
                const isMed = section.type === 'med';
                const time = formatMedTime(item.time);
                const countdown = isMed && !item.is_taken ? getCountdown(item.time, now) : null;
                return (
                  <List.Item
                    key={item.id}
                    title={item[section.nameField]?.substring(0, 40) || 'Untitled'}
                    left={getSectionIcon(section, item)}
                    right={(isMed || time) ? () => (
                      <View style={styles.medBadges}>
                        {isMed && item.is_taken ? (
                          <View style={[styles.badge, styles.takenBadge]}>
                            <Text style={styles.badgeText}>Taken ✓</Text>
                          </View>
                        ) : isMed && countdown ? (
                          <View style={[styles.badge, countdown.overdue ? styles.overdueBadge : styles.countdownBadge]}>
                            <Text style={styles.badgeText}>{countdown.text}</Text>
                          </View>
                        ) : null}
                        {time && (
                          <View style={[styles.badge, { backgroundColor: theme.colors.surfaceVariant }]}>
                            <Text style={[styles.badgeText, { color: theme.colors.onSurface }]}>{time}</Text>
                          </View>
                        )}
                      </View>
                    ) : undefined}
                    onPress={() => navigation.navigate(section.editScreen, { id: item.id, item })}
                  />
                );
              })}
              <List.Item
                title={`Add ${section.singular || section.title.slice(0, -1)}`}
                left={(props) => <List.Icon {...props} icon="plus" />}
                onPress={() => navigation.navigate(section.createScreen)}
              />
            </List.Accordion>
          </View>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 4,
    gap: 12,
  },
  logo: { width: 44, height: 44, borderRadius: 22 },
  greeting: { flex: 1 },
  list: { flex: 1 },
  card: {
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 1,
    overflow: 'hidden',
  },
  accordionHeader: {
    borderRadius: 12,
  },
  itemIcon: {
    alignSelf: 'center',
    marginLeft: 16,
  },
  foodEmoji: {
    fontSize: 22,
    alignSelf: 'center',
    marginLeft: 16,
  },
  medBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  takenBadge: {
    backgroundColor: '#4CAF50',
  },
  countdownBadge: {
    backgroundColor: '#FFC107',
  },
  overdueBadge: {
    backgroundColor: '#FF9800',
  },
});
