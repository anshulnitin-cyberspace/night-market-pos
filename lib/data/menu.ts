import type { MenuItem } from "@/lib/types";

/**
 * MENU DATA — add, remove or reorder items here.
 *
 * The MenuItem card is intentionally decoupled from this file. To add a new
 * food, copy an object below and drop a square image into /public/food.
 */
export const MENU_ITEMS: MenuItem[] = [
  {
    id: "skewers",
    name: "烤串",
    pinyin: "kǎo chuàn",
    englishName: "Cumin Lamb Skewers",
    description: {
      en: "Charred over open flame, dusted with cumin and chili.",
      zh: "炭火現烤，撒上孜然與辣椒。",
    },
    price: 18,
    image: "/food/skewers.webp",
    tag: { en: "Grill", zh: "炭烤" },
    stall: "07",
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
    price: 32,
    image: "/food/soup-dumplings.webp",
    tag: { en: "Steam", zh: "蒸點" },
    stall: "02",
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
    price: 22,
    image: "/food/stinky-tofu.webp",
    tag: { en: "Fried", zh: "油炸" },
    stall: "11",
  },
  {
    id: "bubble-tea",
    name: "珍珠奶茶",
    pinyin: "zhēn zhū nǎi chá",
    englishName: "Pearl Milk Tea",
    description: {
      en: "Silky black tea, fresh milk and chewy brown-sugar pearls.",
      zh: "濃醇紅茶、鮮奶與黑糖珍珠。",
    },
    price: 16,
    image: "/food/bubble-tea.webp",
    tag: { en: "Drink", zh: "飲品" },
    stall: "05",
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
    image: "/food/fried-dumplings.webp",
    tag: { en: "Crisp", zh: "香煎" },
    stall: "02",
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
    price: 12,
    image: "/food/tanghulu.webp",
    tag: { en: "Sweet", zh: "甜點" },
    stall: "14",
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
    image: "/food/fried-noodles.webp",
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
    image: "/food/scallion-pancake.webp",
    tag: { en: "Griddle", zh: "現烙" },
    stall: "09",
  },
];
