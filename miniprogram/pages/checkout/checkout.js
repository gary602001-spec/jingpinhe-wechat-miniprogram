function money(value) {
  return `¥${Number(value || 0).toFixed(2)}`;
}

function defaultQuote() {
  const discountAmount = Number(source.discountAmount || 0);
  return {
    id: "FY20250521001",
    productId: "tiandi_full",
    title: "全包天地盒",
    productName: "全包天地盒",
    image: "/assets/home/product-full.png",
    materialName: "157g 双铜纸",
    printType: "彩色 / 单面",
    length: 200,
    width: 150,
    height: 80,
    qty: 50,
    total: 568,
    unitPrice: 11.36,
    totalText: "¥568.00",
    unitText: "¥11.36 / 个",
    leadTime: "5-7 个工作日",
    minOrder: "1 个起订",
    craftText: "模切（切成型） + 烫金（亮金 80 × 50mm）",
    manual: false
  };
}

function normalizeQuote(source = {}) {
  const qty = Number(source.qty || source.quantity || 50);
  const total = Number(source.total || source.payableAmount || 568);
  const unitPrice = Number(source.unitPrice || (qty ? total / qty : 0));
  const length = Number(source.length || 200);
  const width = Number(source.width || 150);
  const height = Number(source.height || 80);
  const title = source.productName || source.title || "全包天地盒";
  const crafts = Array.isArray(source.crafts)
    ? source.crafts.map((item) => {
        const option = item.option ? `（${item.option}${item.length && item.width ? ` ${item.length} × ${item.width}mm` : ""}）` : "";
        return `${item.name}${option}`;
      }).join(" + ")
    : "";

  return {
    ...defaultQuote(),
    ...source,
    title,
    productName: title,
    image: source.productImage || source.image || "/assets/home/product-full.png",
    materialName: source.materialName || source.paperName || "157g 双铜纸",
    printType: source.printType || "彩色 / 单面",
    length,
    width,
    height,
    qty,
    sizeText: source.sizeText || `${length} × ${width} × ${height} mm`,
    total,
    unitPrice,
    totalText: source.totalText || money(total),
    unitText: source.unitText || `${money(unitPrice)} / 个`,
    productAmount: Number(source.productAmount || Math.max(total - 77, 0)),
    processAmount: Number(source.processAmount || 62),
    freightAmount: Number(source.freightAmount || 15),
    discountAmount,
    discountText: money(discountAmount),
    payableAmount: Number(source.payableAmount || total),
    craftText: source.craftText || crafts || "模切（切成型） + 烫金（亮金 80 × 50mm）",
    leadTime: source.leadTime || (qty <= 50 ? "3-5 个工作日" : qty <= 100 ? "5-7 个工作日" : "人工确认"),
    minOrder: source.minOrder || "1 个起订",
    manual: Boolean(source.manual || qty > 100)
  };
}

function buildFeeItems(quote) {
  const payable = quote.payableAmount || quote.productAmount + quote.processAmount + quote.freightAmount - quote.discountAmount;
  return [
    { label: "商品总价", value: money(quote.productAmount) },
    { label: "工艺费用", value: money(quote.processAmount) },
    { label: "运费", value: money(quote.freightAmount) },
    { label: "应付金额", value: money(payable), strong: true }
  ];
}

