import RestaurantIcon from "@material-ui/icons/Restaurant";

export const foodRegex = /avocado|chicken|hamburger|burger|(^cheese$)|pizza|cheeseburger|steak|meat|milk|bacon|rice|pork|soup|taco|apple|pasta|spaghetti|falafel|ice ?cream|cookie|watermelon/;

export const foodMap = {
  avocado: "🥑",
  chicken: "🍗",
  hamburger: "🍔",
  cheeseburger: "🍔",
  cheese: "🧀",
  pizza: "🍕",
  steak: "🥩",
  meat: "🍖",
  milk: "🥛",
  bacon: "🥓",
  rice: "🍚",
  pork: "🐖",
  soup: "🍲",
  taco: "🌮",
  apple: "🍎",
  pasta: "🍝",
  spaghetti: "🍝",
  falafel: "🧆",
  icecream: "🍨",
  "ice cream": "🍨",
  cookie: "🍪",
  watermelon: "🍉",
};

const getFoodEmoji = (food) => {
  const result = food?.toLowerCase().trim().match(foodRegex);
  if (result) {
    return foodMap[result[0]];
  }
  return null;
};

export const foodNameJSX = (food) => {
  const result = getFoodEmoji(food?.name);
  if (result) {
    return (
      <>
        <span role="img" aria-label={food.name}>
          {result}
        </span>
        &#8199;{food.name}
      </>
    );
  } else {
    return (
      <>
        <RestaurantIcon />
        &nbsp;{food.name}
      </>
    );
  }
};

export const foodIcon = (foodName) => {
  const result = getFoodEmoji(foodName);
  if (result) {
    return `${result}`;
  }

  return '🍽️';
};

export const foodName = (foodName) => {
  const result = getFoodEmoji(foodName);
  if (result) {
    return `${result} ${foodName}`;
  }
  return foodName;
};