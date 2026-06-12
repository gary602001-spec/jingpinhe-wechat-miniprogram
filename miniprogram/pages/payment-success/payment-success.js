Page({
  data: {
    order: {}
  },
  onLoad() {
    const order = wx.getStorageSync("latestOrder") || {
      orderNo: "FY202405200001",
      status: "待发货",
      createdAt: "2024-05-20 14:30:22",
      quote: {
        title: "全包天地盒",
        image: "/assets/home/product-full.png",
        length: 200,
        width: 150,
        height: 80,
        qty: 100,
        totalText: "¥186.00",
        unitText: "¥1.86/个",
        leadTime: "3-5天"
      }
    };
    this.setData({ order });
  },
  goOrder() { wx.redirectTo({ url: "/pages/order/order" }); },
  goHome() { wx.redirectTo({ url: "/pages/index/index" }); },
  goQuote() { wx.redirectTo({ url: "/pages/quote/quote" }); },
  goService() { wx.redirectTo({ url: "/pages/service/service" }); },
  goMine() { wx.redirectTo({ url: "/pages/mine/mine" }); }
});
