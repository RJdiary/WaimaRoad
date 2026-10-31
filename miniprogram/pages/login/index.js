const app = getApp();

Page({
  data: { account: '', password: '' },
  onAccountInput(e) { this.setData({ account: e.detail.value }); },
  onPasswordInput(e) { this.setData({ password: e.detail.value }); },
  onLogin() {
    const nickname = this.data.account.trim();
    if (!nickname || !this.data.password) {
      wx.showToast({ title: '请输入账号和密码', icon: 'none' });
      return;
    }
    app.setUserInfo({ nickName: nickname, avatarUrl: '../../images/avatar.png' });
    wx.showToast({ title: '登录成功', icon: 'success' });
    setTimeout(() => wx.navigateBack(), 600);
  },
  onBack() { wx.navigateBack(); }
});
