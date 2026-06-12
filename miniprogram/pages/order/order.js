const statusTabs = [
  { key: "ALL", label: "全部" },
  { key: "UNPAID", label: "待付款" },
  { key: "PRODUCING", label: "生产中" },
  { key: "SHIPPED", label: "已发货" },
  { key: "COMPLETED", label: "已完成" },
  { key: "CANCELED", label: "已取消" }
];

const demoOrders = [
  {
    id: "FY20250521001",
    orderNo: "FY20250521001",
    status: "PRODUCING",
    statusText: "生产中",
    createdAt: "2025-05-21 10:30",
    productName: "全包天地盒",
    productImage: "/assets/home/product-full.png",
    sizeText: "120×80×50mm",
    quantityText: "50个",
    craftText: "烫金（亮金）/ 局部UV",
    paperText: "157g 双铜纸",
    amount: 268,
    itemCount: 1,
    assistLabel: "预计发货：05-26",
    actions: [
      { text: "查看详情", type: "secondary", action: "detail" },
      { text: "催单", type: "primary", action: "urge" }
    ]
  },
  {
    id: "FY20250519002",
    orderNo: "FY20250519002",
    status: "SHIPPED",
    statusText: "已发货",
    createdAt: "2025-05-19 14:22",
    productName: "书型盒",
    productImage: "/assets/home/product-book.png",
    sizeText: "180×130×35mm",
    quantityText: "100个",
    craftText: "模切 / 烫金（哑金）/ 击凸",
    paperText: "157g 双铜纸",
    amount: 428,
    itemCount: 1,
    assistLabel: "物流单号：SF1234567890",
    actions: [
      { text: "查看物流", type: "secondary", action: "logistics" },
      { text: "确认收货", type: "primary", action: "confirm" }
    ]
  },
  {
    id: "FY20250515003",
    orderNo: "FY20250515003",
    status: "COMPLETED",
    statusText: "已完成",
    createdAt: "2025-05-15 09:18",
    productName: "半包天地盒",
    productImage: "/assets/home/product-half.png",
    sizeText: "150×100×60mm",
    quantityText: "30个",
    craftText: "烫金（亮金）",
    paperText: "157g 双铜纸",
    amount: 188,
    itemCount: 1,
    assistLabel: "完成时间：05-17 11:20",
    actions: [
      { text: "删除订单", type: "secondary", action: "delete" },
      { text: "再来一单", type: "primary", action: "again" },
      { text: "申请发票", type: "primary", action: "invoice" }
    ]
  },
  {
    id: "FY20250512004",
    orderNo: "FY20250512004",
    status: "CANCELED",
    statusText: "已取消",
    createdAt: "2025-05-12 16:45",
    productName: "面纸加工",
    productImage: "/assets/home/product-paper.png",
    sizeText: "520×720mm",
    quantityText: "80张",
    craftText: "模切 / 局部UV",
    paperText: "157g 双铜纸",
    amount: 156,
    itemCount: 1,
    assistLabel: "取消时间：05-12 17:30",
    actions: [
      { text: "删除订单", type: "secondary", action: "delete" }
    ]
  }
];

function money(value) {
  return `¥${Number(value || 0).toFixed(2)}`;
}

function normalizeStoredOrder(order = {}) {
  const quote = order.quote || {};
  const statusText = order.status || order.statusText || "生产中";
  const statusMap = {
    "待付款": "UNPAID",
    "生产中": "PRODUCING",
    "待发货": "PRODUCING",
    "已发货": "SHIPPED",
    "已完成": "COMPLETED",
    "已取消": "CANCELED",
    "待确认报价": "PRODUCING"
  };
  const status = order.statusKey || statusMap[statusText] || "PRODUCING";
  const productName = order.productName || quote.productName || quote.title || "全包天地盒";
  const amount = Number(order.amount || quote.payableAmount || quote.total || 268);
  return {
    id: order.id || order.orderNo,
    orderNo: order.orderNo || order.id || `FY${Date.now()}`,
    status,
    statusText,
    createdAt: order.createdAt || "2025-05-21 10:30",
    productName,
    productImage: order.productImage || quote.image || "/assets/home/product-full.png",
    sizeText: order.sizeText || `${quote.length || 120}×${quote.width || 80}×${quote.height || 50}mm`,
    quantityText: order.quantityText || `${quote.qty || 50}个`,
    craftText: order.craftText || quote.craftText || "烫金（亮金）/ 局部UV",
    paperText: order.paperText || quote.materialName || "157g 双铜纸",
    amount,
    amountText: money(amount),
    itemCount: order.itemCount || 1,
    assistLabel: order.assistLabel || "预计发货：05-26",
    actions: order.actions || [
      { text: "查看详情", type: "secondary", action: "detail" },
      { text: "催单", type: "primary", action: "urge" }
    ]
  };
}

