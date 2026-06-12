const products = [
  { name: "全包天地盒", tag: "热门打样", type: "tiandi", variant: "full", image: "/assets/home/product-full.png" },
  { name: "半包天地盒", tag: "热门打样", type: "tiandi", variant: "half", image: "/assets/home/product-half.png" },
  { name: "书型盒", tag: "精品盒", type: "book", variant: "book", image: "/assets/home/product-book.png" },
  { name: "折叠盒", tag: "礼品盒", type: "fold", variant: "fold", image: "/assets/home/product-fold.png" },
  { name: "面纸加工", tag: "多工艺", type: "paper", variant: "paper", image: "/assets/home/product-paper.png" },
  { name: "其他盒型", tag: "人工确认", type: "other", variant: "other", image: "/assets/home/product-other.png" }
];

const banners = [
  { src: "/assets/home/banner-01-box.png" },
  { src: "/assets/home/banner-02-paper.png" },
  { src: "/assets/home/banner-03-order.png" }
];

Page({
  data: {
    banners,
    products,
    features: [
      { title: "精品盒", desc: "小批量打样", theme: "feature-warm", image: "/assets/home/feature-box.png", type: "tiandi", variant: "full" },
      { title: "面纸", desc: "多工艺加工", theme: "feature-cream", image: "/assets/home/feature-paper.png", type: "paper", variant: "paper" },
      { title: "订单", desc: "进度透明", theme: "feature-blue", image: "/assets/home/feature-order.png", action: "order" },
      { title: "其他盒型", desc: "人工确认", theme: "feature-purple", image: "/assets/home/feature-other.png", type: "other", variant: "other" }
    ]
  },

  openProduct(event) {
    const { type, variant, name } = event.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/quote-detail/quote-detail?type=${type}&variant=${variant}&name=${encodeURIComponent(name)}`
    });
  },

  openFeature(event) {
    const { action, type, variant, title } = event.currentTarget.dataset;
    if (action === "order") {
      wx.redirectTo({ url: "/pages/order/order" });
      return;
    }
    wx.navigateTo({
      url: `/pages/quote-detail/quote-detail?type=${type}&variant=${variant}&name=${encodeURIComponent(title)}`
    });
  },

  goQuote() {
    wx.redirectTo({ url: "/pages/quote/quote" });
  },

  goOrder() {
    wx.redirectTo({ url: "/pages/order/order" });
  },

  goService() {
    wx.redirectTo({ url: "/pages/service/service" });
  },

  goMine() {
    wx.redirectTo({ url: "/pages/mine/mine" });
  }
});
