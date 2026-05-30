// ★1〜★16 レアリティ体系（app.js v3 完全移植）
export const RARITY_TIERS_ORDER = [
  "★1","★2","★3","★4","★5","★6","★7","★8",
  "★9","★10","★11","★12","★13","★14","★15","★16",
] as const;

export type RarityTier =
  | "★1" | "★2" | "★3" | "★4" | "★5" | "★6" | "★7" | "★8"
  | "★9" | "★10" | "★11" | "★12" | "★13" | "★14" | "★15" | "★16";

export interface RarityDef {
  stars: number;
  exp: number;
  weight: number;
  color: string;
  label: string;
  tier: number;
  displayName: string;
}

export const RARITY: Record<RarityTier, RarityDef> = {
  "★1":  { stars:1,  exp:1,    weight:100.0, color:"#9aa8b5", label:"★1",  tier:1,  displayName:"拾級" },
  "★2":  { stars:2,  exp:2,    weight:60.0,  color:"#83b8d6", label:"★2",  tier:2,  displayName:"拾級" },
  "★3":  { stars:3,  exp:4,    weight:40.0,  color:"#6ba6c7", label:"★3",  tier:3,  displayName:"五級" },
  "★4":  { stars:4,  exp:8,    weight:28.0,  color:"#5b8be0", label:"★4",  tier:4,  displayName:"五級" },
  "★5":  { stars:5,  exp:15,   weight:20.0,  color:"#5b78c8", label:"★5",  tier:5,  displayName:"三級" },
  "★6":  { stars:6,  exp:25,   weight:15.0,  color:"#6a82c8", label:"★6",  tier:6,  displayName:"三級" },
  "★7":  { stars:7,  exp:40,   weight:11.0,  color:"#7a6cc4", label:"★7",  tier:7,  displayName:"一級" },
  "★8":  { stars:8,  exp:65,   weight:8.0,   color:"#8c74cc", label:"★8",  tier:8,  displayName:"一級" },
  "★9":  { stars:9,  exp:100,  weight:6.0,   color:"#9b7ad0", label:"★9",  tier:9,  displayName:"一級" },
  "★10": { stars:10, exp:160,  weight:4.5,   color:"#ad88d6", label:"★10", tier:10, displayName:"初段" },
  "★11": { stars:11, exp:250,  weight:3.5,   color:"#c89ae8", label:"★11", tier:11, displayName:"初段" },
  "★12": { stars:12, exp:400,  weight:2.5,   color:"#d8a8e8", label:"★12", tier:12, displayName:"初段" },
  "★13": { stars:13, exp:650,  weight:1.8,   color:"#e0b3d8", label:"★13", tier:13, displayName:"拾段" },
  "★14": { stars:14, exp:1000, weight:1.2,   color:"#ecc1d4", label:"★14", tier:14, displayName:"拾段" },
  "★15": { stars:15, exp:1700, weight:0.6,   color:"#f0c8a8", label:"★15", tier:15, displayName:"拾段" },
  "★16": { stars:16, exp:3000, weight:0.15,  color:"#f0d48a", label:"★16", tier:16, displayName:"拾段" },
};

// レベルに応じた ★ 解放
export const UNLOCK_LV: Record<RarityTier, number> = {
  "★1":1, "★2":3, "★3":6, "★4":10, "★5":14,
  "★6":18, "★7":24, "★8":32, "★9":42, "★10":55,
  "★11":70, "★12":90, "★13":115, "★14":145, "★15":180, "★16":220
};

// 書体進化段階（15段階）
export const EVO_STAGES = [
  { minLv: 0,       name: "楷書",   glyph: "",   cssClass: "evo-kai"     },
  { minLv: 10,      name: "行書",   glyph: "✦",  cssClass: "evo-gyo"     },
  { minLv: 30,      name: "草書",   glyph: "✧",  cssClass: "evo-sou"     },
  { minLv: 70,      name: "篆書",   glyph: "✩",  cssClass: "evo-tens"    },
  { minLv: 150,     name: "甲骨",   glyph: "☆",  cssClass: "evo-kou"     },
  { minLv: 300,     name: "神代文字", glyph: "✯", cssClass: "evo-shin"    },
  { minLv: 600,     name: "超越",   glyph: "✪",  cssClass: "evo-choetsu" },
  { minLv: 1000,    name: "星屑",   glyph: "❂",  cssClass: "evo-hoshi"   },
  { minLv: 2000,    name: "神話",   glyph: "✺",  cssClass: "evo-shinwa"  },
  { minLv: 5000,    name: "創造主", glyph: "✹",  cssClass: "evo-sozo"    },
  { minLv: 10000,   name: "永劫",   glyph: "𓂀",  cssClass: "evo-eigou"   },
  { minLv: 30000,   name: "無始",   glyph: "𓁹",  cssClass: "evo-mushi"   },
  { minLv: 100000,  name: "虚無",   glyph: "𒀭",  cssClass: "evo-kyomu"   },
  { minLv: 300000,  name: "永遠",   glyph: "☥",  cssClass: "evo-eien"    },
  { minLv: 1000000, name: "∞",      glyph: "∞",  cssClass: "evo-mugen"   },
];

