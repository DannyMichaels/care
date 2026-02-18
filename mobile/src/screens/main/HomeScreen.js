import { useState, useEffect, useMemo, useCallback } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { List, Text, Badge, useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getAllMeds, getAllMoods, getAllFoods, getAllSymptoms, getAllAffirmations, filterByDate } from '@care/shared';
import { useCurrentUser } from '../../context/CurrentUserContext';
import { useDate } from '../../context/DateContext';
import DateCarousel from '../../components/DateCarousel';

export default function HomeScreen({ navigation }) {
  const [{ currentUser }] = useCurrentUser();
  const { selectedDate, showAllDates } = useDate();
  const theme = useTheme();

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
    return unsubscribe;
  }, [navigation, fetchAll]);

  const filteredMeds = useMemo(() => filterByDate(meds, selectedDate, showAllDates, 'time'), [meds, selectedDate, showAllDates]);
  const filteredMoods = useMemo(() => filterByDate(moods, selectedDate, showAllDates, 'time'), [moods, selectedDate, showAllDates]);
  const filteredFoods = useMemo(() => filterByDate(foods, selectedDate, showAllDates, 'time'), [foods, selectedDate, showAllDates]);
  const filteredSymptoms = useMemo(() => filterByDate(symptoms, selectedDate, showAllDates, 'time'), [symptoms, selectedDate, showAllDates]);
  const filteredAffirmations = useMemo(() => filterByDate(affirmations, selectedDate, showAllDates, 'affirmation_date'), [affirmations, selectedDate, showAllDates]);

  const MED_ICON_MAP = { tablet: 'tablet', pill: 'pill', droplet: 'water' };

  const sections = [
    { title: 'Medications', data: filteredMeds, icon: 'pill', createScreen: 'MedCreate', editScreen: 'MedEdit', nameField: 'name', isMed: true },
    { title: 'Moods', data: filteredMoods, icon: 'emoticon-outline', createScreen: 'MoodCreate', editScreen: 'MoodEdit', nameField: 'status' },
    { title: 'Symptoms', data: filteredSymptoms, icon: 'thermometer', createScreen: 'SymptomCreate', editScreen: 'SymptomEdit', nameField: 'name' },
    { title: 'Foods', data: filteredFoods, icon: 'food-apple', createScreen: 'FoodCreate', editScreen: 'FoodEdit', nameField: 'name' },
    { title: 'Affirmations', data: filteredAffirmations, icon: 'heart-outline', createScreen: 'AffirmationCreate', editScreen: 'AffirmationEdit', nameField: 'content' },
  ];

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.greeting}>
        Hello, {currentUser?.name}
      </Text>
      <DateCarousel />
      <ScrollView style={styles.list}>
        {sections.map((section) => (
          <List.Accordion
            key={section.title}
            title={section.title}
            left={(props) => <List.Icon {...props} icon={section.icon} />}
            right={() => <Badge style={{ backgroundColor: theme.colors.primary }}>{section.data.length}</Badge>}
          >
            {section.data.map((item) => (
              <List.Item
                key={item.id}
                title={item[section.nameField]?.substring(0, 40) || 'Untitled'}
                left={section.isMed ? () => (
                  <MaterialCommunityIcons
                    name={MED_ICON_MAP[item.icon] || 'pill'}
                    size={24}
                    color={item.icon_color || '#7E57C2'}
                    style={{ alignSelf: 'center', marginLeft: 8 }}
                  />
                ) : undefined}
                onPress={() => navigation.navigate(section.editScreen, { id: item.id, item })}
              />
            ))}
            <List.Item
              title={`Add ${section.title.slice(0, -1)}`}
              left={(props) => <List.Icon {...props} icon="plus" />}
              onPress={() => navigation.navigate(section.createScreen)}
            />
          </List.Accordion>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  greeting: { padding: 16, paddingBottom: 4 },
  list: { flex: 1 },
});
