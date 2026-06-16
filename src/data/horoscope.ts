export interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  dateRange: string;
  element: string;
  color: string;
}

export interface ZodiacFortune {
  overall: string;
  love: string;
  career: string;
  wealth: string;
  health: string;
  luckyColor: string;
  luckyNumber: number;
}

export const zodiacSigns: ZodiacSign[] = [
  { id: 'aries', name: '白羊座', symbol: '♈', dateRange: '3/21 - 4/19', element: '火', color: 'from-red-500 to-orange-500' },
  { id: 'taurus', name: '金牛座', symbol: '♉', dateRange: '4/20 - 5/20', element: '土', color: 'from-green-500 to-emerald-600' },
  { id: 'gemini', name: '双子座', symbol: '♊', dateRange: '5/21 - 6/21', element: '风', color: 'from-yellow-400 to-amber-500' },
  { id: 'cancer', name: '巨蟹座', symbol: '♋', dateRange: '6/22 - 7/22', element: '水', color: 'from-slate-400 to-blue-500' },
  { id: 'leo', name: '狮子座', symbol: '♌', dateRange: '7/23 - 8/22', element: '火', color: 'from-orange-500 to-yellow-500' },
  { id: 'virgo', name: '处女座', symbol: '♍', dateRange: '8/23 - 9/22', element: '土', color: 'from-teal-500 to-green-600' },
  { id: 'libra', name: '天秤座', symbol: '♎', dateRange: '9/23 - 10/23', element: '风', color: 'from-pink-400 to-rose-500' },
  { id: 'scorpio', name: '天蝎座', symbol: '♏', dateRange: '10/24 - 11/22', element: '水', color: 'from-red-700 to-purple-800' },
  { id: 'sagittarius', name: '射手座', symbol: '♐', dateRange: '11/23 - 12/21', element: '火', color: 'from-purple-500 to-indigo-600' },
  { id: 'capricorn', name: '摩羯座', symbol: '♑', dateRange: '12/22 - 1/19', element: '土', color: 'from-gray-600 to-slate-800' },
  { id: 'aquarius', name: '水瓶座', symbol: '♒', dateRange: '1/20 - 2/18', element: '风', color: 'from-cyan-400 to-blue-600' },
  { id: 'pisces', name: '双鱼座', symbol: '♓', dateRange: '2/19 - 3/20', element: '水', color: 'from-indigo-400 to-purple-600' },
];

