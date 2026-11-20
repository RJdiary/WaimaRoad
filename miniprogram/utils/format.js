function padZero(value) { return String(value).padStart(2, '0'); }
function stripZero(value) { return Number(value).toFixed(1).replace(/\.0$/, ''); }
function formatCount(value) { const count = Number(value) || 0; return count >= 10000 ? stripZero(count / 10000) + 'w' : count >= 1000 ? stripZero(count / 1000) + 'k' : String(count); }
function formatDistance(value) { const distance = Number(value) || 0; return distance < 1000 ? Math.round(distance) + 'm' : stripZero(distance / 1000) + 'km'; }
function asDate(value) { return value instanceof Date ? value : new Date(String(value).replace(/-/g, '/')); }
function dateKey(value) { const date = asDate(value); return date.getFullYear() + '-' + padZero(date.getMonth() + 1) + '-' + padZero(date.getDate()); }
function formatTime(value) { const date = asDate(value); const now = new Date(); const today = dateKey(now); const yesterday = dateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)); if (dateKey(date) === today) return padZero(date.getHours()) + ':' + padZero(date.getMinutes()); if (dateKey(date) === yesterday) return '昨天'; return date.getFullYear() + '.' + padZero(date.getMonth() + 1) + '.' + padZero(date.getDate()); }
const sensitiveWords = ['色情', '赌博', '毒品', '诈骗', '暴力', '恐怖', '自杀', '自残', '邪教', '极端', '辱骂', '仇恨', '歧视', '造谣', '谣言', '违法', '违法交易', '枪支', '爆炸', '黑客', '盗号', '私彩', '裸聊', '卖淫', '色情网', '政治煽动', '反动', '脏话', '侮辱', '人身攻击', '赌博网站', '引流', '刷单'];
function validateProfileText(value, label) { const text = String(value || '').trim(); const hit = sensitiveWords.find((word) => text.toLowerCase().indexOf(word.toLowerCase()) > -1); return hit ? { valid: false, msg: label + '包含不适宜内容，请修改后重试' } : { valid: true, msg: '' }; }
module.exports = { padZero, dateKey, formatCount, formatDistance, formatTime, validateProfileText };