Page({
  data: {
    stage: "form",
    quote: normalizeQuote(),
    feeItems: [],
    contactForm: {
      contactName: "",
      phone: "",
      wechat: "",
      address: "",
      detailAddress: "",
      remark: ""
    },
    address: null,
    invoiceType: "normal",
    invoiceTitle: "",
    taxNo: "",
    agreed: true,
    paymentMethod: "wechat",
    balanceAvailable: 238,
    feeExpanded: false,
    remarkCount: 0
  },

  onLoad(options = {}) {
    const storedQuote = wx.getStorageSync("quoteDraft") || {};
    const quote = normalizeQuote({
      ...storedQuote,
      manual: options.mode === "manual" || storedQuote.manual
    });
    this.setData({
      quote,
      feeItems: buildFeeItems(quote)
    });
  },

  onInput(event) {
    const key = event.currentTarget.dataset.key;
    const value = event.detail.value;
    const next = { ...this.data.contactForm, [key]: value };
    this.setData({
      contactForm: next,
      remarkCount: key === "remark" ? value.length : this.data.remarkCount
    });
  },

  onInvoiceInput(event) {
    this.setData({ [event.currentTarget.dataset.key]: event.detail.value });
  },

  chooseAddress() {
    const address = {
      addressId: "ADDR001",
      receiverName: "张先生",
      receiverPhone: "138****8888",
      province: "广东省",
      city: "深圳市",
      district: "宝安区",
      detail: "西乡街道宝源路 168 号名优产品展示中心 2 栋 501"
    };
    this.setData({
      address,
      contactForm: {
        ...this.data.contactForm,
        contactName: this.data.contactForm.contactName || "张先生",
        phone: this.data.contactForm.phone || "13812348888",
        address: `${address.province}${address.city}${address.district}`,
        detailAddress: this.data.contactForm.detailAddress || address.detail
      }
    });
  },

  selectInvoiceType(event) {
    this.setData({ invoiceType: event.currentTarget.dataset.type });
  },

  toggleAgree() {
    this.setData({ agreed: !this.data.agreed });
  },

  toggleFee() {
    this.setData({ feeExpanded: !this.data.feeExpanded });
  },

  selectPayment(event) {
    const method = event.currentTarget.dataset.method;
    if (method === "balance" && this.data.balanceAvailable < this.data.quote.payableAmount) {
      wx.showToast({ title: "余额不足，请选择微信支付或先充值", icon: "none" });
      return;
    }
    this.setData({ paymentMethod: method });
  },

  validateForm() {
    const { contactForm, agreed } = this.data;
    if (!agreed) return "请先阅读并同意服务协议";
    if (!contactForm.contactName) return "请输入联系人姓名";
    if (!contactForm.phone) return "请输入手机号";
    if (!/^1[3-9]\d{9}$/.test(contactForm.phone)) return "请输入正确的手机号";
    if (!contactForm.address) return "请选择收货地址";
    if (!contactForm.detailAddress) return "请填写详细地址";
    return "";
  },

  confirmOrder() {
    const error = this.validateForm();
    if (error) {
      wx.showToast({ title: error, icon: "none" });
      return;
    }
    if (!this.data.address) {
      this.setData({
        address: {
          addressId: "FORM_ADDRESS",
          receiverName: this.data.contactForm.contactName,
          receiverPhone: this.data.contactForm.phone,
          province: this.data.contactForm.address,
          city: "",
          district: "",
          detail: this.data.contactForm.detailAddress
        }
      });
    }
    if (this.data.quote.manual) {
      this.createOrder("待确认报价");
      wx.showToast({ title: "已提交人工确认", icon: "none" });
      wx.redirectTo({ url: "/pages/order/order" });
      return;
    }
    this.setData({ stage: "payment" });
  },

  createOrder(statusText = "生产中") {
    const { quote, contactForm, address, invoiceType, invoiceTitle, taxNo, paymentMethod } = this.data;
    const order = {
      id: `FY${Date.now()}`,
      orderNo: `FY${Date.now()}`,
      status: statusText,
      statusKey: statusText === "生产中" ? "PRODUCING" : "UNPAID",
      createdAt: "2025-05-21 10:30",
      quote,
      productName: quote.productName,
      productImage: quote.image,
      sizeText: `${quote.length}×${quote.width}×${quote.height}mm`,
      quantityText: `${quote.qty}个`,
      craftText: quote.craftText,
      paperText: quote.materialName,
      amount: quote.payableAmount,
      itemCount: 1,
      estimatedShipDate: "05-26",
      contactForm,
      address,
      invoiceType,
      invoiceTitle,
      taxNo,
      paymentMethod
    };
    const orders = wx.getStorageSync("orders") || [];
    wx.setStorageSync("latestOrder", order);
    wx.setStorageSync("orders", [order].concat(orders));
    return order;
  },

  payOrder() {
    const error = this.validateForm();
    if (error) {
      wx.showToast({ title: error, icon: "none" });
      return;
    }
    this.createOrder("生产中");
    wx.redirectTo({ url: "/pages/payment-success/payment-success" });
  },

  editQuote() {
    wx.navigateBack({ delta: 1 });
  },

  goCheckoutForm() {
    this.setData({ stage: "form" });
  },

  goHome() { wx.redirectTo({ url: "/pages/index/index" }); },
  goQuote() { wx.redirectTo({ url: "/pages/quote/quote" }); },
  goOrder() { wx.redirectTo({ url: "/pages/order/order" }); },
  goService() { wx.redirectTo({ url: "/pages/service/service" }); },
  goMine() { wx.redirectTo({ url: "/pages/mine/mine" }); }
});
