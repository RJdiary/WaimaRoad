Component({
  properties: {},

  data: {
    showPanel: false,
    btnLeft: 300,
    btnTop: 550,
    windowWidth: 375,
    windowHeight: 667,
    btnSize: 52,
    messages: [
      {
        id: 1,
        role: 'ai',
        content: '你好！我是外马路文化助手。你可以问我开埠历史、侨批商贸、文教信俗、红色革命，或请我推荐一条 Citywalk 路线。'
      }
    ],
    inputText: '',
    scrollToId: '',
    quickQuestions: [
      '外马路有哪些开埠历史点位？',
      '侨批文物馆有什么故事？',
      '推荐一条红色 Citywalk 路线'
    ],
    mockAnswers: {},
    _startX: 0,
    _startY: 0,
    _startLeft: 0,
    _startTop: 0,
    _isDragging: false,
    _tapStartTime: 0
  },

  attached: function () {
    var sysInfo = wx.getSystemInfoSync();
    var btnSize = 52;
    var margin = 16;
    this.setData({
      windowWidth: sysInfo.windowWidth,
      windowHeight: sysInfo.windowHeight,
      btnSize: btnSize,
      btnLeft: sysInfo.windowWidth - btnSize - margin,
      btnTop: sysInfo.windowHeight - btnSize - margin - 60
    });
  },

  methods: {
    onTouchStart: function (e) {
      var touch = e.touches[0];
      this.setData({
        _startX: touch.clientX,
        _startY: touch.clientY,
        _startLeft: this.data.btnLeft,
        _startTop: this.data.btnTop,
        _isDragging: false,
        _tapStartTime: Date.now()
      });
    },

    onTouchMove: function (e) {
      var touch = e.touches[0];
      var deltaX = touch.clientX - this.data._startX;
      var deltaY = touch.clientY - this.data._startY;

      if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
        this.setData({ _isDragging: true });
      }

      var newLeft = this.data._startLeft + deltaX;
      var newTop = this.data._startTop + deltaY;
      var maxLeft = this.data.windowWidth - this.data.btnSize;
      var maxTop = this.data.windowHeight - this.data.btnSize;

      if (newLeft < 0) newLeft = 0;
      if (newLeft > maxLeft) newLeft = maxLeft;
      if (newTop < 0) newTop = 0;
      if (newTop > maxTop) newTop = maxTop;

      this.setData({
        btnLeft: newLeft,
        btnTop: newTop
      });
    },

    onTouchEnd: function (e) {
      var deltaTime = Date.now() - this.data._tapStartTime;
      if (!this.data._isDragging && deltaTime < 300) {
        this.togglePanel();
      }
    },

    togglePanel: function () {
      this.setData({
        showPanel: !this.data.showPanel
      });
      if (this.data.showPanel) {
        this.scrollToBottom();
      }
    },

    closePanel: function () {
      this.setData({
        showPanel: false
      });
    },

    sendQuickQuestion: function (e) {
      var question = e.currentTarget.dataset.question;
      this.doSendMessage(question);
    },

    onInputChange: function (e) {
      this.setData({
        inputText: e.detail.value
      });
    },

    onConfirmSend: function (e) {
      var text = e.detail.value;
      if (text && text.trim()) {
        this.doSendMessage(text.trim());
      }
    },

    onTapSend: function () {
      var text = this.data.inputText;
      if (text && text.trim()) {
        this.doSendMessage(text.trim());
      } else {
        wx.showToast({
          title: '请输入问题',
          icon: 'none'
        });
      }
    },

    doSendMessage: function (text) {
      if (!text || !text.trim()) return;

      var userMsg = {
        id: Date.now(),
        role: 'user',
        content: text.trim()
      };

      var messages = this.data.messages.concat([userMsg]);

      this.setData({
        messages: messages,
        inputText: ''
      });

      this.scrollToBottom();

      var that = this;
      setTimeout(function () {
        var answer = that.getMockAnswer(text.trim());
        var aiMsg = {
          id: Date.now() + 1,
          role: 'ai',
          content: answer
        };

        var newMessages = that.data.messages.concat([aiMsg]);
        that.setData({
          messages: newMessages
        });

        that.scrollToBottom();
      }, 800);
    },

    getMockAnswer: function (question) {
      if (question.indexOf('开埠') !== -1 || question.indexOf('海关') !== -1) {
        return '外马路的开埠线索可从潮海关旧址与开埠文化陈列馆读起。它们见证了汕头在近代通商、航运、金融与城市建设中的变化。';
      }
      if (question.indexOf('侨批') !== -1 || question.indexOf('商贸') !== -1) {
        return '侨批文物馆所在的原汕头侨批公会旧址，保存着海外潮人与家乡之间的书信、汇款和情感记忆；可与汕头邮政总局大楼一起安排在“侨批商贸线”中游览。';
      }
      if (question.indexOf('红色') !== -1 || question.indexOf('路线') !== -1 || question.indexOf('Citywalk') !== -1) {
        return '推荐“红色记忆线”：东征军总指挥部旧址 → 八一南昌起义纪念馆 → 原汕头抗日胜利受降旧址，全程约 1.6 公里，适合慢走并结合史料阅读。';
      }
      if (question.indexOf('宗教') !== -1 || question.indexOf('文教') !== -1) {
        return '“文教信俗线”串联老妈宫与戏台、市西堂、聿怀中学堂旧址，适合了解潮剧、妈祖信俗与近代教育在老城留下的共同记忆。';
      }
      var answers = this.data.mockAnswers;
      if (answers[question]) {
        return answers[question];
      }

      var keywords = {
        '外马路': '外马路是汕头开埠历史文化街区的重要组成部分，串联海关、侨批、学校、宗教建筑与革命史迹。',
        '点位': '目前小程序以重点点位为演示样本；项目计划系统整理现存与已消失的 45 处以上历史点位。',
        'AI': 'AI辅助复原功能会在展示中清楚标注生成属性，并以老照片、文字记载和实地调研为依据。'
      };

      for (var keyword in keywords) {
        if (question.indexOf(keyword) !== -1) {
          return keywords[keyword];
        }
      }

      return '这是一个很有趣的问题！我可以为你介绍汕头外马路的开埠外交、侨乡商贸、文教宗教与红色革命史料。你也可以问我：\n\n• 外马路有哪些开埠历史点位？\n• 侨批文物馆有什么故事？\n• 推荐一条红色 Citywalk 路线';
    },

    onFeedback: function (e) {
      wx.showToast({
        title: '感谢反馈',
        icon: 'success',
        duration: 1500
      });
    },

    preventDefault: function () {},

    scrollToBottom: function () {
      var messages = this.data.messages;
      if (messages.length > 0) {
        var lastMsg = messages[messages.length - 1];
        this.setData({
          scrollToId: 'msg-' + lastMsg.id
        });
      }
    }
  }
});
