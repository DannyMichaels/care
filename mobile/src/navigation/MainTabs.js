import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme as usePaperTheme } from 'react-native-paper';

import HomeScreen from '../screens/main/HomeScreen';
import MedCreateScreen from '../screens/main/MedCreateScreen';
import MedEditScreen from '../screens/main/MedEditScreen';
import MoodCreateScreen from '../screens/main/MoodCreateScreen';
import MoodEditScreen from '../screens/main/MoodEditScreen';
import SymptomCreateScreen from '../screens/main/SymptomCreateScreen';
import SymptomEditScreen from '../screens/main/SymptomEditScreen';
import FoodCreateScreen from '../screens/main/FoodCreateScreen';
import FoodEditScreen from '../screens/main/FoodEditScreen';
import AffirmationCreateScreen from '../screens/main/AffirmationCreateScreen';
import AffirmationEditScreen from '../screens/main/AffirmationEditScreen';
import InsightsListScreen from '../screens/insights/InsightsListScreen';
import InsightDetailScreen from '../screens/insights/InsightDetailScreen';
import InsightCreateScreen from '../screens/insights/InsightCreateScreen';
import InsightEditScreen from '../screens/insights/InsightEditScreen';
import CommunityScreen from '../screens/community/CommunityScreen';
import UserDetailScreen from '../screens/community/UserDetailScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const InsightsStack = createNativeStackNavigator();
const CommunityStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="MedCreate" component={MedCreateScreen} />
      <HomeStack.Screen name="MedEdit" component={MedEditScreen} />
      <HomeStack.Screen name="MoodCreate" component={MoodCreateScreen} />
      <HomeStack.Screen name="MoodEdit" component={MoodEditScreen} />
      <HomeStack.Screen name="SymptomCreate" component={SymptomCreateScreen} />
      <HomeStack.Screen name="SymptomEdit" component={SymptomEditScreen} />
      <HomeStack.Screen name="FoodCreate" component={FoodCreateScreen} />
      <HomeStack.Screen name="FoodEdit" component={FoodEditScreen} />
      <HomeStack.Screen name="AffirmationCreate" component={AffirmationCreateScreen} />
      <HomeStack.Screen name="AffirmationEdit" component={AffirmationEditScreen} />
    </HomeStack.Navigator>
  );
}

function InsightsStackScreen() {
  return (
    <InsightsStack.Navigator screenOptions={{ headerShown: false }}>
      <InsightsStack.Screen name="InsightsList" component={InsightsListScreen} />
      <InsightsStack.Screen name="InsightDetail" component={InsightDetailScreen} />
      <InsightsStack.Screen name="InsightCreate" component={InsightCreateScreen} />
      <InsightsStack.Screen name="InsightEdit" component={InsightEditScreen} />
    </InsightsStack.Navigator>
  );
}

function CommunityStackScreen() {
  return (
    <CommunityStack.Navigator screenOptions={{ headerShown: false }}>
      <CommunityStack.Screen name="CommunityMain" component={CommunityScreen} />
      <CommunityStack.Screen name="UserDetail" component={UserDetailScreen} />
    </CommunityStack.Navigator>
  );
}

export default function MainTabs() {
  const theme = usePaperTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home',
            Insights: 'lightbulb-outline',
            Community: 'account-group',
            Settings: 'cog',
          };
          return <MaterialCommunityIcons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} />
      <Tab.Screen name="Insights" component={InsightsStackScreen} />
      <Tab.Screen name="Community" component={CommunityStackScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
