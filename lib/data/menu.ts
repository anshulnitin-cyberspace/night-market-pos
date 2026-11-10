import type { MenuItem } from "@/lib/types";

/**
 * MENU_DATA — the whole menu lives here.
 *
 * I used to keep this in App.jsx but it got way too long lol. Images are local
 * now, inside public/assets/food/. If you drop your own photos in there just
 * make sure the file name matches the `image` field below, otherwise you get a
 * broken image icon and it looks sad.
 *
 * TODO: maybe split spicy/sweet/drinks into separate files later, but it works
 *       for now so i'm not touching it during the demo.
 */
export const MENU_DATA: MenuItem[] = [
  // ---------- savoury / spicy stuff ----------
  {
    id: "skewers",
    name: "烤串",
    pinyin: "kǎo chuàn",
    englishName: "Cumin Lamb Skewers",
    description: {
      en: "Cumin-dusted lamb skewers, charred fast over open flame.",
      zh: "孜然羊肉串，炭火快烤，香氣四溢。",
    },
    price: 8, // it says per skewer on the board, i'm just charging per stick
    image: "/assets/food/skewers.webp",
    tag: { en: "Grill", zh: "炭烤" },
    stall: "07",
  },
  {
    id: "stinky-tofu",
    name: "臭豆腐",
    pinyin: "chòu dòu fu",
    englishName: "Stinky Tofu",
    description: {
      en: "Crisp fermented tofu with garlic, chili and pickles.",
      zh: "外酥內嫩的發酵豆腐，配蒜蓉與泡菜。",
    },
    price: 12,
    image: "/assets/food/stinky-tofu.webp",
    tag: { en: "Fried", zh: "油炸" },
    stall: "11",
  },
  {
    id: "chongqing-noodles",
    name: "重慶小麵",
    pinyin: "chóng qìng xiǎo miàn",
    englishName: "Chongqing Spicy Noodles",
    description: {
      en: "Springy noodles in a numbing chili-oil broth with pickled greens.",
      zh: "彈牙麵條浸在麻辣紅油湯底，配上酸菜。",
    },
    price: 15,
    image: "/assets/food/chongqing-noodles.webp",
    tag: { en: "Noodles", zh: "麵食" },
    stall: "03",
  },
  {
    id: "soup-dumplings",
    name: "小籠包",
    pinyin: "xiǎo lóng bāo",
    englishName: "Soup Dumplings",
    description: {
      en: "Thin-skinned pockets of pork and hot, savory broth.",
      zh: "薄皮包著豬肉與滾燙湯汁。",
    },
    price: 20,
    image: "/assets/food/soup-dumplings.webp",
    tag: { en: "Steam", zh: "蒸點" },
    stall: "02",
  },
  {
    id: "fried-dumplings",
    name: "煎餃",
    pinyin: "jiān jiǎo",
    englishName: "Pan-fried Dumplings",
    description: {
      en: "Golden-bottomed dumplings with a ginger-soy dip.",
      zh: "金黃脆底的豬肉煎餃，附薑醋醬。",
    },
    price: 26,
    image: "/assets/food/fried-dumplings.webp",
    tag: { en: "Crisp", zh: "香煎" },
    stall: "02",
  },
  {
    id: "crayfish",
    name: "小龍蝦",
    pinyin: "xiǎo lóng xiā",
    englishName: "Spicy Crayfish",
    description: {
      en: "Freshwater crayfish simmered in numbing chili and garlic.",
      zh: "小龍蝦以麻辣蒜香湯汁燜煮。",
    },
    price: 45,
    image: "/assets/food/crayfish.webp",
    tag: { en: "Spicy", zh: "麻辣" },
    stall: "08",
  },
  {
    id: "jianbing",
    name: "煎餅",
    pinyin: "jiān bǐng",
    englishName: "Chinese Crepe",
    description: {
      en: "Thin mung-bean crepe folded around egg, scallion and crisp cracker.",
      zh: "綠豆薄餅裹上雞蛋、蔥花與薄脆。",
    },
    price: 9,
    image: "/assets/food/jianbing.webp",
    tag: { en: "Griddle", zh: "現烙" },
    stall: "01",
  },
  {
    id: "spicy-jianbing",
    name: "辣味煎餅果子",
    pinyin: "là wèi jiān bǐng guǒ zi",
    englishName: "Spicy Jianbing Guozi",
    description: {
      en: "Jianbing rolled tight with chili paste, egg and crunchy youtiao.",
      zh: "煎餅抹上辣醬，裹入雞蛋與脆油條。",
    },
    price: 9,
    image: "/assets/food/spicy-jianbing.webp",
    tag: { en: "Spicy", zh: "香辣" },
    stall: "01",
  },
  {
    id: "hot-sour-noodles",
    name: "酸辣粉",
    pinyin: "suān là fěn",
    englishName: "Hot and Sour Rice Noodles",
    description: {
      en: "Slippery sweet-potato noodles in sour chili broth with peanuts.",
      zh: "紅薯粉浸在酸辣湯底，撒上花生與香菜。",
    },
    price: 15,
    image: "/assets/food/hot-sour-noodles.webp",
    tag: { en: "Noodles", zh: "麵食" },
    stall: "03",
  },
  {
    id: "duck-neck",
    name: "辣鴨脖",
    pinyin: "là yā bó",
    englishName: "Spicy Duck Neck",
    description: {
      en: "Braised duck neck glazed in chili oil — chewy, spicy, addictive.",
      zh: "鴨脖以辣油滷煮，越嚼越香。",
    },
    price: 12,
    image: "/assets/food/duck-neck.webp",
    tag: { en: "Spicy", zh: "香辣" },
    stall: "06",
  },
  {
    id: "liangpi",
    name: "涼皮",
    pinyin: "liáng pí",
    englishName: "Sichuan Cold Rice Noodles",
    description: {
      en: "Chilled rice noodles tossed with chili oil, vinegar and cucumber.",
      zh: "冰涼米皮拌上辣油、香醋與黃瓜絲。",
    },
    price: 11,
    image: "/assets/food/liangpi.webp",
    tag: { en: "Cold", zh: "涼拌" },
    stall: "10",
  },
  {
    id: "chicken-feet",
    name: "泡椒鳳爪",
    pinyin: "pào jiāo fèng zhuǎ",
    englishName: "Pickled Chili Chicken Feet",
    description: {
      en: "Bone-in chicken feet pickled in sour chili brine.",
      zh: "雞爪浸泡泡椒滷汁，酸辣開胃。",
    },
    price: 16,
    image: "/assets/food/chicken-feet.webp",
    tag: { en: "Spicy", zh: "香辣" },
    stall: "06",
  },
  {
    id: "rice-cake",
    name: "炒年糕",
    pinyin: "chǎo nián gāo",
    englishName: "Spicy Rice Cakes",
    description: {
      en: "Chewy rice cakes stir-fried in a sweet-hot chili sauce.",
      zh: "年糕以甜辣醬快炒，軟糯入味。",
    },
    price: 15,
    image: "/assets/food/rice-cake.webp",
    tag: { en: "Wok", zh: "鑊氣" },
    stall: "09",
  },
  {
    id: "fried-noodles",
    name: "炒麵",
    pinyin: "chǎo miàn",
    englishName: "Wok-fried Noodles",
    description: {
      en: "Smoky noodles tossed with scallion, sprouts and soy.",
      zh: "鑊氣十足，拌入蔥花、豆芽與醬油。",
    },
    price: 24,
    image: "/assets/food/fried-noodles.webp",
    tag: { en: "Wok", zh: "鑊氣" },
    stall: "09",
  },
  {
    id: "scallion-pancake",
    name: "蔥油餅",
    pinyin: "cōng yóu bǐng",
    englishName: "Scallion Pancake",
    description: {
      en: "Flaky layered flatbread with crisp edges and sweet scallion.",
      zh: "層層酥香的蔥油餅，邊緣金黃。",
    },
    price: 14,
    image: "/assets/food/scallion-pancake.webp",
    tag: { en: "Griddle", zh: "現烙" },
    stall: "09",
  },

  // ---------- sweet stuff (my favourite section) ----------
  {
    id: "egg-waffle",
    name: "雞蛋仔",
    pinyin: "jī dàn zǎi",
    englishName: "Egg Waffle",
    description: {
      en: "Golden bubble waffle, crisp outside and custardy within.",
      zh: "金黃雞蛋仔，外脆內軟，蛋香濃郁。",
    },
    price: 15,
    image: "/assets/food/egg-waffle.webp",
    tag: { en: "Sweet", zh: "甜點" },
    stall: "12",
  },
  {
    id: "tanghulu",
    name: "糖葫蘆",
    pinyin: "táng hú lu",
    englishName: "Candied Hawthorn",
    description: {
      en: "Glass-crisp sugar shell around tart hawthorn berries.",
      zh: "糖衣薄脆，裹住酸甜山楂。",
    },
    price: 7,
    image: "/assets/food/tanghulu.webp",
    tag: { en: "Sweet", zh: "甜點" },
    stall: "14",
  },
  {
    id: "white-sugar-cake",
    name: "白糖糕",
    pinyin: "bái táng gāo",
    englishName: "White Sugar Cake",
    description: {
      en: "Springy steamed rice cake with a clean, faint sweetness.",
      zh: "爽彈蒸米糕，清甜不膩。",
    },
    price: 4,
    image: "/assets/food/white-sugar-cake.webp",
    tag: { en: "Sweet", zh: "甜點" },
    stall: "12",
  },
  {
    id: "osmanthus-cake",
    name: "桂花糕",
    pinyin: "guì huā gāo",
    englishName: "Osmanthus Rice Cake",
    description: {
      en: "Chewy rice cake perfumed with dried osmanthus blossom.",
      zh: "軟糯米糕，散發桂花清香。",
    },
    price: 9,
    image: "/assets/food/osmanthus-cake.webp",
    tag: { en: "Sweet", zh: "甜點" },
    stall: "13",
  },
  {
    id: "mango-sago",
    name: "楊枝甘露",
    pinyin: "yáng zhī gān lù",
    englishName: "Mango Sago Cream",
    description: {
      en: "Chilled mango cream with sago, pomelo and coconut.",
      zh: "冰凍芒果忌廉，拌入西米、柚子與椰奶。",
    },
    price: 17,
    image: "/assets/food/mango-sago.webp",
    tag: { en: "Sweet", zh: "甜點" },
    stall: "14",
  },

  // ---------- drinks ----------
  {
    id: "bubble-tea",
    name: "珍珠奶茶",
    pinyin: "zhēn zhū nǎi chá",
    englishName: "Pearl Milk Tea",
    description: {
      en: "Silky black tea, fresh milk and chewy brown-sugar pearls.",
      zh: "濃醇紅茶、鮮奶與黑糖珍珠。",
    },
    price: 18,
    image: "/assets/food/bubble-tea.webp",
    tag: { en: "Drink", zh: "飲品" },
    stall: "05",
  },
  {
    id: "soy-milk",
    name: "豆漿",
    pinyin: "dòu jiāng",
    englishName: "Fresh Soy Milk",
    description: {
      en: "Warm, freshly pressed soy milk, lightly sweetened.",
      zh: "現磨熱豆漿，微甜順滑。",
    },
    price: 5,
    image: "/assets/food/soy-milk.webp",
    tag: { en: "Drink", zh: "飲品" },
    stall: "04",
  },
  {
    id: "herbal-tea",
    name: "涼茶",
    pinyin: "liáng chá",
    englishName: "Traditional Herbal Tea",
    description: {
      en: "Bittersweet herbal brew served warm — a night-market reset.",
      zh: "微苦回甘的傳統涼茶，溫熱解膩。",
    },
    price: 5, // grandma said this should cost more but whatever
    image: "/assets/food/herbal-tea.webp",
    tag: { en: "Drink", zh: "飲品" },
    stall: "04",
  },
  {
    id: "lemon-tea",
    name: "檸檬茶",
    pinyin: "níng méng chá",
    englishName: "Iced Lemon Tea",
    description: {
      en: "Strong black tea over ice with fresh lemon and a hit of sugar.",
      zh: "濃紅茶加冰塊與鮮檸檬，酸甜清爽。",
    },
    price: 15,
    image: "/assets/food/lemon-tea.webp",
    tag: { en: "Drink", zh: "飲品" },
    stall: "05",
  },
];

// old name — api.ts and mock-db.ts still import this, so keep it or everything
// explodes (found that out the hard way at 2am)
export const MENU_ITEMS = MENU_DATA;
