import { supabase } from "./supabase.js";
import { addToCart, renderCart, state } from "./cart.js";
import {
  checkoutEls,
} from "./ui.js";
import {
  initCheckout
} from "./checkout.js";

console.log("Supabase Connected:", supabase);

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

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

const els = {
  menu: document.querySelector("[data-menu]"),
  cart: document.querySelector("[data-cart]"),
  cartCount: document.querySelector("[data-cart-count]"),
  cartItems: document.querySelector("[data-cart-items]"),
  cartTotal: document.querySelector("[data-cart-total]"),
  products: document.querySelector("[data-products]"),
  pack: document.querySelector("#packSelect"),
};

const collections = {
  core: [
    {
      name: "Blue Current",
      image: "/core_collection/blue-current.JPG"
    },
    {
      name: "Slip Mode",
      image: "/core_collection/slip-mode.JPG"
    },
    {
      name: "Untamed",
      image: "/core_collection/untamed.JPG"
    },
    {
      name: "Pop Icon",
      image: "/core_collection/pop-icon.JPG"
    },
    {
      name: "Ignition",
      image: "/core_collection/ignition.JPG"
    },
    {
      name: "Float",
      image: "/core_collection/float.JPG"
    },
    {
      name: "Poolside",
      image: "/core_collection/poolside.JPG"
    },
    {
      name: "Oracle",
      image: "/core_collection/oracle.jpeg"
    },
    {
      name: "Blue Voyage",
      image: "/core_collection/blue-voyage.JPG"
    }
  ],

  cosmic: [
    {
      name: "All In",
      image: "/cosmic_collection/all_in.jpg"
    },
    {
      name: "Beyond",
      image: "/cosmic_collection/beyond.jpg"
    },
    {
      name: "Found You",
      image: "/cosmic_collection/found_you.jpg"
    },
    {
      name: "The Unknown",
      image: "/cosmic_collection/the_unknown.jpg"
    },
    {
      name: "Sky Bound",
      image: "/cosmic_collection/skybound.jpg"
    },
    {
      name: "unseen",
      image: "/cosmic_collection/unseen.jpg"
    }
  ]
};

const packSelect = document.getElementById("packSelect");
let designCheckboxes = [];
const selectedDesigns = new Map();

const selectionInfo = document.getElementById("selectionInfo");
let maxSelection = 1;

const collectionSelect = document.getElementById("collectionSelect");
const designGrid = document.getElementById("designGrid");
const title = document.getElementById("collectionTitle");
const subtitle = document.getElementById("collectionSubtitle");

function renderCollection(collectionName) {

  const designs = collections[collectionName];

  subtitle.textContent =
    `${designs.length} Exclusive Designs`;

  designGrid.innerHTML = "";

  designs.forEach(design => {

    const card = document.createElement("label");

    card.className = "design-card";

    const key = `${collectionName}:${design.name}`;

    card.innerHTML = `
    <input
        type="checkbox"
        value="${design.name}"
        ${selectedDesigns.has(key) ? "checked" : ""}
    >

    <img src="${design.image}" alt="${design.name}">

    <span>${design.name}</span>
`;

    if (selectedDesigns.has(key)) {
      card.classList.add("selected");
    }

    designGrid.appendChild(card);

  });

  designCheckboxes = [
    ...designGrid.querySelectorAll(".design-card input")
  ];

  setupCheckboxEvents();
}

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
  const text = (label || "").toUpperCase();
  ctx.fillText(
    text,
    x + size / 2,
    y + size / 2,
    size * 0.58
  );
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
    quantity: Number(option.dataset.quantity)
  };
}

function customPrice() {
  return selectedPack().price;
}

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

  return card;
}

function updateSelectionLimit() {

  const selected = selectedDesigns.size;

  document.getElementById("selectionCount").textContent =
    `${selected} / ${maxSelection}`;

  const percent = (selected / maxSelection) * 100;

  document.getElementById("selectionFill").style.width =
    percent + "%";

  document.getElementById("addToCart").disabled =
    selected !== maxSelection;
}

document.querySelector("[data-checkout]").addEventListener("click", () => {

  if (state.cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  els.cart.classList.remove("is-open");

  checkoutEls.modal.classList.add("show");

});

const { data, error } = await supabase.auth.signInAnonymously();

document.getElementById("addToCart").addEventListener("click", () => {

  const pack = selectedPack();

  if (selectedDesigns.size !== pack.quantity) {
    alert(`Please select exactly ${pack.quantity} design(s).`);
    return;
  }

  const designs = [...selectedDesigns.values()];

  const cartItem = {
    id: Date.now(),

    pack: pack.name,
    quantity: pack.quantity,
    price: pack.price,
    designs
  };

  addToCart(cartItem);

  // Reset selection
  selectedDesigns.clear();

  document.getElementById("customForm").reset();

  packSelect.selectedIndex = 0;
  maxSelection = Number(packSelect.selectedOptions[0].dataset.quantity);

  collectionSelect.value = "core";
  renderCollection("core");

  updateSelectionLimit();
});

initCheckout();

packSelect.addEventListener("change", () => {

  maxSelection = Number(
    packSelect.selectedOptions[0].dataset.quantity
  );

  selectedDesigns.clear();

  designCheckboxes.forEach(cb => {
    cb.checked = false;
    cb.closest(".design-card").classList.remove("selected");
  });

  updateSelectionLimit();
});

collectionSelect.addEventListener("change", () => {

  renderCollection(collectionSelect.value);

  updateSelectionLimit();

});

updateSelectionLimit();

function setupCheckboxEvents() {
  designCheckboxes.forEach(box => {

    box.addEventListener("change", () => {

      const key = `${collectionSelect.value}:${box.value}`;

      if (box.checked) {

        selectedDesigns.set(key, {
          collection: collectionSelect.value,
          name: box.value
        });

        if (selectedDesigns.size > maxSelection) {

          selectedDesigns.delete(key);
          box.checked = false;

          const card = box.closest(".design-card");
          card.classList.add("shake");

          setTimeout(() => {
            card.classList.remove("shake");
          }, 350);

          updateSelectionLimit();
          return;
        }

      } else {

        selectedDesigns.delete(key);

      }

      updateSelectionLimit();

      designCheckboxes.forEach(cb => {
        cb.closest(".design-card").classList.toggle(
          "selected",
          cb.checked
        );
      });

    });

  });
}

renderCollection("core");

const collectionCards = document.querySelectorAll(".collection-card");

collectionCards.forEach(card => {

  card.addEventListener("click", () => {

    const collection = card.dataset.collection;

    collectionSelect.value = collection;

    renderCollection(collection);

    updateSelectionLimit();

    collectionCards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");

  });

});

renderCart();