const fortuneTemplates: Record<string, ZodiacFortune[]> = {
  aries: [
    { overall: '今天充满活力，适合主动出击。你的热情和决断力将为你赢得先机，但也要注意控制冲动，避免因急躁而做出后悔的决定。', love: '感情中需要多些耐心，给对方一些空间。单身者可能在不经意间遇到心动的对象。', career: '工作上有展现领导力的机会，大胆表达自己的想法会获得认可。', wealth: '财运活跃，但不宜冲动消费，做好预算再出手。', health: '精力旺盛但注意不要过度消耗，适度运动即可。', luckyColor: '红色', luckyNumber: 7 },
    { overall: '今日运势稳中有升，之前的努力开始看到回报。保持积极的心态，好事自然而来。', love: '有伴者感情升温，单身者桃花运暗涌，留意身边人。', career: '工作节奏较快，抓住重点才能高效完成。', wealth: '正财稳定，偏财需谨慎，不宜跟风投资。', health: '注意头部和面部的保养，避免熬夜。', luckyColor: '金色', luckyNumber: 3 },
  ],
  taurus: [
    { overall: '今天适合稳扎稳打，脚踏实地的态度会带来可靠的结果。享受生活中的小确幸，不要急于求成。', love: '感情稳定温馨，和伴侣一起做些日常小事也是一种幸福。单身者适合慢慢来。', career: '工作中细节决定成败，认真对待每个环节。', wealth: '财运平稳，适合储蓄和稳健理财。', health: '注意饮食健康，避免暴饮暴食。', luckyColor: '绿色', luckyNumber: 6 },
    { overall: '今日直觉敏锐，对美的感知力增强。适合处理与艺术、审美相关的事务，可能会有意想不到的收获。', love: '浪漫氛围浓厚，适合表白或安排约会。', career: '创意和审美能力突出，适合设计类工作。', wealth: '有意外收入的可能，但别太依赖。', health: '嗓子容易不适，多喝温水。', luckyColor: '粉色', luckyNumber: 2 },
  ],
  gemini: [
    { overall: '今天思维活跃，沟通能力出色。适合社交、谈判和表达自己的想法，你的灵活变通会成为优势。', love: '桃花运不错，社交场合可能遇到有趣的灵魂。有伴者需要多一些深度交流。', career: '信息灵通的一天，善于捕捉机会，工作效率高。', wealth: '偏财运不错，可能有额外收入渠道。', health: '注意呼吸系统健康，保持室内空气流通。', luckyColor: '黄色', luckyNumber: 5 },
    { overall: '好奇心旺盛的一天，学习新事物的效率很高。但要注意专注，避免同时进行太多事情。', love: '新鲜感很重要，但也要记得关心身边人的感受。', career: '适合学习新技能，拓展知识面。', wealth: '财运一般，避免频繁更换投资方向。', health: '注意手臂和肩膀的保养，适当伸展。', luckyColor: '天蓝色', luckyNumber: 9 },
  ],
  cancer: [
    { overall: '今天情感丰富，直觉力强。关注家庭和内心需求，给自己一些温暖的关怀，你会感受到安全和满足。', love: '家庭氛围和谐，和家人的互动带来温馨。有伴者适合一起做家务或居家活动。', career: '工作中注重团队协作，你的关怀让同事感到温暖。', wealth: '家庭相关开支需注意，但也会有意料之外的小收入。', health: '胃部需要特别呵护，饮食宜清淡规律。', luckyColor: '银色', luckyNumber: 2 },
    { overall: '情绪起伏较大，但这也是灵感涌现的时候。用创造力来表达内心，艺术创作会有好成果。', love: '内心敏感的一天，需要对方的理解和支持。', career: '适合做创意性工作，直觉会给你好方向。', wealth: '财运平稳，适合居家理财。', health: '注意情绪对健康的影响，试试冥想。', luckyColor: '白色', luckyNumber: 8 },
  ],
  leo: [
    { overall: '今天气场全开，自信满满。你的魅力和影响力处于高峰，适合站在聚光灯下展示自己。', love: '魅力四射，容易成为焦点。单身者大胆表达心意，有伴者给对方一些惊喜。', career: '领导力突出，适合推动项目进展，你的号召力会感染他人。', wealth: '财运不错，但注意不要为了面子过度消费。', health: '心脏和背部需要关注，保持良好姿势。', luckyColor: '金色', luckyNumber: 1 },
    { overall: '创造力爆表的一天，你有很多新奇的想法。但要注意取舍，集中精力在最重要的目标上。', love: '热情似火，但也要考虑对方的感受和节奏。', career: '创意获得认可，适合展示方案和提案。', wealth: '投资眼光独到，但量力而行。', health: '精力充沛，但别逞强，注意休息。', luckyColor: '橙色', luckyNumber: 4 },
  ],
  virgo: [
    { overall: '今天分析能力强，注重细节的态度会帮你发现问题并解决它们。是处理复杂事务的好时机。', love: '感情中需要放下完美主义，接受对方的不完美。单身者别太挑剔。', career: '工作态度严谨，细节处理出色，容易获得上级好评。', wealth: '理财能力出众，适合整理财务和制定预算。', health: '消化系统需要关注，饮食注意卫生和规律。', luckyColor: '墨绿色', luckyNumber: 5 },
    { overall: '条理性极强的一天，适合整理和规划。把混乱的事务理清楚，会带来内心的安定和满足。', love: '用行动表达关心比言语更有效。', career: '适合做审计、检查类工作，眼光精准。', wealth: '精打细算的日子，能省则省。', health: '适合开始新的健康习惯，从小事做起。', luckyColor: '米色', luckyNumber: 7 },
  ],
  libra: [
    { overall: '今天审美能力出众，人际关系和谐。适合社交活动、谈判协商，你的优雅和公正会赢得好感。', love: '桃花运旺盛，身边充满浪漫气息。有伴者感情甜蜜，适合一起参加社交活动。', career: '合作关系良好，团队中发挥协调作用，获得双赢局面。', wealth: '财运平稳，合作项目可能带来收益。', health: '注意腰部和肾脏保养，多喝水。', luckyColor: '粉色', luckyNumber: 6 },
    { overall: '选择困难可能出现，但相信自己的审美和判断。做决定后不要反复纠结。', love: '面临感情抉择时，跟随内心的声音。', career: '需要做出取舍，优柔寡断反而误事。', wealth: '收支基本平衡，别为小事纠结。', health: '保持身心平衡，瑜伽和散步是好选择。', luckyColor: '淡蓝色', luckyNumber: 3 },
  ],
  scorpio: [
    { overall: '今天洞察力极强，能看透事物本质。适合深入研究和调查，但要注意不要过于多疑。', love: '感情中需要信任，放下猜疑才能获得真心。单身者可能遇到神秘有魅力的人。', career: '适合处理棘手问题，你的洞察力帮你找到关键突破口。', wealth: '偏财运不错，可能发现隐藏的赚钱机会。', health: '注意生殖系统和排毒，多喝水帮助代谢。', luckyColor: '暗红色', luckyNumber: 9 },
    { overall: '意志力坚定的一天，你有能力完成看似困难的事情。掌控局面的同时也要学会放手。', love: '占有欲需要适度控制，给彼此留有空间。', career: '目标明确，执行力强，适合攻克难关。', wealth: '财运看涨，适合长线投资。', health: '注意休息，别把自己逼太紧。', luckyColor: '黑色', luckyNumber: 0 },
  ],
  sagittarius: [
    { overall: '今天充满冒险精神，乐观开朗的态度带来好运。适合出行、探索新领域，你的自由和热情感染周围的人。', love: '自由奔放的一天，适合和伴侣一起尝试新鲜事物。单身者可能在旅途中遇到缘分。', career: '视野开阔，适合规划和展望未来，国际化事务有利。', wealth: '财运活跃，但不要过于冒险。', health: '注意大腿和肝脏，运动前做好热身。', luckyColor: '紫色', luckyNumber: 3 },
    { overall: '求知欲旺盛，适合学习异国文化或哲学。开放的心态会带来意想不到的收获。', love: '异地缘分可能出现，保持开放心态。', career: '适合学习进修，知识就是你的财富。', wealth: '投资眼光长远，别被短期波动影响。', health: '注意出行安全，避免冒险运动。', luckyColor: '深蓝色', luckyNumber: 8 },
  ],
  capricorn: [
    { overall: '今天目标明确，执行力强。你务实认真的态度会被看见和认可，适合推进重要项目。', love: '感情中用行动说话，靠谱的陪伴比甜言蜜语更打动人心。', career: '工作表现沉稳可靠，有望获得上级的信任和重要任务。', wealth: '财运稳健上升，长期投资会有回报。', health: '注意膝盖和骨骼保养，避免久站久坐。', luckyColor: '棕色', luckyNumber: 8 },
    { overall: '责任感强的一天，但也要注意劳逸结合。过度紧绷反而降低效率，适度放松很有必要。', love: '工作虽忙，也别忽视伴侣的感受，一条关心的消息就很温暖。', career: '压力可能较大，但你的坚持终将带来成果。', wealth: '适合制定长期财务计划，不宜冒进。', health: '关节和皮肤需要关注，注意保湿。', luckyColor: '灰色', luckyNumber: 4 },
  ],
  aquarius: [
    { overall: '今天创新思维活跃，特立独行的想法可能成为突破口。保持你的独特视角，不走寻常路。', love: '友谊可能升华为爱情，留意身边的好友。有伴者尝试新的相处模式会增添新鲜感。', career: '创新方案获得认可，在团队中成为不可替代的角色。', wealth: '财运起伏，但新的理财方式值得尝试。', health: '注意小腿和循环系统，多走动促进血液循环。', luckyColor: '电光蓝', luckyNumber: 4 },
    { overall: '社交运势强劲，朋友中的关键人物可能为你带来重要机会。保持开放，别太固执己见。', love: '朋友圈中有缘分暗藏，留意社交场合。', career: '团队合作比单打独斗更有效，倾听不同声音。', wealth: '有新的收入渠道，但需要时间验证。', health: '神经系统需要放松，减少电子产品使用时间。', luckyColor: '银色', luckyNumber: 7 },
  ],
  pisces: [
    { overall: '今天直觉力和同理心极强，艺术灵感涌现。适合创作、冥想和精神层面的活动，感受内心的指引。', love: '浪漫细胞活跃，容易沉浸在感情的美好中。注意保持现实感，别迷失在幻想里。', career: '创意和艺术相关的工作会有出色表现，直觉帮你找到灵感。', wealth: '财运感性，跟随直觉但也要理性判断。', health: '注意足部和睡眠质量，泡脚有助放松。', luckyColor: '海蓝色', luckyNumber: 7 },
    { overall: '梦境可能带来启示，留意潜意识传达的信息。创作和灵修会有好的成果。', love: '对感情有美好的憧憬，但也要面对现实。单身者留意梦中情人的原型。', career: '适合从事艺术、疗愈、心理咨询类工作。', wealth: '不宜做重大财务决定，先观察再说。', health: '容易疲劳，给自己充足的休息时间。', luckyColor: '薰衣草紫', luckyNumber: 2 },
  ],
};

function getDailySeed(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return year * 10000 + month * 100 + day;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export function getDailyFortune(signId: string): ZodiacFortune {
  const templates = fortuneTemplates[signId];
  if (!templates || templates.length === 0) {
    return {
      overall: '今日运势平稳，保持平常心即可。',
      love: '感情方面没有太大波动。',
      career: '工作按部就班进行。',
      wealth: '财运平稳。',
      health: '注意身体健康。',
      luckyColor: '白色',
      luckyNumber: 0,
    };
  }

  const seed = getDailySeed();
  const signIndex = zodiacSigns.findIndex((s) => s.id === signId);
  const index = Math.floor(seededRandom(seed + signIndex * 137) * templates.length);
  return templates[index];
}
