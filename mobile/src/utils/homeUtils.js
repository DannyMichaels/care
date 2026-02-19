export const formatMedTime = (timeStr) => {
  if (!timeStr) return null;
  const d = new Date(timeStr);
  if (isNaN(d)) return null;
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export const getCountdown = (timeStr, now) => {
  if (!timeStr) return null;
  const target = new Date(timeStr);
  if (isNaN(target)) return null;
  const diff = target - now;
  if (diff <= 0) return { text: 'Overdue', overdue: true, urgent: false };
  const hours = Math.floor(diff / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  if (hours > 0) return { text: `${hours}h ${mins}m`, overdue: false, urgent: false };
  if (mins > 0) return { text: `${mins}m ${secs}s`, overdue: false, urgent: mins < 1 };
  return { text: `${secs}s`, overdue: false, urgent: true };
};

export const MOOD_ICON_MAP = {
  poor: { icon: 'emoticon-sad', color: '#F44336' },
  okay: { icon: 'emoticon-neutral', color: '#FFC107' },
  good: { icon: 'emoticon-happy', color: '#4CAF50' },
  great: { icon: 'emoticon-excited', color: '#8BC34A' },
};

export const FOOD_EMOJI_MAP = {
  avocado: '🥑', chicken: '🍗', hamburger: '🍔', cheeseburger: '🍔',
  cheese: '🧀', pizza: '🍕', steak: '🥩', meat: '🍖', milk: '🥛',
  bacon: '🥓', rice: '🍚', pork: '🐖', soup: '🍲', taco: '🌮',
  apple: '🍎', pasta: '🍝', spaghetti: '🍝', falafel: '🧆',
  icecream: '🍨', 'ice cream': '🍨', cookie: '🍪', watermelon: '🍉',
};

export const getFoodEmoji = (name) => {
  if (!name) return '🍽️';
  const lower = name.toLowerCase();
  if (FOOD_EMOJI_MAP[lower]) return FOOD_EMOJI_MAP[lower];
  const match = Object.keys(FOOD_EMOJI_MAP).find((key) => lower.includes(key));
  return match ? FOOD_EMOJI_MAP[match] : '🍽️';
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good morning', icon: 'weather-sunny', color: '#FFB300' };
  if (hour < 18) return { text: 'Good afternoon', icon: 'weather-sunset', color: '#FF7043' };
  return { text: 'Good evening', icon: 'weather-night', color: '#5C6BC0' };
};
