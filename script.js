const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

// const products = [
//   { id: "single", name: "Single Lighter", quantity: 1, price: 199, shipping: "Shipping charges extra", label: "Starter", color: "#d8d8d8", accent: "#d92626" },
//   { id: "twin", name: "Twin Pack", quantity: 2, price: 359, shipping: "Shipping charges extra", label: "2 Lighters", color: "#222222", accent: "#d7a62f" },
//   { id: "trio", name: "Trio Pack", quantity: 3, price: 549, shipping: "Free Shipping", label: "3 Lighters", color: "#f1eee4", accent: "#157a46" },
//   { id: "five", name: "5 Pack", quantity: 5, price: 849, shipping: "Free Shipping", label: "5 Lighters", color: "#c82124", accent: "#204e8a" }
// ];

const products = [
  {
    id: "blue-bubbles",
    name: "Blue Bubbles",
    image: "images/blue-bubbles.jpg",
    price: 199,
    shipping: "Shipping charges extra"
  },
  {
    id: "banana-sign",
    name: "Banana Sign",
    image: "images/banana-sign.jpg",
    price: 199,
    shipping: "Shipping charges extra"
  },
  {
    id: "tiger",
    name: "Tiger",
    image: "images/tiger.jpg",
    price: 199,
    shipping: "Shipping charges extra"
  },
  {
    id: "burning-match",
    name: "Burning Match",
    image: "images/burning-match.jpg",
    price: 199,
    shipping: "Shipping charges extra"
  },
  {
    id: "balloon-dog",
    name: "Balloon Dog",
    image: "images/balloon-dog.jpg",
    price: 199,
    shipping: "Shipping charges extra"
  },
  {
    id: "cloud-girl",
    name: "Cloud Girl",
    image: "images/cloud-girl.jpg",
    price: 199,
    shipping: "Shipping charges extra"
  },
  {
    id: "pool-girl",
    name: "Pool Girl",
    image: "images/pool-girl.jpg",
    price: 199,
    shipping: "Shipping charges extra"
  },
  {
    id: "whirlpool",
    name: "Whirlpool",
    image: "images/whirlpool.jpg",
    price: 199,
    shipping: "Shipping charges extra"
  },
  {
    id: "purple-bust",
    name: "Purple Bust",
    image: "images/purple-bust.jpg",
    price: 199,
    shipping: "Shipping charges extra"
  }
];

const state = {
  cart: JSON.parse(localStorage.getItem("sticknlit-order") || "[]")
};

