const faqs = [
  {
    id: "auto",
    icon: "算",
    title: "1-100个如何自动报价？",
    desc: "输入尺寸和数量，选择工艺后系统实时计算价格。",
    answer: "进入报价页选择盒型，填写长、宽、高和数量，再按需选择模切、烫金、击凸、局部UV等工艺。"
  },
  {
    id: "craft",
    icon: "艺",
    title: "支持哪些工艺？",
    desc: "支持模切、烫金、击凸、局部UV等工艺。",
    answer: "工艺需要选择后才计入报价，未选择的工艺不会计算费用。"
  },
  {
    id: "manual",
    icon: "人",
    title: "100个以上如何报价？",
    desc: "100个以上需要人工报价，请提交询价单。",
    answer: "100个以上、其他盒型和文件报价都需要人工确认，客服会根据文件和工艺核价。"
  },
  {
    id: "delivery",
    icon: "时",
    title: "交期一般多久？",
    desc: "小批量打样通常2-4个工作日，具体以实际为准。",
    answer: "交期为参考时间，最终以订单确认、工艺复杂度和客服确认为准。"
  },
  {
    id: "paper",
    icon: "纸",
    title: "目前开放哪些纸张？",
    desc: "目前仅开放157g双铜纸，其他纸张敬请期待。",
    answer: "当前小程序自动报价只开放157g双铜纸，128g、200g和特种纸暂不开放。"
  },
  {
    id: "progress",
    icon: "单",
    title: "如何查看订单进度？",
    desc: "在“订单”页面可实时查看订单生产进度。",
    answer: "底部点击订单，可查看待付款、待发货、已发货和异常订单等状态。"
  }
];

const agents = [
  {
    id: "xiaofeng",
    name: "小峰",
    role: "资深客服",
    status: "online",
    statusText: "在线",
    avatar: "峰",
    lastMessage: "您好，很高兴为您服务！",
    lastTime: "10:30"
  },
  {
    id: "xiaoyi",
    name: "小一",
    role: "技术支持",
    status: "offline",
    statusText: "离线",
    avatar: "一",
    lastMessage: "好的，我帮您查看一下。",
    lastTime: "09:15"
  },
  {
    id: "xiaoke",
    name: "小科",
    role: "售后专员",
    status: "offline",
    statusText: "离线",
    avatar: "科",
    lastMessage: "感谢您的反馈！",
    lastTime: "昨天"
  }
];

Page({
  data: {
    faqs,
    expandedFaqId: "",
    contacts: [
      { type: "online", icon: "耳", title: "在线客服", desc: "快速响应" },
      { type: "wechat", icon: "微", title: "微信客服", desc: "扫码添加" },
      { type: "phone", icon: "电", title: "电话咨询", desc: "0755-8888 8888" },
      { type: "email", icon: "邮", title: "邮件咨询", desc: "service@graphfi.com" }
    ],
    agents,
    activeAgentId: "xiaofeng",
    activeAgent: agents[0],
    messages: [
      { id: 1, senderType: "service", content: "您好！我是小峰，很高兴为您服务~ 请问有什么可以帮您？", time: "10:30" },
      { id: 2, senderType: "customer", content: "我想咨询全包天地盒的报价", time: "10:31" },
      { id: 3, senderType: "service", content: "好的，请您提供一下产品的长、宽、高和数量，以及需要的工艺，我帮您计算。", time: "10:31" },
      { id: 4, senderType: "customer", content: "好的，稍等我准备一下", time: "10:32" }
    ],
    quickActions: [
      { icon: "图", title: "发送图片" },
      { icon: "文", title: "发送文件" },
      { icon: "价", title: "提交报价需求" },
      { icon: "单", title: "查看订单" }
    ],
    showActions: false,
    draft: ""
  },

  toggleFaq(event) {
    const { id } = event.currentTarget.dataset;
    this.setData({
      expandedFaqId: this.data.expandedFaqId === id ? "" : id
    });
  },

  shuffleFaqs() {
    const rotated = this.data.faqs.slice(2).concat(this.data.faqs.slice(0, 2));
    this.setData({ faqs: rotated, expandedFaqId: "" });
  },

  handleContact(event) {
    const { type } = event.currentTarget.dataset;
    if (type === "phone") {
      wx.makePhoneCall({ phoneNumber: "075588888888" });
      return;
    }
    if (type === "email") {
      wx.setClipboardData({ data: "service@graphfi.com" });
      return;
    }
    if (type === "wechat") {
      wx.showModal({
        title: "微信客服",
        content: "请联系企业微信客服或添加专属客服二维码。",
        showCancel: false
      });
      return;
    }
    this.focusChat();
  },

  focusChat() {
    wx.showToast({ title: "已进入在线咨询区", icon: "none" });
  },

  switchAgent(event) {
    const { id } = event.currentTarget.dataset;
    const activeAgent = this.data.agents.find((item) => item.id === id) || this.data.agents[0];
    this.setData({ activeAgentId: id, activeAgent });
  },

  onDraftInput(event) {
    this.setData({ draft: event.detail.value });
  },

  toggleActions() {
    this.setData({ showActions: !this.data.showActions });
  },

  handleQuickAction() {
    wx.showToast({ title: "功能待接入", icon: "none" });
  },

  goHome() { wx.redirectTo({ url: "/pages/index/index" }); },
  goQuote() { wx.redirectTo({ url: "/pages/quote/quote" }); },
  goOrder() { wx.redirectTo({ url: "/pages/order/order" }); },
  goMine() { wx.redirectTo({ url: "/pages/mine/mine" }); }
});
