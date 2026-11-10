import type { GlossaryData, GlossaryEntry } from "@/lib/types";

/**
 * GLOSSARY DATA — edit these arrays to grow the phrasebook.
 * Each section is rendered independently by <GlossaryTab />.
 */

export const CHINESE_FOOD: GlossaryEntry[] = [
  { id: "food-1", hanzi: "小籠包", pinyin: "xiǎo lóng bāo", en: "Xiaolongbao (Soup Dumplings)" },
  { id: "food-2", hanzi: "臭豆腐", pinyin: "chòu dòu fu", en: "Stinky Tofu" },
  { id: "food-3", hanzi: "烤串", pinyin: "kǎo chuàn", en: "Chuan'r (Grilled Lamb Skewers)" },
  { id: "food-4", hanzi: "珍珠奶茶", pinyin: "zhēn zhū nǎi chá", en: "Bubble Milk Tea" },
  { id: "food-5", hanzi: "蔥油餅", pinyin: "cōng yóu bǐng", en: "Scallion pancake" },
  { id: "food-6", hanzi: "糖葫蘆", pinyin: "táng hú lu", en: "Tanghulu (Candied Fruit Skewer)" },
  { id: "food-7", hanzi: "炒麵", pinyin: "chǎo miàn", en: "Fried noodles" },
  { id: "food-8", hanzi: "煎餃", pinyin: "jiān jiǎo", en: "Pan-fried dumplings" },
  { id: "food-9", hanzi: "滷肉飯", pinyin: "lǔ ròu fàn", en: "Braised pork rice" },
  { id: "food-10", hanzi: "大腸包小腸", pinyin: "dà cháng bāo xiǎo cháng", en: "Sausage in sticky rice" },
  { id: "food-11", hanzi: "蚵仔煎", pinyin: "é zǐ jiān", en: "Oyster omelette" },
  { id: "food-12", hanzi: "芒果冰", pinyin: "máng guǒ bīng", en: "Mango shaved ice" },

  // added these when the menu grew to 24 dishes.
  // TODO: keep in sync with lib/data/menu.ts, i keep forgetting one -_-
  { id: "food-13", hanzi: "重慶小麵", pinyin: "chóng qìng xiǎo miàn", en: "Chongqing Spicy Noodles" },
  { id: "food-14", hanzi: "小龍蝦", pinyin: "xiǎo lóng xiā", en: "Spicy Crayfish" },
  { id: "food-15", hanzi: "煎餅", pinyin: "jiān bǐng", en: "Chinese Crepe" },
  { id: "food-16", hanzi: "辣味煎餅果子", pinyin: "là wèi jiān bǐng guǒ zi", en: "Spicy Crispy Crepe (Jianbing)" },
  { id: "food-17", hanzi: "酸辣粉", pinyin: "suān là fěn", en: "Hot and Sour Rice Noodles" },
  { id: "food-18", hanzi: "辣鴨脖", pinyin: "là yā bó", en: "Spicy Duck Neck" },
  { id: "food-19", hanzi: "涼皮", pinyin: "liáng pí", en: "Sichuan Cold Rice Noodles" },
  { id: "food-20", hanzi: "泡椒鳳爪", pinyin: "pào jiāo fèng zhuǎ", en: "Spicy Chicken Feet" },
  { id: "food-21", hanzi: "炒年糕", pinyin: "chǎo nián gāo", en: "Spicy Pan-Fried Rice Cake" },
  { id: "food-22", hanzi: "雞蛋仔", pinyin: "jī dàn zǎi", en: "Egg Waffle (Bubble Waffle)" },
  { id: "food-23", hanzi: "白糖糕", pinyin: "bái táng gāo", en: "White Sugar Cake" },
  { id: "food-24", hanzi: "桂花糕", pinyin: "guì huā gāo", en: "Osmanthus Rice Cake" },
  { id: "food-25", hanzi: "楊枝甘露", pinyin: "yáng zhī gān lù", en: "Mango Sago Cream" },
  { id: "food-26", hanzi: "豆漿", pinyin: "dòu jiāng", en: "Fresh Soy Milk" },
  { id: "food-27", hanzi: "涼茶", pinyin: "liáng chá", en: "Traditional Herbal Tea" },
  { id: "food-28", hanzi: "檸檬茶", pinyin: "níng méng chá", en: "Lemon Tea" },
];

