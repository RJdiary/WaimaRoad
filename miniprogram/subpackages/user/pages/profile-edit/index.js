const auth = require('../../../../utils/auth');
const api = require('../../../../utils/api');
const { validateProfileText } = require('../../../../utils/format');

function nicknameMessage(value) {
  const name = String(value || '').trim();
  if (!name) return '昵称不能为空';
  if (name.length < 2 || name.length > 12) return '昵称需为 2—12 个字符';
  return '';
}

Page({
  data: { nickname: '', bio: '', avatar: '', nicknameHint: '', bioHint: '', fontScale: 1 },
  onLoad() {
    if (!auth.requireLogin()) return;
    api.getMe().then((res) => {
      const user = res.data;
      this.setData({ nickname: user.nickname || '', bio: user.bio || '', avatar: user.avatar || '', fontScale: getApp().globalData.fontScale });
    });
  },
  onUnload() { clearTimeout(this.nicknameTimer); },
  back() {
    if (getCurrentPages().length > 1) wx.navigateBack();
    else wx.switchTab({ url: '/pages/profile/index' });
  },
  onNicknameInput(e) {
    const nickname = e.detail.value;
    clearTimeout(this.nicknameTimer);
    this.setData({ nickname, nicknameHint: nicknameMessage(nickname) });
    this.nicknameTimer = setTimeout(() => {
      const verdict = validateProfileText(this.data.nickname, '昵称');
      if (!verdict.valid) {
        this.setData({ nicknameHint: verdict.msg });
        wx.showToast({ title: verdict.msg, icon: 'none' });
      }
    }, 300);
  },
  onBioInput(e) {
    const bio = e.detail.value;
    this.setData({ bio, bioHint: bio.trim() ? '' : '个人简介不能为空' });
  },
  onChooseAvatar(e) {
    const avatar = e.detail && e.detail.avatarUrl;
    if (avatar) this.setData({ avatar });
  },
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => this.setData({ avatar: res.tempFilePaths[0] }),
      fail: () => wx.showToast({ title: '未选择头像', icon: 'none' })
    });
  },
  save() {
    const nickname = this.data.nickname.trim();
    const bio = this.data.bio.trim();
    const nicknameHint = nicknameMessage(nickname);
    const verdict = validateProfileText(nickname, '昵称');
    if (nicknameHint || !verdict.valid || !bio) {
      this.setData({ nicknameHint: nicknameHint || verdict.msg, bioHint: bio ? '' : '个人简介不能为空' });
      return wx.showToast({ title: nicknameHint || verdict.msg || '请完善个人简介', icon: 'none' });
    }
    api.updateMe({ nickname, bio, avatar: this.data.avatar }).then((res) => {
      auth.updateUser(res.data);
      wx.showToast({ title: '已保存' });
      this.back();
    }).catch((error) => wx.showToast({ title: error.msg || '保存失败，请重试', icon: 'none' }));
  }
});
