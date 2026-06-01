// 广州咖啡店数据
// 添加新店只需在 coffeeShops 数组末尾追加即可

const coffeeShops = [
    {
        id: "jpg-coffee",
        name: "JPG Coffee",
        area: "天河",
        district: "体育西",
        address: "天河区体育西路天河街54号",
        lat: 23.1359,
        lng: 113.3274,
        tags: ["精品手冲", "自烘焙", "安静办公"],
        priceRange: "¥30-50",
        rating: 4.5,
        recommendation: "广州精品咖啡的标杆之一，dirty是招牌。豆子自烘，品质稳定，适合真正想喝好咖啡的人。",
        highlights: ["dirty", "手冲单品"],
        hours: "周一至周日 08:00-20:00",
        metro: "体育西路站 B 出口步行 3 分钟",
        features: { wifi: true, powerOutlets: true, petFriendly: false, outdoor: false, dessert: false, parking: false },
        createdAt: "2026-01-01",
        updatedAt: "2026-06-01"
    },
    {
        id: "hasty-coffee",
        name: "急急脚咖啡公司",
        area: "越秀",
        district: "东山口",
        address: "越秀区庙前西街13号",
        lat: 23.1287,
        lng: 113.2824,
        tags: ["创意特调", "独栋老宅", "拍照打卡"],
        priceRange: "¥25-40",
        rating: 4.5,
        recommendation: "东山口必去的咖啡店，独栋红砖老宅改造，出片率极高。特调系列有惊喜，每次来都有新花样。",
        highlights: ["创意特调", "dirty"],
        hours: "周一至周日 09:30-21:00",
        metro: "东山口站 E 出口步行 5 分钟",
        features: { wifi: true, powerOutlets: false, petFriendly: true, outdoor: true, dessert: true, parking: false },
        createdAt: "2026-01-15",
        updatedAt: "2026-06-01"
    },
    {
        id: "laiohu-coffee",
        name: "来回咖啡",
        area: "天河",
        district: "天河南",
        address: "天河区天河南一路六运小区内",
        lat: 23.1312,
        lng: 113.3245,
        tags: ["社区小店", "意式经典", "一人独享"],
        priceRange: "¥20-35",
        rating: 4.0,
        recommendation: "六运小区里的宝藏小店，空间不大但氛围很好。意式出品稳定，适合周末一个人来坐坐。",
        highlights: ["拿铁", "美式"],
        hours: "周一至周日 09:00-19:00",
        metro: "体育西路站 A 出口步行 8 分钟",
        features: { wifi: true, powerOutlets: true, petFriendly: false, outdoor: false, dessert: false, parking: false },
        createdAt: "2026-02-01",
        updatedAt: "2026-06-01"
    },
    {
        id: "yuyuan-coffee",
        name: "郁源咖啡",
        area: "越秀",
        district: "东山口",
        address: "越秀区龟岗大马路东山大街1号",
        lat: 23.1275,
        lng: 113.2856,
        tags: ["自烘焙", "精品手冲", "社区小店"],
        priceRange: "¥25-45",
        rating: 4.5,
        recommendation: "广州咖啡老炮的据点，自烘豆品质一流。老板很聊得来，能学到不少咖啡知识。",
        highlights: ["手冲单品", "自烘豆"],
        hours: "周一至周六 10:00-18:00",
        metro: "东山口站 F 出口步行 6 分钟",
        features: { wifi: true, powerOutlets: false, petFriendly: false, outdoor: false, dessert: false, parking: false },
        createdAt: "2026-02-15",
        updatedAt: "2026-06-01"
    },
    {
        id: "sixu-coffee",
        name: "四序咖啡",
        area: "海珠",
        district: "晓港",
        address: "海珠区前进路晓港中马路12号",
        lat: 23.0978,
        lng: 113.2756,
        tags: ["日式深烘", "一人独享", "安静办公"],
        priceRange: "¥30-50",
        rating: 4.0,
        recommendation: "广州少见的日式深烘专门店，法兰绒手冲很有仪式感。安静，适合带本书来消磨一个下午。",
        highlights: ["法兰绒手冲", "日式深烘"],
        hours: "周一至周日 10:00-20:00",
        metro: "晓港站 D 出口步行 4 分钟",
        features: { wifi: true, powerOutlets: true, petFriendly: false, outdoor: false, dessert: true, parking: false },
        createdAt: "2026-03-01",
        updatedAt: "2026-06-01"
    },
    {
        id: "wupai-coffee",
        name: "无牌咖啡",
        area: "荔湾",
        district: "永庆坊",
        address: "荔湾区恩宁路永庆坊内",
        lat: 23.1156,
        lng: 113.2478,
        tags: ["创意特调", "独栋老宅", "拍照打卡", "朋友聚会"],
        priceRange: "¥25-45",
        rating: 4.5,
        recommendation: "永庆坊里的西关风情咖啡，骑楼老宅改造得很有味道。特调融入了广州元素，值得一试。",
        highlights: ["凉茶特调", "西关dirty"],
        hours: "周一至周日 10:00-22:00",
        metro: "黄沙站 B 出口步行 10 分钟",
        features: { wifi: true, powerOutlets: false, petFriendly: true, outdoor: true, dessert: true, parking: false },
        createdAt: "2026-03-15",
        updatedAt: "2026-06-01"
    },
    {
        id: "meigui-coffee",
        name: "玫瑰咖啡",
        area: "越秀",
        district: "淘金",
        address: "越秀区环市东路淘金路48号",
        lat: 23.1402,
        lng: 113.2812,
        tags: ["社区小店", "意式经典", "一人独享"],
        priceRange: "¥20-35",
        rating: 3.5,
        recommendation: "淘金路的老牌社区咖啡，开了很多年，品质一直在线。适合不想折腾、只想喝杯好咖啡的时候来。",
        highlights: ["拿铁", "卡布奇诺"],
        hours: "周一至周日 08:30-19:30",
        metro: "淘金站 A 出口步行 2 分钟",
        features: { wifi: true, powerOutlets: true, petFriendly: false, outdoor: false, dessert: true, parking: false },
        createdAt: "2026-04-01",
        updatedAt: "2026-06-01"
    },
    {
        id: "store-by-.jpg",
        name: "Store by .jpg",
        area: "天河",
        district: "珠江新城",
        address: "天河区华就路12号",
        lat: 23.1178,
        lng: 113.3198,
        tags: ["精品手冲", "创意特调", "澳式风格", "朋友聚会"],
        priceRange: "¥35-55",
        rating: 4.5,
        recommendation: "广州最会做特调的咖啡店之一，每季新品都值得期待。空间设计感强，适合约朋友来聊天。",
        highlights: ["季节特调", "flat white"],
        hours: "周一至周日 09:00-21:00",
        metro: "珠江新城站 A1 出口步行 5 分钟",
        features: { wifi: true, powerOutlets: true, petFriendly: false, outdoor: false, dessert: true, parking: false },
        createdAt: "2026-04-15",
        updatedAt: "2026-06-01"
    }
];