export function getEvoStage(lv: number) {
  let stage = EVO_STAGES[0];
  for (const s of EVO_STAGES) {
    if (lv >= s.minLv) stage = s;
    else break;
  }
  return stage;
}

// レアリティ加重ランダム選択（解放済みの中から）
export function rollRarity(playerLv: number): RarityTier {
  const available = (Object.keys(RARITY) as RarityTier[]).filter(
    (r) => playerLv >= UNLOCK_LV[r]
  );
  const weights = available.map((r) => RARITY[r].weight);
  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (let i = 0; i < available.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return available[i];
  }
  return available[0];
}

// ===== 漢字辞書（スターターセット） =====
export interface KanjiEntry {
  c: string;         // 文字
  rarity: RarityTier;
  tags?: string[];
}

// ★1 ひらがな
const HIRAGANA = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん";
// ★2 カタカナ
const KATAKANA = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
// ★3 数字
const NUMBERS = "０１２３４５６７８９";
// ★4 英語
const ENGLISH = "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ";
// ★5 ローマ数字
const ROMAN = "ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫⅬⅭⅮⅯ";
// ★6 小1漢字
const G1 = "一二三四五六七八九十百千万日月火水木金土山川田人口年大中小上下左右出入立休学先生花草虫貝石空雨雪風雲森林目耳手足力気本文字";
// ★7 小2漢字
const G2 = "引羽雲遠何科夏家歌画回会海絵外角活間丸岩記帰弓牛魚京強教近兄形計元原語光公広交光合国黒今才作算止市思紙寺時自室社弱首秋週春書少場色食心新親図数声西切雪線船前組走多太体台地池知茶昼長鳥朝直通弟店点電刀冬当東道読南肉馬買麦半番父風分聞米歩母方北妹毎万明鳴毛門夜野友曜来里理話";
// ★8 小3漢字
const G3 = "悪安暗医委意育員院飲運泳駅央横屋温化荷界開階寒感漢館岸期起客宮急究級去橋業局曲局銀区苦具君係軽血決研県庫湖向幸港号根祭皿仕使始指死詩次事持式実写者主守取酒受州拾終習集住重宿所暑助勝商消章乗植申身進深真神整世全想相速族他打対待代題炭短談着注柱丁帳調追定庭鉄転都度投島湯登等動童農波配倍箱畑発反坂板悲鼻筆氷表秒品負部服福物平返勉放味命面問役薬由油有遊予様葉陽落流旅両緑礼列練路和";
// ★9 小4漢字
const G4 = "愛案以衣位囲胃印英栄塩億加果貨課芽改械害街各覚完官観関願希季旗機議求泣救給挙漁共協鏡競極訓軍郡型径景芸欠結健建験固功好候航康告差最菜材昨刷察参散産残士氏試児失借種周祝順初松笑唱焼象照賞臣信成省清静席積折節説戦浅選然争倉巣束側続卒孫帯隊達単置仲貯兆腸低底停的典伝徒努灯堂働特得毒熱念敗梅博飛費必票標不付府富副別辺変便法望牧末満未脈民無約勇要養浴利陸良料量輪類令冷例歴連老労録";
// ★10 小5漢字
const G5 = "圧移因永営衛易益液演応往恩可仮価河過賀解格確額刊幹感慣眼基寄規喜技義逆久旧居許境興均禁句型敬経潔件険検限現個護効厚耕航鉱構興降告混査再妻採際在財罪雑酸支志枝師資飼示識質舎謝授収宗証情織職制精責接税設絶祖素総造像則測属率損退貸態団断築張停提程適統銅導徳独任燃能破判版比肥非備評富布婦武復複仏編弁保墓報豊貿防牧眷又余預容率略領";
// ★11 小6漢字
const G6 = "異遺域宇映延沿我灰拡革閣割株干巻看危機揮貴疑吸供胸郷勤筋系敬警劇激穴絹権憲源厳己誤后孝皇紅降鋼刻穀骨困砂座済裁策冊蚕至私姿視詞誌磁射捨尺若樹収宗就衆従縦縮熟純処諸除将傷障城蒸針仁垂推寸盛聖誠舌宣専泉洗染善奏窓創装層操蔵臓存尊宅担探誕段暖値宙忠著庁頂潮賃痛展党糖討謄届納脳派俳拝背肺班晩否批秘腹奮並陛閉片補暮宝訪亡忘棒枚幕密盟模訳優幼欲翌乱卵覧裏律臨朗論";