const els = {
  menu: document.querySelector("[data-menu]"),
  cart: document.querySelector("[data-cart]"),
  cartCount: document.querySelector("[data-cart-count]"),
  cartItems: document.querySelector("[data-cart-items]"),
  cartTotal: document.querySelector("[data-cart-total]"),
  products: document.querySelector("[data-products]"),
  pack: document.querySelector("#packSelect"),
  fullName: document.querySelector("#fullName"),
  mobile: document.querySelector("#mobileNumber"),
  address: document.querySelector("#deliveryAddress")
};

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function drawLighter(ctx, opts) {
  const {
    x,
    y,
    w,
    h,
    color,
    accent = "#ffffff",
    text = "",
    rotate = 0,
    shine = true,
    showStripe = true,
    showText = true
  } = opts;
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(rotate);
  ctx.translate(-w / 2, -h / 2);

  ctx.shadowColor = "rgba(0,0,0,.34)";
  ctx.shadowBlur = Math.max(18, w * 0.12);
  ctx.shadowOffsetY = Math.max(14, h * 0.04);
  roundedRect(ctx, 0, h * 0.18, w, h * 0.82, w * 0.08);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.shadowColor = "transparent";

  if (shine) {
    const bodyGradient = ctx.createLinearGradient(0, 0, w, h);
    bodyGradient.addColorStop(0, "rgba(255,255,255,.52)");
    bodyGradient.addColorStop(0.18, "rgba(255,255,255,.08)");
    bodyGradient.addColorStop(0.5, "rgba(0,0,0,.12)");
    bodyGradient.addColorStop(1, "rgba(255,255,255,.18)");
    roundedRect(ctx, 0, h * 0.18, w, h * 0.82, w * 0.08);
    ctx.fillStyle = bodyGradient;
    ctx.fill();
  }

  if (showStripe) {
    ctx.fillStyle = accent;
    roundedRect(ctx, w * 0.14, h * 0.54, w * 0.72, h * 0.08, 5);
    ctx.fill();
  }

  ctx.fillStyle = "#d9d9d9";
  roundedRect(ctx, w * 0.08, h * 0.02, w * 0.66, h * 0.24, w * 0.04);
  ctx.fill();
  ctx.fillStyle = "#1c1c1c";
  roundedRect(ctx, w * 0.54, h * 0.07, w * 0.22, h * 0.12, 4);
  ctx.fill();
  ctx.fillStyle = "#f0b22f";
  ctx.beginPath();
  ctx.moveTo(w * 0.72, h * 0.04);
  ctx.quadraticCurveTo(w * 0.9, h * 0.08, w * 0.78, h * 0.2);
  ctx.quadraticCurveTo(w * 0.68, h * 0.13, w * 0.72, h * 0.04);
  ctx.fill();

  if (showText && text) {
    ctx.save();
    ctx.translate(w * 0.5, h * 0.44);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = color === "#222222" ? "#ffffff" : "#111111";
    ctx.font = `900 ${Math.max(13, w * 0.08)}px Inter, Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text.toUpperCase(), 0, 0, h * 0.45);
    ctx.restore();
  }
  ctx.restore();
}

function drawSticker(ctx, imgSrc, x = 305, y = 420, size = 150) {
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,.24)";
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 12;
  roundedRect(ctx, x, y, size, size, Math.max(8, size * 0.1));
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgba(0,0,0,.14)";
  ctx.lineWidth = 2;
  ctx.stroke();

  if (!imgSrc) {
    ctx.restore();
    return;
  }

  const img = new Image();
  img.onload = () => {
    ctx.save();
    const pad = size * 0.07;
    roundedRect(ctx, x + pad, y + pad, size - pad * 2, size - pad * 2, Math.max(6, size * 0.07));
    ctx.clip();
    ctx.drawImage(img, x + pad, y + pad, size - pad * 2, size - pad * 2);
    ctx.restore();
  };
  img.src = imgSrc;
  ctx.restore();
}

function drawStickerLabel(ctx, label, x, y, size, color) {
  drawSticker(ctx, null, x, y, size);
  ctx.save();
  ctx.fillStyle = color;
  roundedRect(ctx, x + size * 0.16, y + size * 0.16, size * 0.68, size * 0.68, size * 0.08);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 ${Math.max(12, size * 0.16)}px Inter, Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label.toUpperCase(), x + size / 2, y + size / 2, size * 0.58);
  ctx.restore();
}

function clearCanvas(canvas, bg) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return ctx;
}

function drawHero() {
  const canvas = document.querySelector("#heroCanvas");
  const ctx = clearCanvas(canvas, "#151515");
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#111111");
  gradient.addColorStop(0.42, "#27332b");
  gradient.addColorStop(1, "#6d1f1d");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  drawLighter(ctx, { x: 260, y: 120, w: 250, h: 600, color: "#d8d8d8", rotate: -0.18, showStripe: false, showText: false });
  drawStickerLabel(ctx, "SNL", 315, 430, 88, "#d92626");
  drawLighter(ctx, { x: 650, y: 170, w: 270, h: 650, color: "#111111", rotate: 0.05, showStripe: false, showText: false });
  drawStickerLabel(ctx, "LIT", 724, 500, 96, "#d7a62f");
  drawLighter(ctx, { x: 1040, y: 95, w: 240, h: 590, color: "#f0eee5", rotate: 0.2, showStripe: false, showText: false });
  drawStickerLabel(ctx, "DIFF", 1092, 410, 84, "#157a46");

  ctx.fillStyle = "rgba(255,255,255,.08)";
  for (let i = 0; i < 12; i += 1) {
    ctx.fillRect(i * 150, 820, 80, 2);
  }
}

function selectedPack() {
  const option = els.pack.selectedOptions[0];
  return {
    name: option.textContent,
    price: Number(option.dataset.price),
    quantity: Number(option.dataset.quantity),
    shipping: option.dataset.shipping
  };
}

function customPrice() {
  return selectedPack().price;
}

// function drawCustom() {
//   const canvas = document.querySelector("#customCanvas");
//   const ctx = clearCanvas(canvas, "#202326");
//   const bg = ctx.createRadialGradient(380, 400, 80, 380, 400, 620);
//   bg.addColorStop(0, "#3b3e42");
//   bg.addColorStop(1, "#17191b");
//   ctx.fillStyle = bg;
//   ctx.fillRect(0, 0, canvas.width, canvas.height);

//   drawLighter(ctx, {
//     x: 250,
//     y: 120,
//     w: 260,
//     h: 650,
//     color: "#d8d8d8",
//     rotate: 0,
//     showStripe: false,
//     showText: false
//   });

//   drawStickerLabel(ctx, "SNL", 305, 420, 150, "#d92626");

//   els.price.textContent = money.format(customPrice());
// }

function drawSet() {
  const canvas = document.querySelector("#setCanvas");
  const ctx = clearCanvas(canvas, "#151515");
  const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  bg.addColorStop(0, "#171717");
  bg.addColorStop(1, "#2f3028");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  products.forEach((item, index) => {
    drawLighter(ctx, {
      x: 145 + index * 170,
      y: 100 + (index % 2) * 34,
      w: 130,
      h: 360,
      color: item.color,
      rotate: (index - 1.5) * 0.09,
      showStripe: false,
      showText: false
    });
    drawStickerLabel(ctx, item.label, 178 + index * 170, 255 + (index % 2) * 34, 54, item.accent);
  });
}

// function productCard(product) {
//   const card = document.createElement("article");
//   card.className = "product-card";
//   card.innerHTML = `
//     <canvas class="product-art" width="520" height="650" aria-label="${product.name}"></canvas>
//     <div class="product-info">
//       <span>${product.label}</span>
//       <h3>${product.name}</h3>
//       <strong>${money.format(product.price)}</strong>
//       <span>${product.shipping}</span>
//       <button type="button">Add Pack</button>
//     </div>
//   `;
//   const canvas = card.querySelector("canvas");
//   const ctx = clearCanvas(canvas, "#ece8dd");
//   drawLighter(ctx, {
//     x: 175,
//     y: 76,
//     w: 170,
//     h: 440,
//     color: product.color,
//     rotate: -0.05,
//     showStripe: false,
//     showText: false
//   });
//   drawStickerLabel(ctx, product.label, 220, 250, 76, product.accent);
//   card.querySelector("button").addEventListener("click", () => addToCart({
//     id: product.id,
//     name: product.name,
//     price: product.price,
//     quantity: product.quantity,
//     shipping: product.shipping
//   }));
//   return card;
// }

function productCard(product) {

  const card = document.createElement("article");

  card.className = "product-card";

  card.innerHTML = `
        <img class="product-image"
             src="${product.image}"
             alt="${product.name}">

        <div class="product-info">

            <h3>${product.name}</h3>

            <strong>${money.format(product.price)}</strong>

            <span>${product.shipping}</span>

            <button>Add to Cart</button>

        </div>
    `;

  card.querySelector("button").onclick = () =>
    addToCart({
      id: product.id,
      name: product.name,
      quantity: 1,
      price: product.price,
      shipping: product.shipping
    });

  return card;
}

function saveCart() {
  localStorage.setItem("sticknlit-order", JSON.stringify(state.cart));
}

function addToCart(item) {
  state.cart.push({ ...item, addedAt: Date.now() });
  saveCart();
  renderCart();
  els.cart.classList.add("is-open");
}

function renderCart() {
  els.cartCount.textContent = state.cart.reduce((sum, item) => sum + Number(item.quantity), 0);
  els.cartItems.innerHTML = "";
  if (!state.cart.length) {
    els.cartItems.innerHTML = "<p>Your cart is empty.</p>";
  }
  state.cart.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <span>${item.quantity} lighter${item.quantity > 1 ? "s" : ""} • ${money.format(item.price)} • ${item.shipping || ""}</span>
      </div>
      <button type="button">Remove</button>
    `;
    row.querySelector("button").addEventListener("click", () => {
      state.cart.splice(index, 1);
      saveCart();
      renderCart();
    });
    els.cartItems.appendChild(row);
  });
  const total = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  els.cartTotal.textContent = money.format(total);
}

function downloadOrder() {
  const order = {
    createdAt: new Date().toISOString(),
    brand: "Stick N Lit",
    note: "Prepaid orders only. Confirm order and share UPI payment details manually.",
    cart: state.cart,
    storage: "localStorage front-end demo; connect Firebase, Supabase, or a form backend for production orders"
  };
  const blob = new Blob([JSON.stringify(order, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `stick-n-lit-order-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

document.querySelector("[data-open-menu]").addEventListener("click", () => els.menu.classList.add("is-open"));
document.querySelector("[data-close-menu]").addEventListener("click", () => els.menu.classList.remove("is-open"));
document.querySelector("[data-open-cart]").addEventListener("click", () => els.cart.classList.add("is-open"));
document.querySelector("[data-close-cart]").addEventListener("click", () => els.cart.classList.remove("is-open"));
document.querySelector("[data-checkout]").addEventListener("click", downloadOrder);

document.querySelector("#customForm").addEventListener("submit", (event) => {
  event.preventDefault();
  const pack = selectedPack();
  addToCart({
    id: `${els.pack.value}-${Date.now()}`,
    name: pack.name,
    price: customPrice(),
    quantity: pack.quantity,
    shipping: pack.shipping,
    customer: {
      fullName: els.fullName.value.trim(),
      mobile: els.mobile.value.trim(),
      address: els.address.value.trim()
    }
  });
});

// [els.pack].forEach((input) => {
//   input.addEventListener("input", drawCustom);
// });

document.querySelector(".newsletter").addEventListener("submit", (event) => {
  event.preventDefault();
  const email = document.querySelector("#email").value.trim();
  if (!email) return;
  localStorage.setItem("sticknlit-updates", email);
  event.target.reset();
});

const packSelect = document.getElementById("packSelect");
const designCheckboxes = document.querySelectorAll(".design-card input");

const selectionInfo = document.getElementById("selectionInfo");

let maxSelection = 1;

function updateSelectionLimit() {

  const option = packSelect.options[packSelect.selectedIndex];

  maxSelection = Number(option.dataset.quantity);

  selectionInfo.textContent =
    `Choose ${maxSelection} design${maxSelection > 1 ? "s" : ""}.`;

}

packSelect.addEventListener("change", updateSelectionLimit);

updateSelectionLimit();

designCheckboxes.forEach(box => {

  box.addEventListener("change", () => {

    const checked = [...designCheckboxes].filter(cb => cb.checked);

    if (checked.length > maxSelection) {

      box.checked = false;

      const card = box.closest(".design-card");

      card.classList.add("shake");

      setTimeout(() => {
        card.classList.remove("shake");
      }, 350);

      return;
    }

    document.querySelectorAll(".design-card").forEach(card => {
      card.classList.remove("selected");
    });

    checked.forEach(cb => {
      cb.closest(".design-card").classList.add("selected");
    });

  });

});

products.forEach((product) => els.products.appendChild(productCard(product)));
drawHero();
// drawCustom();
drawSet();
renderCart();
