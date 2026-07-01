(function () {
  const products = {
    pulse: {
      name: "NOVA Pulse Pro",
      category: "无线音频",
      image: "assets/photo-headphone.png",
      price: "会员价 ¥699",
      scene: "通勤 / 网课 / 游戏",
      summary: "头戴式主动降噪耳机，主打沉浸空间音效和长时间佩戴舒适度。",
      specs: [
        ["连接方式", "蓝牙 5.4 / 有线模式"],
        ["续航时间", "42 小时综合续航"],
        ["降噪能力", "自适应 ANC + 通透模式"],
        ["充电接口", "USB-C 快充，15 分钟约 6 小时"],
        ["重量", "约 268g"],
        ["推荐人群", "宿舍学习、通勤、轻电竞用户"]
      ]
    },
    keys: {
      name: "NOVA Keys 75",
      category: "桌面效率",
      image: "assets/photo-keyboard.png",
      price: "会员价 ¥529",
      scene: "学习 / 办公 / 桌搭",
      summary: "75% 配列机械键盘，兼顾桌面空间、手感和多设备切换。",
      specs: [
        ["连接方式", "蓝牙 / 2.4G / USB-C 三模"],
        ["轴体结构", "热插拔线性轴，支持换轴"],
        ["键帽材质", "PBT 二色键帽"],
        ["灯效", "RGB 背光，多组预设模式"],
        ["电池容量", "4000mAh"],
        ["适配系统", "Windows / macOS / Android"]
      ]
    },
    watch: {
      name: "NOVA Watch S",
      category: "智能穿戴",
      image: "assets/photo-watch.png",
      price: "会员价 ¥899",
      scene: "运动 / 提醒 / 健康",
      summary: "轻薄智能手表，覆盖日常提醒、运动记录和基础健康监测。",
      specs: [
        ["屏幕", "1.78 英寸 AMOLED"],
        ["续航", "7 天典型使用"],
        ["传感器", "心率、血氧、睡眠监测"],
        ["运动模式", "80+ 种运动记录"],
        ["防护", "5ATM 防水"],
        ["重量", "约 36g 表体"]
      ]
    },
    cube: {
      name: "NOVA Cube Speaker",
      category: "生活娱乐",
      image: "assets/photo-speaker.png",
      price: "会员价 ¥299",
      scene: "宿舍 / 桌面 / 露营",
      summary: "小体积无线音箱，适合桌面音乐、宿舍聚会和户外轻娱乐。",
      specs: [
        ["声场", "360 度环绕声场"],
        ["功率", "20W 双单元输出"],
        ["续航", "16 小时播放"],
        ["防护", "IPX5 生活防水"],
        ["连接", "蓝牙 5.3 / AUX"],
        ["特色", "双机串联立体声"]
      ]
    },
    buds: {
      name: "NOVA Buds Mini",
      category: "轻量音频",
      image: "assets/photo-earbuds.png",
      price: "会员价 ¥249",
      scene: "课堂 / 通勤 / 运动",
      summary: "小巧真无线耳塞，适合日常随身携带和长时间轻量佩戴。",
      specs: [
        ["连接方式", "蓝牙 5.4"],
        ["续航", "单次 7 小时，综合 28 小时"],
        ["降噪", "通话降噪 + 通透模式"],
        ["操控", "触控切歌、接听、唤醒助手"],
        ["防护", "IP54 防尘防水"],
        ["重量", "单耳约 4.2g"]
      ]
    },
    glide: {
      name: "NOVA Glide Mouse",
      category: "游戏外设",
      image: "assets/photo-mouse.png",
      price: "会员价 ¥199",
      scene: "游戏 / 设计 / 办公",
      summary: "轻量化无线鼠标，兼顾低延迟、精准控制和长时间握持舒适度。",
      specs: [
        ["连接方式", "2.4G / 蓝牙 / USB-C"],
        ["传感器", "最高 26000 DPI"],
        ["重量", "约 58g"],
        ["回报率", "最高 1000Hz"],
        ["续航", "约 90 小时"],
        ["按键", "6 键可编程"]
      ]
    },
    dock: {
      name: "NOVA Dock Pro",
      category: "桌面扩展",
      image: "assets/photo-dock.png",
      price: "会员价 ¥399",
      scene: "笔记本 / 多屏 / 工作站",
      summary: "多接口 USB-C 扩展坞，一根线连接显示器、键鼠、U 盘和网线。",
      specs: [
        ["视频输出", "HDMI 4K 60Hz"],
        ["供电", "USB-C PD 100W"],
        ["数据接口", "USB-A x3 / USB-C x1"],
        ["网络", "千兆 RJ45 网口"],
        ["读卡", "SD / TF 双卡槽"],
        ["外壳", "铝合金散热机身"]
      ]
    },
    power: {
      name: "NOVA PowerCore",
      category: "移动能源",
      image: "assets/photo-powerbank.png",
      price: "会员价 ¥259",
      scene: "出行 / 上课 / 掌机",
      summary: "轻薄大容量移动电源，支持多设备同时补电和数字电量显示。",
      specs: [
        ["容量", "20000mAh"],
        ["输出", "最高 65W USB-C 快充"],
        ["接口", "USB-C x2 / USB-A x1"],
        ["屏幕", "数字电量显示"],
        ["安全", "过温、过压、短路保护"],
        ["适配", "手机、耳机、手表、掌机"]
      ]
    }
  };

  const modal = document.getElementById("productModal");
  const image = document.getElementById("modalProductImage");
  const category = document.getElementById("modalProductCategory");
  const name = document.getElementById("modalProductName");
  const summary = document.getElementById("modalProductSummary");
  const price = document.getElementById("modalProductPrice");
  const scene = document.getElementById("modalProductScene");
  const specs = document.getElementById("modalProductSpecs");

  if (!modal || !image || !category || !name || !summary || !price || !scene || !specs) {
    return;
  }

  let lastFocusedElement = null;

  function openProduct(productId) {
    const product = products[productId];
    if (!product) return;

    lastFocusedElement = document.activeElement;
    image.src = product.image;
    image.alt = product.name + " 产品图";
    category.textContent = product.category;
    name.textContent = product.name;
    summary.textContent = product.summary;
    price.textContent = product.price;
    scene.textContent = product.scene;
    specs.innerHTML = product.specs.map(([label, value]) => (
      `<div><dt>${label}</dt><dd>${value}</dd></div>`
    )).join("");

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-lock");
    const closeButton = modal.querySelector(".modal-close");
    if (closeButton) closeButton.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-lock");
    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  document.querySelectorAll(".catalog-card[data-product], .product-card[data-product]").forEach((card) => {
    card.addEventListener("click", () => openProduct(card.dataset.product));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProduct(card.dataset.product);
      }
    });
  });

  modal.addEventListener("click", (event) => {
    if (event.target.matches("[data-close-modal]")) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });
})();
