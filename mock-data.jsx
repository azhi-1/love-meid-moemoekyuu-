// Mock data for 秋叶原冥途战争 BBS
const MOCK_DATA = {
  system: {
    date: "2026-04-28",
    time: "11:14",
    location: "秋叶原・中央通り"
  },

  organizations: {
    "とんとことん（豚豚亭）": {
      territory: "秋叶原駅東側・電気街口〜中央通り",
      status: "⚔ 与「メイドリーミン」交战中"
    },
    "メイドリーミン": {
      territory: "秋叶原駅西側・昭和通り〜末広町",
      status: "🛡 防御态势・招募新人中"
    },
    "ケバブマフィア": {
      territory: "秋叶原UDX周辺・裏路地",
      status: "🔍 暗中观察・伺机而动"
    }
  },

  characters: {
    "なごみ（和）": {
      organization: "とんとことん",
      rank: "新人女仆",
      affection: 45,
      relation: "朋友",
      location: "豚豚亭・厨房"
    },
    "嵐子（ランコ）": {
      organization: "とんとことん",
      rank: "No.1女仆",
      affection: 62,
      relation: "挚友",
      location: "秋叶原・中央通り巡回中"
    },
    "しおん（紫苑）": {
      organization: "メイドリーミン",
      rank: "干部",
      affection: 18,
      relation: "陌生人",
      location: "メイドリーミン本店・VIP室"
    },
    "ネルラ": {
      organization: "ケバブマフィア",
      rank: "情报屋",
      affection: 33,
      relation: "相识",
      location: "秋叶原UDX・屋台前"
    }
  },

  posts: [
    {
      id: 1,
      type: "character_post",
      author: "嵐子（ランコ）",
      color: "#D9773E",
      rank: "No.1女仆",
      timestamp: "2026-04-28 10:58",
      location: "秋叶原・中央通り",
      content: "今天在中央通り发传单的时候，看到メイドリーミン那边的人也在拉客…空气突然变得剑拔弩张。不过身为No.1，绝对不能让步。这条街是我们豚豚亭的地盘。\n\n传单发完之后去便利店买了布丁，嵐子大胜利。",
      trajectory: ["豚豚亭", "中央通り", "ローソン秋叶原店"],
      replies: [
        {
          author: "なごみ（和）",
          content: "ランコ前辈好帅！请也给我带一个布丁！🍮",
          color: "#7EB8DA"
        }
      ]
    },
    {
      id: 2,
      type: "news_post",
      author: "系统播报",
      color: "#E5C07B",
      rank: "SYSTEM",
      timestamp: "2026-04-28 09:30",
      location: "秋叶原全域",
      content: "【速报】昨夜，位于末広町的「メイドカフェぴゅあはーと」宣布闭店。据内部消息，该店铺疑似因卷入势力纷争而被迫关门。目前，其原有地盘已成为各方争夺的焦点。",
      trajectory: [],
      replies: [
        {
          author: "ネルラ",
          content: "啊啦，又一家倒下了呢。这条街可真是不温柔啊。",
          color: "#C678DD"
        },
        {
          author: "嵐子（ランコ）",
          content: "弱肉强食，这就是秋叶原的规矩。",
          color: "#D9773E"
        }
      ]
    },
    {
      id: 3,
      type: "character_post",
      author: "ネルラ",
      color: "#C678DD",
      rank: "情报屋",
      timestamp: "2026-04-28 08:15",
      location: "秋叶原UDX・屋台前",
      content: "一边烤着kebab一边听到了有趣的情报。据说有个新的组织打算进入秋叶原…名字好像叫什么「ワンダーメイド」？\n\n情报的价格嘛…一串kebab就好啦♪",
      trajectory: ["ケバブ屋台", "秋叶原UDX"],
      replies: []
    }
  ]
};

window.MOCK_DATA = MOCK_DATA;
