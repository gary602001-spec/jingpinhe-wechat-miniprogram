const MATERIAL = {
  id: "paper_double_copper_157",
  name: "157g 双铜纸",
  gsm: 157,
  tonPrice: 5400
};

const PRODUCT_CONFIG = {
  tiandi_full: {
    id: "tiandi_full",
    name: "全包天地盒",
    category: "premium",
    categoryLabel: "精品盒",
    quoteMode: "auto",
    type: "tiandi",
    variant: "full",
    image: "/assets/home/product-full.png",
    factor: 1
  },
  tiandi_half: {
    id: "tiandi_half",
    name: "半包天地盒",
    category: "premium",
    categoryLabel: "精品盒",
    quoteMode: "auto",
    type: "tiandi",
    variant: "half",
    image: "/assets/home/product-half.png",
    factor: 0.96
  },
  book_box: {
    id: "book_box",
    name: "书型盒",
    category: "premium",
    categoryLabel: "精品盒",
    quoteMode: "auto",
    type: "book",
    variant: "book",
    image: "/assets/home/product-book.png",
    factor: 1.12
  },
  folding_box: {
    id: "folding_box",
    name: "折叠盒",
    category: "card",
    categoryLabel: "卡盒",
    quoteMode: "manual",
    type: "fold",
    variant: "fold",
    image: "/assets/home/product-fold.png",
    factor: 1
  },
  paper_processing: {
    id: "paper_processing",
    name: "面纸加工",
    category: "paper",
    categoryLabel: "面纸加工",
    quoteMode: "process",
    type: "paper",
    variant: "paper",
    image: "/assets/home/product-paper.png",
    factor: 0.72
  },
  other_box: {
    id: "other_box",
    name: "其他盒型",
    category: "other",
    categoryLabel: "其他盒型",
    quoteMode: "manual",
    type: "other",
    variant: "other",
    image: "/assets/home/product-other.png",
    factor: 1
  }
};

const VARIANT_TABS = [
  { id: "tiandi_full", name: "全包天地盒" },
  { id: "tiandi_half", name: "半包天地盒" },
  { id: "book_box", name: "书型盒" },
  { id: "folding_box", name: "折叠盒" }
];

function money(value) {
  return `¥${Number(value || 0).toFixed(2)}`;
}

function positiveNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0;
}

function normalizeProductId(options = {}) {
  if (PRODUCT_CONFIG[options.productId]) return options.productId;
  if (options.type === "tiandi" && options.variant === "half") return "tiandi_half";
  if (options.type === "tiandi") return "tiandi_full";
  if (options.type === "book") return "book_box";
  if (options.type === "fold") return "folding_box";
  if (options.type === "paper") return "paper_processing";
  if (options.type === "other") return "other_box";
  return "tiandi_full";
}

function getQuoteMode(product, options = {}) {
  const passedMode = options.mode || options.quoteMode;
  if (passedMode === "manual") return "manual";
  if (passedMode === "paperProcessing") return "process";
  return product.quoteMode;
}

function buildTabs(activeId) {
  return VARIANT_TABS.map((item) => ({
    ...item,
    activeClass: item.id === activeId ? "active" : ""
  }));
}

function createCrafts() {
  return [
    { key: "dieCut", name: "模切", selected: false, option: "平张模切", needsSize: false },
    { key: "foil", name: "烫金", selected: true, option: "亮金", needsSize: true, length: 80, width: 30 },
    { key: "emboss", name: "击凸", selected: false, option: "", needsSize: true, length: "", width: "" },
    { key: "uv", name: "局部UV", selected: false, option: "", needsSize: true, length: "", width: "" }
  ];
}

function decorateCrafts(crafts) {
  return crafts.map((item) => ({
    ...item,
    activeClass: item.selected ? "active" : "",
    showFoilOptions: item.key === "foil" && item.selected
  }));
}

function buildFoilOptions(value) {
  return [
    { name: "亮金", value: "亮金" },
    { name: "哑金", value: "哑金" }
  ].map((item) => ({
    ...item,
    activeClass: item.value === value ? "active" : ""
  }));
}

function selectedCraftPanels(crafts) {
  return crafts.filter((item) => item.selected && (item.needsSize || item.key === "foil"));
}

function manualResult(message) {
  return {
    total: 0,
    unitPrice: 0,
    totalText: "人工确认",
    unitText: "联系客服",
    leadTime: "人工确认",
    minOrder: "按需",
    manual: true,
    valid: true,
    message
  };
}

