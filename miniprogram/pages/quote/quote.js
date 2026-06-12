const categories = [
  { id: "premium", name: "精品盒" },
  { id: "card", name: "卡盒" },
  { id: "paper", name: "面纸加工" },
  { id: "other", name: "其他盒型" }
];

const products = [
  {
    id: "tiandi_full",
    name: "全包天地盒",
    category: "premium",
    categoryName: "精品盒",
    tag: "自动报价",
    quoteMode: "auto",
    type: "tiandi",
    variant: "full",
    image: "/assets/home/product-full.png",
    sort: 10,
    enabled: true
  },
  {
    id: "tiandi_half",
    name: "半包天地盒",
    category: "premium",
    categoryName: "精品盒",
    tag: "自动报价",
    quoteMode: "auto",
    type: "tiandi",
    variant: "half",
    image: "/assets/home/product-half.png",
    sort: 20,
    enabled: true
  },
  {
    id: "book_box",
    name: "书型盒",
    category: "premium",
    categoryName: "精品盒",
    tag: "自动报价",
    quoteMode: "auto",
    type: "book",
    variant: "book",
    image: "/assets/home/product-book.png",
    sort: 30,
    enabled: true
  },
  {
    id: "folding_box",
    name: "折叠盒",
    category: "card",
    categoryName: "卡盒",
    tag: "人工确认",
    quoteMode: "manual",
    type: "fold",
    variant: "fold",
    image: "/assets/home/product-fold.png",
    sort: 40,
    enabled: true
  },
  {
    id: "paper_processing",
    name: "面纸加工",
    category: "paper",
    categoryName: "面纸加工",
    tag: "多工艺",
    quoteMode: "process",
    type: "paper",
    variant: "paper",
    image: "/assets/home/product-paper.png",
    sort: 50,
    enabled: true
  },
  {
    id: "other_box",
    name: "其他盒型",
    category: "other",
    categoryName: "其他盒型",
    tag: "人工确认",
    quoteMode: "manual",
    type: "other",
    variant: "other",
    image: "/assets/home/product-other.png",
    sort: 60,
    enabled: true
  }
];

function buildCategories(activeId) {
  return categories.map((item) => ({
    ...item,
    activeClass: item.id === activeId ? "active" : ""
  }));
}

function normalizeProduct(item) {
  return {
    ...item,
    tagClass: item.quoteMode === "manual" ? "manual" : ""
  };
}

function filterProducts(activeCategory, keyword) {
  const value = String(keyword || "").trim().toLowerCase();
  return products
    .filter((item) => item.enabled)
    .filter((item) => {
      if (value) {
        return [
          item.id,
          item.name,
          item.category,
          item.categoryName,
          item.tag,
          item.quoteMode
        ].some((text) => String(text).toLowerCase().includes(value));
      }
      return item.category === activeCategory;
    })
    .sort((a, b) => a.sort - b.sort)
    .map(normalizeProduct);
}

Page({
  data: {
    keyword: "",
    activeCategory: "premium",
    categories: buildCategories("premium"),
    filteredProducts: filterProducts("premium", "")
  },

  refreshProducts() {
    this.setData({
      categories: buildCategories(this.data.activeCategory),
      filteredProducts: filterProducts(this.data.activeCategory, this.data.keyword)
    });
  },

  switchCategory(event) {
    const id = event.currentTarget.dataset.id;
    this.setData({ activeCategory: id, keyword: "" }, () => this.refreshProducts());
  },

  onSearch(event) {
    this.setData({ keyword: event.detail.value }, () => this.refreshProducts());
  },

  openProduct(event) {
    const product = this.data.filteredProducts.find((item) => item.id === event.currentTarget.dataset.id);
    if (!product) return;

    const mode = product.quoteMode === "process" ? "paperProcessing" : product.quoteMode;
    const detailType = product.quoteMode === "manual" ? "other" : product.type;
    const detailVariant = product.quoteMode === "manual" ? "manual" : product.variant;
    const url = [
      "/pages/quote-detail/quote-detail",
      `?productId=${product.id}`,
      `&mode=${mode}`,
      `&type=${detailType}`,
      `&variant=${detailVariant}`,
      `&category=${encodeURIComponent(product.category)}`,
      `&quoteMode=${product.quoteMode}`,
      `&name=${encodeURIComponent(product.name)}`
    ].join("");

    wx.navigateTo({ url });
  },

  goHome() {
    wx.redirectTo({ url: "/pages/index/index" });
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
