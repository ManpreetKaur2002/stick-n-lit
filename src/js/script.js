import { supabase } from "./supabase.js";
import { addToCart, renderCart, state } from "./cart.js";
import {
  checkoutEls,
} from "./ui.js";
import {
  initCheckout, updateOrderSummary
} from "./checkout.js";
import { money, collections } from "./utils.js";

const els = {
  menu: document.querySelector("[data-menu]"),
  cart: document.querySelector("[data-cart]"),
  cartCount: document.querySelector("[data-cart-count]"),
  cartItems: document.querySelector("[data-cart-items]"),
  cartTotal: document.querySelector("[data-cart-total]"),
  products: document.querySelector("[data-products]"),
  pack: document.querySelector("#packSelect"),
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

  const error = document.getElementById("selectionError");

  if (selected < maxSelection) {
    error.textContent =
      `Select ${maxSelection - selected} more design${maxSelection - selected > 1 ? "s" : ""}.`;
  } else {
    error.textContent = "";
  }
}

document.querySelector("[data-checkout]").addEventListener("click", () => {

  if (state.cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  els.cart.classList.remove("is-open");

  updateOrderSummary();

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

