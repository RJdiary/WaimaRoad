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
        content: '你好！我是AI文化助手，可以为你解答关于济南历史文化、红色记忆、建筑遗存等方面的问题。请问有什么可以帮你的吗？'
      }
    ],
    inputText: '',
    scrollToId: '',
    quickQuestions: [
      '济南有哪些著名的历史建筑？',
      '解放阁的历史背景？',
      '推荐一条红色文化路线'
    ],
    mockAnswers: {
      '济南有哪些著名的历史建筑？': '济南拥有众多珍贵的历史建筑，其中最著名的包括：\n\n1. 济南老火车站——由德国建筑师赫尔曼·菲舍尔设计，曾是亚洲最大的火车站之一，典型的德国青年风格派建筑\n2. 洪家楼天主教堂——济南标志性建筑，双塔哥特式风格\n3. 山东邮务管理局旧址——近代洋楼建筑代表\n4. 府学文庙——济南现存最古老的古建筑群之一\n5. 老舍故居——文学大师的济南旧居',
      '解放阁的历史背景？': '解放阁位于济南市历下区，矗立在原济南城墙东南角，是为纪念济南战役胜利而建。\n\n1948年9月16日至24日，华东野战军发起济南战役，经过八昼夜激战，全歼国民党守军10万余人，解放了济南。\n\n解放阁于1986年建成开放，阁高34.1米，建筑面积617平方米。陈毅元帅亲笔题写"解放阁"三个大字。阁内设有济南战役纪念馆，展示战役历史文物和照片。\n\n现在，解放阁是山东省文物保护单位和重要的爱国主义教育基地。',
      '推荐一条红色文化路线': '为你推荐济南经典红色文化路线，全程约3.2公里，耗时约2.5小时：\n\n📍 路线规划：\n1️⃣ 解放阁（起点）——济南战役胜利纪念地\n2️⃣ 趵突泉景区——济南战役指挥所旧址\n3️⃣ 五龙潭公园——中共山东省委领导机关旧址\n4️⃣ 大明湖景区——历下亭红色记忆\n5️⃣ 英雄山烈士陵园（终点）——瞻仰革命先烈\n\n💡 小贴士：建议上午9点出发，沿途可在泉城路商圈用餐，下午可到英雄山缅怀先烈。每个点位都有详细的历史介绍和语音讲解。'
    },
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
      var answers = this.data.mockAnswers;
      if (answers[question]) {
        return answers[question];
      }

      var keywords = {
        '建筑': '济南的历史建筑非常丰富，包括济南老火车站、洪家楼天主教堂、府学文庙等著名建筑。你想了解哪一座建筑的详细信息呢？',
        '红色': '济南是一座具有光荣革命传统的城市，拥有解放阁、英雄山烈士陵园、中共山东省委旧址等众多红色文化资源。',
        '路线': '我可以为你推荐多条文化探索路线，包括红色记忆路线、建筑艺术路线、宗教文化路线等。你对哪种路线感兴趣呢？',
        '解放阁': '解放阁是为纪念济南战役胜利而建，位于原济南城墙东南角，阁高34.1米，陈毅元帅亲笔题写"解放阁"三个大字。',
        '老火车站': '济南老火车站由德国建筑师赫尔曼·菲舍尔设计，始建于1904年，是典型的德国青年风格派建筑，被誉为"亚洲最漂亮的火车站"之一。',
        '泉城': '济南因泉水众多而得名"泉城"，素有"四面荷花三面柳，一城山色半城湖"的美誉。趵突泉、大明湖、千佛山是济南的三大名胜。'
      };

      for (var keyword in keywords) {
        if (question.indexOf(keyword) !== -1) {
          return keywords[keyword];
        }
      }

      return '这是一个很有趣的问题！关于济南的历史文化，我可以为你介绍建筑遗存、红色记忆、名泉文化、老街古巷等多个方面。你可以尝试问我：\n\n• 济南有哪些著名的历史建筑？\n• 解放阁的历史背景？\n• 推荐一条红色文化路线';
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
