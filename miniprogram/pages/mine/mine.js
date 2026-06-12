Page({
  data: {
    user: {
      name: "张先生",
      company: "峰一科技有限公司",
      level: "普通用户"
    },
    stats: [
      { type: "all", value: 12, label: "我的订单", icon: "stat-order" },
      { type: "unpaid", value: 3, label: "待付款", icon: "stat-pay" },
      { type: "received", value: 2, label: "待收货", icon: "stat-box" },
      { type: "after", value: 1, label: "售后中", icon: "stat-service" }
    ],
    menus: [
      { label: "账户余额", action: "balance", icon: "mi-wallet" },
      { label: "账务明细", action: "ledger", icon: "mi-ledger" },
      { label: "发票中心", action: "invoice", icon: "mi-invoice" },
      { label: "收货地址", action: "address", icon: "mi-address" },
      { label: "售后进度", action: "afterSales", icon: "mi-after" },
      { label: "设置", action: "settings", icon: "mi-setting" }
    ]
  },

  tapStat(event) {
    const type = event.currentTarget.dataset.type;
    if (type === "after") {
      wx.navigateTo({ url: "/pages/after-sales/after-sales" });
      return;
    }
    wx.redirectTo({ url: `/pages/order/order?status=${type}` });
  },

  tapMenu(event) {
    const action = event.currentTarget.dataset.action;
    const routes = {
      balance: "/pages/balance/balance",
      ledger: "/pages/ledger/ledger",
      invoice: "/pages/invoice/invoice",
      afterSales: "/pages/after-sales/after-sales"
    };
    if (routes[action]) {
      wx.navigateTo({ url: routes[action] });
      return;
    }
    wx.showToast({ title: action === "address" ? "地址管理开发中" : "设置开发中", icon: "none" });
  },

  goHome() { wx.redirectTo({ url: "/pages/index/index" }); },
  goQuote() { wx.redirectTo({ url: "/pages/quote/quote" }); },
  goOrder() { wx.redirectTo({ url: "/pages/order/order" }); },
  goService() { wx.redirectTo({ url: "/pages/service/service" }); }
});