function invalidResult(message) {
  return {
    total: 0,
    unitPrice: 0,
    totalText: "¥0.00",
    unitText: "¥0.00/个",
    leadTime: "0天",
    minOrder: "1个起",
    manual: false,
    valid: false,
    message
  };
}

function calculateQuote(product, quoteMode, size, qty, crafts) {
  const quantity = Number(qty);
  if (!positiveNumber(size.length) || !positiveNumber(size.width) || !positiveNumber(size.height)) {
    return invalidResult("请填写有效的成品尺寸");
  }
  if (!Number.isInteger(quantity) || quantity < 1) {
    return invalidResult("请输入有效数量");
  }
  if (quoteMode === "manual" || quantity > 100) {
    return manualResult("该订单需人工确认报价，提交后客服会联系确认。");
  }

  for (const craft of crafts) {
    if (!craft.selected || !craft.needsSize) continue;
    if (!positiveNumber(craft.length) || !positiveNumber(craft.width)) {
      return invalidResult(`请补充${craft.name}工艺尺寸`);
    }
  }

  const length = Number(size.length);
  const width = Number(size.width);
  const height = Number(size.height);
  const areaUnit = (length * width) / 10000;
  const baseUnit = (3.2 + areaUnit * 0.18 + height * 0.012) * product.factor;
  let total = baseUnit * quantity + 10.8;

  crafts.forEach((craft) => {
    if (!craft.selected) return;
    if (craft.key === "dieCut") {
      total += 20 + quantity * 0.5;
    }
    if (craft.key === "foil") {
      const craftArea = Number(craft.length) * Number(craft.width) / 1000;
      total += craftArea * (craft.option === "哑金" ? 14 : 15);
    }
    if (craft.key === "emboss") {
      const craftArea = Number(craft.length) * Number(craft.width) / 1000;
      total += craftArea * 10;
    }
    if (craft.key === "uv") {
      const craftArea = Number(craft.length) * Number(craft.width) / 1000;
      total += craftArea * 12;
    }
  });

  total = Math.round(total);
  const unitPrice = total / quantity;
  return {
    total,
    unitPrice,
    totalText: money(total),
    unitText: `${money(unitPrice)}/个`,
    leadTime: quantity <= 50 ? "3-5天" : "5-7天",
    minOrder: "1个起",
    manual: false,
    valid: true,
    message: "按当前尺寸与工艺自动计算"
  };
}

