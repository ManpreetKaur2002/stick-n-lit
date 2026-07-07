const continueShoppingBtn = document.getElementById("continueShoppingBtn");
const successModal = document.getElementById("successModal");
const checkoutEls = {
    modal: document.getElementById("checkoutModal"),
    close: document.getElementById("closeCheckout"),

    name: document.getElementById("checkoutName"),
    mobile: document.getElementById("checkoutMobile"),
    address: document.getElementById("checkoutAddress"),

    placeOrder: document.getElementById("placeOrderBtn"),

    nameError: document.getElementById("checkoutNameError"),
    mobileError: document.getElementById("checkoutMobileError"),
    addressError: document.getElementById("checkoutAddressError")
};

const els = {
    menu: document.querySelector("[data-menu]"),
    cart: document.querySelector("[data-cart]")
};

const overlay = document.querySelector(".menu-overlay");
const menuButton = document.querySelector("[data-open-menu]");

function openMenu() {
    els.menu.classList.add("is-open");
    overlay.classList.add("show");

    menuButton.classList.add("is-open");
}

function closeMenu() {
    els.menu.classList.remove("is-open");
    overlay.classList.remove("show");

    menuButton.classList.remove("is-open");
}

menuButton.addEventListener("click", () => {

    if (els.menu.classList.contains("is-open")) {
        closeMenu();
    } else {
        openMenu();
    }

});

overlay.addEventListener("click", closeMenu);
document.querySelector("[data-open-cart]").addEventListener("click", () => els.cart.classList.add("is-open"));
document.querySelector("[data-close-cart]").addEventListener("click", () => els.cart.classList.remove("is-open"));
document.querySelectorAll(".mobile-menu a").forEach(link => {
    link.addEventListener("click", closeMenu);
});
document.addEventListener("click", (e) => {

    const menu = els.menu;
    const openBtn = document.querySelector("[data-open-menu]");

    // if menu isn't open
    if (!menu.classList.contains("is-open")) return;

    // clicked inside menu
    if (menu.contains(e.target)) return;

    // clicked hamburger icon
    if (openBtn.contains(e.target)) return;

    // otherwise close
    closeMenu();

});

checkoutEls.close.addEventListener("click", () => {
    checkoutEls.modal.classList.remove("show");
});

checkoutEls.modal.addEventListener("click", (e) => {

    if (e.target === checkoutEls.modal) {
        checkoutEls.modal.classList.remove("show");
    }

});

continueShoppingBtn.addEventListener("click", () => {

    successModal.classList.add("hidden");

    checkoutEls.modal.classList.remove("show");

    els.cart.classList.remove("is-open");

});

const statusModal = document.getElementById("statusModal");

const statusIcon = document.getElementById("statusIcon");

const statusTitle = document.getElementById("statusTitle");

const statusMessage = document.getElementById("statusMessage");

const statusBtn = document.getElementById("statusBtn");

export function showStatus(status, message) {

    statusModal.classList.remove("hidden");
    statusModal.classList.add("show");

    if (status === null) {

        statusIcon.className = "status-icon processing";
        statusIcon.innerHTML = `<div class="loader"></div>`;

        statusTitle.textContent = "Processing Payment";
        statusMessage.textContent = message;

        statusBtn.style.display = "none";

    } else if (status === true) {

        statusIcon.className = "status-icon success";
        statusIcon.innerHTML = "✓";

        statusTitle.textContent = "Payment Successful";
        statusMessage.textContent = message;

        statusBtn.style.display = "block";
        statusBtn.textContent = "Continue Shopping";

    } else {

        statusIcon.className = "status-icon error";
        statusIcon.innerHTML = "✕";

        statusTitle.textContent = "Payment Cancelled";
        statusMessage.textContent = message;

        statusBtn.style.display = "block";
        statusBtn.textContent = "Continue Shopping";
    }
}

statusBtn.addEventListener("click", () => {

    statusModal.classList.remove("show");
    statusModal.classList.add("hidden");

});

export {
    checkoutEls,
    successModal
};