import {
    money
} from "./utils";

export const state = {
    cart: JSON.parse(sessionStorage.getItem("sticknlit-cart")) || []
};

const els = {
    menu: document.querySelector("[data-menu]"),
    cart: document.querySelector("[data-cart]"),
    cartCount: document.querySelector("[data-cart-count]"),
    cartItems: document.querySelector("[data-cart-items]"),
    cartTotal: document.querySelector("[data-cart-total]"),
    products: document.querySelector("[data-products]"),
    pack: document.querySelector("#packSelect"),
};

function saveCart() {
    sessionStorage.setItem("sticknlit-cart", JSON.stringify(state.cart));
}

export const getCartTotal = () =>
    state.cart.reduce((sum, item) => sum + item.price, 0);

function addToCart(item) {
    state.cart.push(item);

    saveCart();

    renderCart();

    document.querySelector("[data-cart]").classList.add("is-open");
}

function clearCart() {
    state.cart = [];
    sessionStorage.removeItem("sticknlit-cart");

    renderCart();
}

function renderCart() {

    els.cartCount.textContent = state.cart.length;

    els.cartItems.innerHTML = "";

    if (state.cart.length === 0) {
        els.cartItems.innerHTML = "<p>Your cart is empty.</p>";
        els.cartTotal.textContent = money.format(0);
        return;
    }

    let total = 0;

    state.cart.forEach((item, index) => {

        total += item.price;

        const div = document.createElement("div");

        div.className = "cart-item";

        div.innerHTML = `
    <div class="cart-item-left">

        <h3>${item.pack}</h3>

        <div class="cart-designs">

            ${item.designs
                .map(design => `
                    <span class="design-chip">
                        ${design.name}
                        <small>
                            (${design.collection === "core"
                        ? "Core"
                        : "Cosmic"})
                        </small>
                    </span>
                `)
                .join("")}

        </div>
    </div>

    <div class="cart-item-right">

        <strong>${money.format(item.price)}</strong>

        <button class="remove-btn">
            ✕
        </button>

    </div>
    `;

        div.querySelector(".remove-btn").addEventListener("click", () => {

            state.cart.splice(index, 1);

            saveCart();

            renderCart();

        });

        els.cartItems.appendChild(div);

    });

    els.cartTotal.textContent = money.format(total);

}

document.addEventListener("pointerdown", (e) => {

    if (!els.cart.classList.contains("is-open")) return;

    // Clicked inside the cart
    if (els.cart.contains(e.target)) return;

    // Clicked on cart button
    if (e.target.closest("[data-open-cart]")) return;

    // Clicked Add Pack
    if (e.target.closest("#addToCart")) return;

    // Otherwise close
    els.cart.classList.remove("is-open");

});

export { renderCart, addToCart, clearCart }