// 区域定义
const AREAS = [
    { name: "天河", description: "CBD核心区，精品咖啡密度最高" },
    { name: "越秀", description: "老城区新活力，独立咖啡馆扎堆" },
    { name: "海珠", description: "文艺气息浓厚，隐藏宝藏多" },
    { name: "荔湾", description: "西关风情与咖啡的碰撞" },
    { name: "白云", description: "新兴咖啡势力" },
    { name: "番禺", description: "大学城周边年轻氛围" },
];

// 标签分类
const TAG_CATEGORIES = [
    {
        name: "咖啡风格",
        tags: ["精品手冲", "意式经典", "创意特调", "日式深烘", "澳式风格", "自烘焙"]
    },
    {
        name: "空间氛围",
        tags: ["工业风", "日式简约", "复古怀旧", "独栋老宅", "社区小店", "拍照打卡"]
    },
    {
        name: "场景适配",
        tags: ["安静办公", "朋友聚会", "一人独享", "约会首选", "宠物友好", "深夜营业"]
    },
];

// 卡片背景色（给没有图片的店铺用）
const CARD_COLORS = [
    "linear-gradient(135deg, #E8E0D4 0%, #C4B9A8 100%)",
    "linear-gradient(135deg, #E8EFF6 0%, #A8C4D8 100%)",
    "linear-gradient(135deg, #E8EDE3 0%, #B8C8A8 100%)",
    "linear-gradient(135deg, #F5EDD8 0%, #D4C4A0 100%)",
    "linear-gradient(135deg, #F8E8E2 0%, #D8B8A8 100%)",
    "linear-gradient(135deg, #EDE8F0 0%, #C4B8D0 100%)",
    "linear-gradient(135deg, #F0EDE8 0%, #D0C8B8 100%)",
    "linear-gradient(135deg, #E5EBE8 0%, #B8CCC0 100%)",
];