function decorateOrder(order) {
  return {
    ...order,
    amountText: order.amountText || money(order.amount),
    statusClass: order.status === "SHIPPED" || order.status === "COMPLETED"
      ? "green"
      : order.status === "CANCELED"
        ? "gray"
        : "orange",
    productInitial: order.productName.slice(0, 1)
  };
}

function buildTabs(activeKey) {
  return statusTabs.map((item) => ({
    ...item,
    activeClass: item.key === activeKey ? "active" : ""
  }));
}

function filterOrders(orders, activeKey, keyword) {
  const text = (keyword || "").trim().toLowerCase();
  return orders.filter((order) => {
    const byStatus = activeKey === "ALL" || order.status === activeKey;
    const byText = !text || `${order.orderNo}${order.productName}`.toLowerCase().includes(text);
    return byStatus && byText;
  });
}

Page({
  data: {
    tabs: buildTabs("ALL"),
    activeKey: "ALL",
    keyword: "",
    allOrders: [],
    orders: []
  },

  onShow() {
    const stored = wx.getStorageSync("orders") || [];
    const storedOrders = stored.map(normalizeStoredOrder);
    const existingNos = new Set(storedOrders.map((item) => item.orderNo));
    const allOrders = storedOrders
      .concat(demoOrders.filter((item) => !existingNos.has(item.orderNo)))
      .map(decorateOrder);
    this.setData({
      allOrders,
      orders: filterOrders(allOrders, this.data.activeKey, this.data.keyword)
    });
  },

  switchTab(event) {
    const activeKey = event.currentTarget.dataset.key;
    this.setData({
      activeKey,
      tabs: buildTabs(activeKey),
      orders: filterOrders(this.data.allOrders, activeKey, this.data.keyword)
    });
  },

  onSearch(event) {
    const keyword = event.detail.value;
    this.setData({
      keyword,
      orders: filterOrders(this.data.allOrders, this.data.activeKey, keyword)
    });
  },

  openFilter() {
    wx.showToast({ title: "筛选功能后续接入", icon: "none" });
  },

  openDetail(event) {
    const orderNo = event.currentTarget.dataset.orderNo;
    wx.showToast({ title: `查看 ${orderNo}`, icon: "none" });
  },

  handleAction(event) {
    const { action, orderNo } = event.currentTarget.dataset;
    const order = this.data.allOrders.find((item) => item.orderNo === orderNo);
    if (!order) return;
    if (action === "urge") {
      wx.showToast({ title: "已为您提醒客服跟进订单进度", icon: "none" });
      return;
    }
    if (action === "confirm") {
      wx.showModal({
        title: "确认收货",
        content: "确认已收到货品？",
        success: (res) => {
          if (!res.confirm) return;
          const allOrders = this.data.allOrders.map((item) => item.orderNo === orderNo
            ? decorateOrder({ ...item, status: "COMPLETED", statusText: "已完成", assistLabel: "完成时间：刚刚", actions: demoOrders[2].actions })
            : item);
          this.setData({
            allOrders,
            orders: filterOrders(allOrders, this.data.activeKey, this.data.keyword)
          });
        }
      });
      return;
    }
    if (action === "delete") {
      wx.showModal({
        title: "删除订单",
        content: "确认删除该订单？",
        success: (res) => {
          if (!res.confirm) return;
          const allOrders = this.data.allOrders.filter((item) => item.orderNo !== orderNo);
          this.setData({
            allOrders,
            orders: filterOrders(allOrders, this.data.activeKey, this.data.keyword)
          });
        }
      });
      return;
    }
    if (action === "again") {
      wx.setStorageSync("quoteDraft", order.quote || {
        productName: order.productName,
        image: order.productImage
      });
      wx.navigateTo({ url: "/pages/quote-detail/quote-detail?productId=tiandi_full" });
      return;
    }
    if (action === "invoice") {
      wx.navigateTo({ url: "/pages/invoice/invoice" });
      return;
    }
    if (action === "logistics") {
      wx.showToast({ title: "物流信息：SF1234567890", icon: "none" });
      return;
    }
    if (action === "pay") {
      wx.navigateTo({ url: "/pages/checkout/checkout" });
      return;
    }
    this.openDetail({ currentTarget: { dataset: { orderNo } } });
  },

  goQuotePage() {
    wx.redirectTo({ url: "/pages/quote/quote" });
  },

  goHome() { wx.redirectTo({ url: "/pages/index/index" }); },
  goQuote() { wx.redirectTo({ url: "/pages/quote/quote" }); },
  goService() { wx.redirectTo({ url: "/pages/service/service" }); },
  goMine() { wx.redirectTo({ url: "/pages/mine/mine" }); }
});