export const COMMON_WORDS: GlossaryEntry[] = [
  { id: "word-1", hanzi: "夜市", pinyin: "yè shì", en: "Night market" },
  { id: "word-2", hanzi: "攤位", pinyin: "tān wèi", en: "Stall" },
  { id: "word-3", hanzi: "老闆", pinyin: "lǎo bǎn", en: "Boss / owner" },
  { id: "word-4", hanzi: "好吃", pinyin: "hǎo chī", en: "Delicious" },
  { id: "word-5", hanzi: "辣", pinyin: "là", en: "Spicy" },
  { id: "word-6", hanzi: "冰", pinyin: "bīng", en: "Iced" },
  { id: "word-7", hanzi: "熱", pinyin: "rè", en: "Hot" },
  { id: "word-8", hanzi: "甜", pinyin: "tián", en: "Sweet" },
  { id: "word-9", hanzi: "酸", pinyin: "suān", en: "Sour" },
  { id: "word-10", hanzi: "現金", pinyin: "xiàn jīn", en: "Cash" },
  { id: "word-11", hanzi: "掃碼", pinyin: "sǎo mǎ", en: "Scan the code" },
  { id: "word-12", hanzi: "打包", pinyin: "dǎ bāo", en: "To take away" },
  { id: "word-13", hanzi: "加辣", pinyin: "jiā là", en: "Extra spicy" },
  { id: "word-14", hanzi: "不用", pinyin: "bù yòng", en: "No need" },
  { id: "word-15", hanzi: "多少", pinyin: "duō shao", en: "How much" },
  { id: "word-16", hanzi: "找錢", pinyin: "zhǎo qián", en: "Change (money)" },
];

export const COMMON_PHRASES: GlossaryEntry[] = [
  { id: "phrase-1", hanzi: "這個多少錢？", pinyin: "zhè ge duō shao qián?", en: "How much is this?" },
  { id: "phrase-2", hanzi: "我要一份。", pinyin: "wǒ yào yī fèn.", en: "I'd like one portion." },
  { id: "phrase-3", hanzi: "不要香菜。", pinyin: "bù yào xiāng cài.", en: "No cilantro, please." },
  { id: "phrase-4", hanzi: "小辣就好。", pinyin: "xiǎo là jiù hǎo.", en: "Just a little spicy." },
  { id: "phrase-5", hanzi: "可以掃碼嗎？", pinyin: "kě yǐ sǎo mǎ ma?", en: "Can I scan to pay?" },
  { id: "phrase-6", hanzi: "太好吃了！", pinyin: "tài hǎo chī le!", en: "This is so delicious!" },
  { id: "phrase-7", hanzi: "再來一份。", pinyin: "zài lái yī fèn.", en: "One more, please." },
  { id: "phrase-8", hanzi: "可以打包嗎？", pinyin: "kě yǐ dǎ bāo ma?", en: "Can I get this to go?" },
  { id: "phrase-9", hanzi: "少冰，謝謝。", pinyin: "shǎo bīng, xiè xie.", en: "Less ice, thanks." },
  { id: "phrase-10", hanzi: "慢慢逛。", pinyin: "màn màn guàng.", en: "Take your time browsing." },
  { id: "phrase-11", hanzi: "下次再來。", pinyin: "xià cì zài lái.", en: "I'll come again next time." },
];

export const GLOSSARY: GlossaryData = {
  food: CHINESE_FOOD,
  words: COMMON_WORDS,
  phrases: COMMON_PHRASES,
};