Page({
  data: {
    productId: "tiandi_full",
    productName: "全包天地盒",
    productCategory: "premium",
    categoryLabel: "精品盒",
    productImage: "/assets/home/product-full.png",
    quoteMode: "auto",
    summaryText: "157g 双铜纸 · 自动报价",
    variantTabs: buildTabs("tiandi_full"),
    size: { length: 200, width: 140, height: 60 },
    qty: 50,
    material: MATERIAL,
    crafts: decorateCrafts(createCrafts()),
    activeCraftPanels: selectedCraftPanels(decorateCrafts(createCrafts())),
    foilOptions: buildFoilOptions("亮金"),
    quoteResult: {
      total: 268,
      unitPrice: 5.36,
      totalText: "¥268.00",
      unitText: "¥5.36/个",
      leadTime: "3-5天",
      minOrder: "1个起",
      manual: false,
      valid: true,
      message: "按当前尺寸与工艺自动计算"
    },
    submitText: "提交订单"
  },

  onLoad(options) {
    const productId = normalizeProductId(options);
    this.applyProduct(productId, options);
  },

  applyProduct(productId, options = {}) {
    const product = PRODUCT_CONFIG[productId] || PRODUCT_CONFIG.tiandi_full;
    const quoteMode = getQuoteMode(product, options);
    this.setData({
      productId: product.id,
      productName: product.name,
      productCategory: product.category,
      categoryLabel: product.categoryLabel,
      productImage: product.image,
      quoteMode,
      summaryText: quoteMode === "manual" ? "人工确认报价" : `${MATERIAL.name} · ${quoteMode === "process" ? "多工艺报价" : "自动报价"}`,
      variantTabs: buildTabs(product.id)
    }, () => this.refreshQuote());
  },

  buildCraftState(crafts) {
    const decorated = decorateCrafts(crafts);
    const foil = decorated.find((item) => item.key === "foil");
    return {
      crafts: decorated,
      activeCraftPanels: selectedCraftPanels(decorated),
      foilOptions: buildFoilOptions(foil ? foil.option : "亮金")
    };
  },

  refreshQuote() {
    const product = PRODUCT_CONFIG[this.data.productId] || PRODUCT_CONFIG.tiandi_full;
    const result = calculateQuote(product, this.data.quoteMode, this.data.size, Number(this.data.qty), this.data.crafts);
    this.setData({
      quoteResult: result,
      submitText: result.manual ? "提交人工报价" : "提交订单"
    });
  },

  switchProduct(event) {
    this.applyProduct(event.currentTarget.dataset.id);
  },

  onSizeInput(event) {
    const key = event.currentTarget.dataset.key;
    this.setData({ [`size.${key}`]: event.detail.value }, () => this.refreshQuote());
  },

  onQtyInput(event) {
    this.setData({ qty: event.detail.value }, () => this.refreshQuote());
  },

  changeQty(event) {
    const step = Number(event.currentTarget.dataset.step);
    const next = Math.max(1, (Number(this.data.qty) || 1) + step);
    this.setData({ qty: next }, () => this.refreshQuote());
  },

  toggleCraft(event) {
    const key = event.currentTarget.dataset.key;
    const crafts = this.data.crafts.map((item) => {
      if (item.key !== key) return item;
      const selected = !item.selected;
      return {
        ...item,
        selected,
        length: selected && item.needsSize && !item.length ? 80 : item.length,
        width: selected && item.needsSize && !item.width ? 30 : item.width
      };
    });
    this.setData(this.buildCraftState(crafts), () => this.refreshQuote());
  },

  selectFoil(event) {
    const value = event.currentTarget.dataset.value;
    const crafts = this.data.crafts.map((item) => {
      if (item.key !== "foil") return item;
      return { ...item, selected: true, option: value };
    });
    this.setData(this.buildCraftState(crafts), () => this.refreshQuote());
  },

  onCraftSize(event) {
    const key = event.currentTarget.dataset.key;
    const field = event.currentTarget.dataset.field;
    const crafts = this.data.crafts.map((item) => {
      if (item.key !== key) return item;
      return { ...item, selected: true, [field]: event.detail.value };
    });
    this.setData(this.buildCraftState(crafts), () => this.refreshQuote());
  },

  validateBeforeSubmit() {
    if (!this.data.quoteResult.valid) {
      wx.showToast({ title: this.data.quoteResult.message, icon: "none" });
      return false;
    }
    return true;
  },

  submitQuote() {
    if (!this.validateBeforeSubmit()) return;
    const selectedCrafts = this.data.crafts
      .filter((craft) => craft.selected)
      .map((craft) => ({
        key: craft.key,
        name: craft.name,
        option: craft.option,
        length: craft.length || "",
        width: craft.width || ""
      }));
    const quote = {
      id: `FY${Date.now()}`,
      productId: this.data.productId,
      title: this.data.productName,
      category: this.data.productCategory,
      categoryLabel: this.data.categoryLabel,
      image: this.data.productImage,
      length: Number(this.data.size.length) || 0,
      width: Number(this.data.size.width) || 0,
      height: Number(this.data.size.height) || 0,
      qty: Number(this.data.qty) || 1,
      materialId: MATERIAL.id,
      materialName: MATERIAL.name,
      quoteMode: this.data.quoteResult.manual ? "manual" : this.data.quoteMode,
      manualReason: this.data.quoteResult.manual ? this.data.quoteResult.message : "",
      total: this.data.quoteResult.total,
      totalText: this.data.quoteResult.totalText,
      unitText: this.data.quoteResult.unitText,
      leadTime: this.data.quoteResult.leadTime,
      minOrder: this.data.quoteResult.minOrder,
      manual: this.data.quoteResult.manual,
      crafts: selectedCrafts
    };
    wx.setStorageSync("quoteDraft", quote);
    wx.navigateTo({ url: `/pages/checkout/checkout?mode=${quote.manual ? "manual" : "auto"}` });
  },

  goHome() { wx.redirectTo({ url: "/pages/index/index" }); },
  goQuote() { wx.redirectTo({ url: "/pages/quote/quote" }); },
  goOrder() { wx.redirectTo({ url: "/pages/order/order" }); },
  goService() { wx.redirectTo({ url: "/pages/service/service" }); },
  goMine() { wx.redirectTo({ url: "/pages/mine/mine" }); }
});