// ★12-16 精選文字（拾段、神字級）
const MYTHIC = "慈悲謙虚勤勉節制忍耐寛大純潔傲慢怠惰嫉妬憤怒強欲色欲暴食静謐幽玄侘寂禅定蒼穹刹那空無寂寥菩薩仏陀聖人極道魂魄悟道極意真髄奥義秘伝凛然";

function toEntries(chars: string, rarity: RarityTier, tags: string[] = []): KanjiEntry[] {
  // dedupe: split to unique chars
  const unique = [...new Set(chars.split(""))].filter(c => c.trim().length > 0);
  return unique.map(c => ({ c, rarity, tags }));
}

export const KANJI_CODEX: KanjiEntry[] = [
  ...toEntries(HIRAGANA, "★1", ["ひらがな", "音"]),
  ...toEntries(KATAKANA, "★2", ["カタカナ", "音"]),
  ...toEntries(NUMBERS,  "★3", ["数字", "数", "順序"]),
  ...toEntries(ENGLISH,  "★4", ["英語", "異邦"]),
  ...toEntries(ROMAN,    "★5", ["順序", "ローマ"]),
  ...toEntries(G1, "★6",  ["小一漢字", "学"]),
  ...toEntries(G2, "★7",  ["小二漢字", "学"]),
  ...toEntries(G3, "★8",  ["小三漢字", "学"]),
  ...toEntries(G4, "★9",  ["小四漢字", "学"]),
  ...toEntries(G5, "★10", ["小五漢字", "学"]),
  ...toEntries(G6, "★11", ["小六漢字", "学"]),
  ...toEntries("亜哀握偉違縁汚翁奇棋鬼詰脚驚桑勲薫傾肩賢弦孤誇顧ご互汗環甘監緩肝艦貫鑑閑陥含", "★12", ["中学漢字", "学"]),
  ...toEntries("把派破婆廃排敗杯肺輩配倍媒梅買売賠伯博拍泊薄迫縛麦肌発髪伐罰閥帆搬板版犯班繁般販範煩飯晩番盤蛮卑妃彼悲扉批比泌疲皮碑秘罷肥被費避非飛尾微筆病品浜貧賓頻敏瓶", "★13", ["高校漢字", "学"]),
  ...toEntries("蒼澪凛凪桜陽暖咲悠遥碧瑞穂葵彩奏結愛叶優琴颯翔陸隼龍翼匠武虎獅鷹誠忠仁智義礼信和泰寛望輝侑楓椿桂蓮蘭菊牡丹百合雲霞露雫霜霧滴渚潮汀波岬峰神祇玲燦煌爛叡睿皓皚茜緋朱紅紺藍碧瑠璃麗艶寿福禄吉祥喜昌興盛栄亀鶴松竹梅剛毅勇豪雄壮凛勁強烈威", "★14", ["人名", "美", "自然"]),
  ...toEntries("万葉古今夜半暁朝霜露紅葉散桜雪舞風光世憂哀寂寞静閑夢幻儚泡沫永久遙梵菩提涅槃般若波羅阿弥陀薬師観音地蔵不動釈迦弥勒文殊普賢天照素戔嗚月読黄泉稲荷天神八幡春日侘寂幽玄居合残心型雅楽舞", "★15", ["古典", "文学", "仏教", "神道", "美"]),
  ...toEntries(MYTHIC, "★16", ["七徳", "七大罪", "禅", "神字", "拾段"]),
];

// 文字 → エントリ 逆引きMap
let _codexMap: Map<string, KanjiEntry> | null = null;
export function getKanjiEntry(c: string): KanjiEntry | undefined {
  if (!_codexMap) {
    _codexMap = new Map(KANJI_CODEX.map(e => [e.c, e]));
  }
  return _codexMap.get(c);
}

// プレイヤーレベルに応じた落下文字プール
export function getDropPool(playerLv: number): KanjiEntry[] {
  const maxTier = (Object.keys(UNLOCK_LV) as RarityTier[])
    .filter(r => playerLv >= UNLOCK_LV[r])
    .map(r => RARITY[r].tier)
    .reduce((a, b) => Math.max(a, b), 1);
  return KANJI_CODEX.filter(e => RARITY[e.rarity].tier <= maxTier);
}

// 落下1字をプールから加重選択
export function pickDropChar(pool: KanjiEntry[], playerLv: number): KanjiEntry {
  // 各エントリのレアリティウェイトで選ぶ
  const weights = pool.map(e => RARITY[e.rarity].weight);
  const total = weights.reduce((a, b) => a + b, 0);
  let rand = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    rand -= weights[i];
    if (rand <= 0) return pool[i];
  }
  return pool[0];
}
