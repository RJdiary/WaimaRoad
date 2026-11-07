const { sites } = require('./sites');
const rows = [
  ['route_01', '开埠外交线', 'kaibu', '开埠外交', 1.2, 40, '从海关到洋行，读懂汕头开埠的第一课。', ['site_001', 'site_005', 'site_006', 'site_003'], 1],
  ['route_02', '侨乡商贸线', 'qiaoxiang', '侨乡商贸', 1.5, 50, '从侨批与酒楼，读懂一纸乡愁的往来。', ['site_005', 'site_006', 'site_004', 'site_001', 'site_009'], 2],
  ['route_03', '文教宗教线', 'wenjiao', '文教宗教', 1.0, 35, '从香火到书声，走进老城的日常信仰。', ['site_007', 'site_008', 'site_009', 'site_004'], 3],
  ['route_04', '红色革命线', 'hongse', '红色革命', 1.8, 60, '从会馆到史迹，走一遍东征与抗战的记忆。', ['site_010', 'site_011', 'site_012', 'site_009'], 4]
];
const findSite = (id) => sites.find((site) => site.id === id);
const routes = rows.map((row) => ({ id: row[0], name: row[1], theme: row[2], themeName: row[3], distance: row[4], duration: row[5], intro: row[6], stops: row[7], order: row[8], cover: findSite(row[7][0]).cover, polyline: row[7].map((id) => { const point = findSite(id).location; return { latitude: point.lat, longitude: point.lng }; }) }));
module.exports = { routes };
