const formatMoney = (value) => Number(value || 0).toLocaleString("zh-CN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

Page({
  data: {
    balance: 1268,
    balanceText: "1,268.00",
    amountOptions: [
      { value: 500, label: "500" },
      { value: 1000, label: "1000" },
      { value: 2000, label: "2000" },
      { value: 5000, label: "5000" },
      { value: 10000, label: "10000" }
    ],
    selectedAmount: 1000,
    isCustomAmount: false,
    customAmount: "",
    loading: false
  },

  onLoad() {
    const storedBalance = wx.getStorageSync("accountBalance");
    const balance = typeof storedBalance === "number" ? storedBalance : this.data.balance;
    this.setData({ balance, balanceText: formatMoney(balance) });
  },

  chooseAmount(event) {
    this.setData({
      selectedAmount: Number(event.currentTarget.dataset.value),
      isCustomAmount: false,
      customAmount: ""
    });
  },

  chooseCustom() {
    this.setData({ isCustomAmount: true, selectedAmount: 0 });
  },

  onCustomInput(event) {
    this.setData({ customAmount: event.detail.value, isCustomAmount: true, selectedAmount: 0 });
  },

  recharge() {
    const amount = this.data.isCustomAmount ? Number(this.data.customAmount) : Number(this.data.selectedAmount);
    if (!amount || amount <= 0) {
      wx.showToast({ title: "请选择或输入充值金额", icon: "none" });
      return;
    }
    if (amount > 100000) {
      wx.showToast({ title: "单次充值金额过大，请联系客服", icon: "none" });
      return;
    }

    this.setData({ loading: true });
    setTimeout(() => {
      const balance = Number((this.data.balance + amount).toFixed(2));
      const ledger = wx.getStorageSync("ledgerList") || [];
      ledger.unshift({
        id: `flow_${Date.now()}`,
        type: "recharge",
        title: "充值",
        time: "2024-05-21 14:30",
        amount,
        balanceAfter: balance
      });
      wx.setStorageSync("accountBalance", balance);
      wx.setStorageSync("ledgerList", ledger);
      this.setData({ balance, balanceText: formatMoney(balance), loading: false });
      wx.showToast({ title: "充值成功", icon: "success" });
    }, 500);
  },

  goHome() { wx.redirectTo({ url: "/pages/index/index" }); },
  goQuote() { wx.redirectTo({ url: "/pages/quote/quote" }); },
  goOrder() { wx.redirectTo({ url: "/pages/order/order" }); },
  goService() { wx.redirectTo({ url: "/pages/service/service" }); },
  goMine() { wx.redirectTo({ url: "/pages/mine/mine" }); }
});
