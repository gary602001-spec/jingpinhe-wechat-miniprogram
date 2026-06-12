const formatMoney = (value) => Number(value || 0).toLocaleString("zh-CN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const defaultLedger = [
  { id: "flow_001", type: "recharge", title: "充值", time: "2024-05-21 14:30", amount: 1000, balanceAfter: 1268 },
  { id: "flow_002", type: "order_pay", title: "订单支付", orderNo: "PO202405210001", time: "2024-05-21 14:31", amount: -268, balanceAfter: 268 },
  { id: "flow_003", type: "refund", title: "退款", orderNo: "PO202405180089", time: "2024-05-18 11:20", amount: 198, balanceAfter: 536 },
  { id: "flow_004", type: "order_pay", title: "订单支付", orderNo: "PO202405180089", time: "2024-05-18 10:15", amount: -520, balanceAfter: 338 }
];

Page({
  data: {
    tabs: [
      { key: "all", name: "全部" },
      { key: "income", name: "收入" },
      { key: "expense", name: "支出" }
    ],
    activeTab: "all",
    balance: 1268,
    balanceText: "1,268.00",
    ledgerList: [],
    filteredList: []
  },

  onLoad() {
    this.loadLedger();
  },

  onPullDownRefresh() {
    this.loadLedger();
    wx.stopPullDownRefresh();
  },

  loadLedger() {
    const balance = wx.getStorageSync("accountBalance") || 1268;
    const stored = wx.getStorageSync("ledgerList") || [];
    const ledgerList = [...stored, ...defaultLedger].map((item) => ({
      ...item,
      amountText: `${item.amount > 0 ? "+" : "-"}¥${formatMoney(Math.abs(item.amount))}`,
      balanceText: formatMoney(item.balanceAfter)
    }));
    this.setData({ balance, balanceText: formatMoney(balance), ledgerList }, this.filterLedger);
  },

  switchTab(event) {
    this.setData({ activeTab: event.currentTarget.dataset.key }, this.filterLedger);
  },

  filterLedger() {
    const { activeTab, ledgerList } = this.data;
    let filteredList = ledgerList;
    if (activeTab === "income") {
      filteredList = ledgerList.filter((item) => item.amount > 0);
    }
    if (activeTab === "expense") {
      filteredList = ledgerList.filter((item) => item.amount < 0);
    }
    this.setData({ filteredList });
  },

  tapRecord() {
    wx.showToast({ title: "流水详情开发中", icon: "none" });
  },

  goHome() { wx.redirectTo({ url: "/pages/index/index" }); },
  goQuote() { wx.redirectTo({ url: "/pages/quote/quote" }); },
  goOrder() { wx.redirectTo({ url: "/pages/order/order" }); },
  goService() { wx.redirectTo({ url: "/pages/service/service" }); },
  goMine() { wx.redirectTo({ url: "/pages/mine/mine" }); }
});
