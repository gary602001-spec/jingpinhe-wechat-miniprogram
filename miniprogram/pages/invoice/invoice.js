Page({
  data: {
    form: {
      type: "增值税普通发票",
      title: "峰一科技有限公司",
      taxNo: "91440605MAG5********",
      email: "fengyi@fengyi.com",
      phone: "13412343198",
      remark: ""
    }
  },
  onInput(event) {
    const key = event.currentTarget.dataset.key;
    this.setData({ [`form.${key}`]: event.detail.value });
  },
  save() {
    wx.setStorageSync("invoiceInfo", this.data.form);
    wx.showToast({ title: "已保存", icon: "success" });
  },
  goHome() { wx.redirectTo({ url: "/pages/index/index" }); },
  goQuote() { wx.redirectTo({ url: "/pages/quote/quote" }); },
  goOrder() { wx.redirectTo({ url: "/pages/order/order" }); },
  goService() { wx.redirectTo({ url: "/pages/service/service" }); },
  goMine() { wx.redirectTo({ url: "/pages/mine/mine" }); }
});
