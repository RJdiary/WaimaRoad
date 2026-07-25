// 外马路项目的演示数据。上线前可平移至云开发 collections。
var heritages = [
  { id: 1, _id: 'h001', title: '潮海关旧址', category: 'diplomacy', categoryName: '开埠外交', categoryEmoji: '⚓', emoji: '⚓', imgStyle: 'background:linear-gradient(135deg,#315B72,#173B4D)', location: '外马路西段', era: '1860年代', summary: '汕头开埠的重要见证，现为汕头海关关史陈列馆所在地。', detail: '潮海关旧址见证了汕头由海滨小埠走向通商口岸的历程。围绕海关形成的办公、公馆与宿舍建筑群，保存着近代汕头对外贸易、航运与城市治理的历史线索。', tags: ['开埠外交', '海关', '外马路'], views: '2.6k', favorites: 186, isAiRestored: false },
  { id: 2, _id: 'h002', title: '原日本台湾银行汕头支行旧址', category: 'diplomacy', categoryName: '开埠外交', categoryEmoji: '🏦', emoji: '🏦', imgStyle: 'background:linear-gradient(135deg,#557A95,#2F4E64)', location: '外马路', era: '近代', summary: '现为汕头开埠文化陈列馆，记录近代金融与开埠城市的发展。', detail: '这座建筑是近代汕头金融网络与国际贸易联系的实物见证。如今的开埠文化陈列馆，以丰富史料展现汕头开埠后的城市变迁。', tags: ['开埠外交', '金融', '陈列馆'], views: '1.8k', favorites: 128, isAiRestored: false },
  { id: 3, _id: 'h003', title: '汕头邮政总局大楼', category: 'commerce', categoryName: '侨乡商贸', categoryEmoji: '✉️', emoji: '✉️', imgStyle: 'background:linear-gradient(135deg,#B77A3A,#75451F)', location: '外马路', era: '1920年代', summary: '近代邮政通信枢纽，连接海外侨胞与潮汕故里。', detail: '汕头邮政总局大楼承载着侨批、书信与商贸信息的往来。它让远在海外的潮人能够与家乡保持联系，也串联起近代汕头的商业与移民网络。', tags: ['侨乡商贸', '侨批', '邮政'], views: '2.1k', favorites: 162, isAiRestored: false },
  { id: 4, _id: 'h004', title: '侨批文物馆', category: 'commerce', categoryName: '侨乡商贸', categoryEmoji: '📜', emoji: '📜', imgStyle: 'background:linear-gradient(135deg,#C89A57,#855C2D)', location: '外马路', era: '近代', summary: '原汕头侨批公会旧址，珍藏海内外潮人共同书写的家国记忆。', detail: '侨批兼具书信与汇款凭证功能，是潮汕华侨与家乡之间的情感纽带和经济纽带。馆内的侨批文物，记录了普通家庭跨海谋生、守望互助的故事。', tags: ['侨乡商贸', '侨批', '华侨'], views: '3.4k', favorites: 241, isAiRestored: false },
  { id: 5, _id: 'h005', title: '老妈宫与戏台', category: 'culture', categoryName: '文教宗教', categoryEmoji: '🎭', emoji: '🎭', imgStyle: 'background:linear-gradient(135deg,#6B5C8A,#42345C)', location: '外马路周边', era: '清代', summary: '妈祖信俗、潮剧演出与民间集会交汇的城市文化空间。', detail: '老妈宫是潮汕地区重要的妈祖信俗场所，戏台则承载着潮剧演出与社区公共生活。宗教、艺术与市井日常在这里叠合，构成老城鲜活的人文景观。', tags: ['文教宗教', '妈祖', '潮剧'], views: '2.9k', favorites: 216, isAiRestored: false },
  { id: 6, _id: 'h006', title: '聿怀中学堂旧址', category: 'culture', categoryName: '文教宗教', categoryEmoji: '📚', emoji: '📚', imgStyle: 'background:linear-gradient(135deg,#52765A,#294B35)', location: '外马路东段', era: '1877年', summary: '近代教育在汕头落地发展的重要印记。', detail: '聿怀中学堂旧址保存着近代新式教育的历史记忆。学校以教育启迪青年，也映照出开埠时期汕头社会观念与知识传播的变化。', tags: ['文教宗教', '教育', '聿怀'], views: '1.7k', favorites: 119, isAiRestored: false },
  { id: 7, _id: 'h007', title: '国民革命军东征军总指挥部旧址', category: 'red', categoryName: '红色革命', categoryEmoji: '⭐', emoji: '⭐', imgStyle: 'background:linear-gradient(135deg,#9C3942,#621D27)', location: '外马路', era: '1925年', summary: '东征军在汕头的革命活动遗址，现为汕头市革命历史博物馆。', detail: '旧址记录了国民革命军东征时期的重要活动。这里是理解近代汕头革命历史、回望革命者理想与行动的重要空间。', tags: ['红色革命', '东征', '革命博物馆'], views: '2.5k', favorites: 204, isAiRestored: false },
  { id: 8, _id: 'h008', title: '原汕头抗日胜利受降旧址', category: 'red', categoryName: '红色革命', categoryEmoji: '🕊️', emoji: '🕊️', imgStyle: 'background:linear-gradient(135deg,#7F3038,#46171D)', location: '外马路周边', era: '1945年', summary: '汕头抗战胜利的重要历史见证，现状与记忆共同构成城市的和平教育场景。', detail: '抗日战争胜利后，汕头受降相关历史在此留下印记。项目将结合史料、现状照片与 AI 辅助复原，呈现已不易辨识的历史空间。', tags: ['红色革命', '抗战', 'AI辅助复原'], views: '3.1k', favorites: 278, isAiRestored: true },
  { id: 9, _id: 'h009', title: '原英国驻汕头领事馆旧址', category: 'ai', categoryName: 'AI辅助复原', categoryEmoji: '✨', emoji: '✨', imgStyle: 'background:linear-gradient(135deg,#4C617A,#263A50)', location: '外马路周边', era: '已消失点位', summary: '根据史料与旧影像进行的 AI 辅助复原展示。', detail: '本复原图基于现有老照片、档案文字与街区环境素材生成，仅用于辅助理解历史空间。所有复原影像均应明确标注“AI辅助复原”。', tags: ['AI辅助复原', '开埠外交', '已消失点位'], views: '4.2k', favorites: 335, isAiRestored: true }
];

var routes = [
  { id: 'opening-port', _id: 'r001', name: '⚓ 开埠风云线', theme: '开埠外交', themeColor: 'blue', pointCount: 3, duration: 1.5, distance: 1.8, points: [1, 2, 3], description: '从潮海关出发，读懂汕头通商口岸的城市起点。' },
  { id: 'overseas-commerce', _id: 'r002', name: '✉️ 侨批商贸线', theme: '侨乡商贸', themeColor: 'gold', pointCount: 3, duration: 2, distance: 2.2, points: [1, 2, 3], description: '沿邮政与侨批的线索，走近潮人跨海联结。' },
  { id: 'culture-faith', _id: 'r003', name: '🎭 文教信俗线', theme: '文教宗教', themeColor: 'green', pointCount: 3, duration: 2, distance: 2.4, points: [1, 2, 3], description: '在宫庙、戏台与学堂之间感受老城日常。' },
  { id: 'red-memory', _id: 'r004', name: '⭐ 红色记忆线', theme: '红色革命', themeColor: 'red', pointCount: 3, duration: 1.5, distance: 1.6, points: [1, 2, 3], description: '追寻东征与抗战胜利的城市记忆。' }
];

var points = [
  { id: 1, routeId: 'opening-port', name: '潮海关旧址', lat: 23.3546, lng: 116.6884, summary: heritages[0].summary, heritageId: 1, status: 'current' },
  { id: 2, routeId: 'opening-port', name: '开埠文化陈列馆', lat: 23.3549, lng: 116.6901, summary: heritages[1].summary, heritageId: 2, status: 'pending' },
  { id: 3, routeId: 'opening-port', name: '原英国领事馆旧址', lat: 23.3553, lng: 116.6915, summary: heritages[8].summary, heritageId: 9, status: 'pending' },
  { id: 4, routeId: 'overseas-commerce', name: '汕头邮政总局大楼', lat: 23.3581, lng: 116.6923, summary: heritages[2].summary, heritageId: 3, status: 'current' },
  { id: 5, routeId: 'overseas-commerce', name: '侨批文物馆', lat: 23.3590, lng: 116.6934, summary: heritages[3].summary, heritageId: 4, status: 'pending' },
  { id: 6, routeId: 'overseas-commerce', name: '永平酒楼旧址', lat: 23.3596, lng: 116.6942, summary: '近代商业街区的重要历史点位。', heritageId: 0, status: 'pending' },
  { id: 7, routeId: 'culture-faith', name: '老妈宫与戏台', lat: 23.3552, lng: 116.6960, summary: heritages[4].summary, heritageId: 5, status: 'current' },
  { id: 8, routeId: 'culture-faith', name: '市西堂', lat: 23.3568, lng: 116.6974, summary: '外马路沿线的宗教文化建筑。', heritageId: 0, status: 'pending' },
  { id: 9, routeId: 'culture-faith', name: '聿怀中学堂旧址', lat: 23.3624, lng: 116.7035, summary: heritages[5].summary, heritageId: 6, status: 'pending' },
  { id: 10, routeId: 'red-memory', name: '东征军总指挥部旧址', lat: 23.3575, lng: 116.6948, summary: heritages[6].summary, heritageId: 7, status: 'current' },
  { id: 11, routeId: 'red-memory', name: '八一南昌起义纪念馆', lat: 23.3585, lng: 116.6962, summary: '记录汕头相关革命历史的重要场所。', heritageId: 0, status: 'pending' },
  { id: 12, routeId: 'red-memory', name: '抗日胜利受降旧址', lat: 23.3592, lng: 116.6973, summary: heritages[7].summary, heritageId: 8, status: 'pending' }
];

var categories = [
  { key: 'all', name: '全部' }, { key: 'diplomacy', name: '⚓ 开埠外交' },
  { key: 'commerce', name: '✉️ 侨乡商贸' }, { key: 'culture', name: '🎭 文教宗教' },
  { key: 'red', name: '⭐ 红色革命' }, { key: 'ai', name: '✨ AI复原' }
];

module.exports = { heritages: heritages, routes: routes, points: points, categories: categories };
