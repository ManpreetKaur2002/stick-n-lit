import { checkoutEls, successModal, showStatus } from "./ui.js";
import { money, delhiNcrPins, SHIPPING, DELIVERY } from "./utils.js";
import {
    validateCheckoutName,
    validateCheckoutMobile,
    validateCheckoutAddress
} from "./validation.js";

import { getCartTotal, clearCart, state, getTotalItems } from "./cart.js";

const subtotalAmount = document.getElementById("subtotalAmount");
const shippingAmount = document.getElementById("shippingAmount");
const orderTotal = document.getElementById("orderTotal");
const standardDeliveryPrice =
    document.getElementById("standardDeliveryPrice");
const standardRadio =
    document.querySelector(
        'input[value="standard"]'
    );

const deliveryOptions =
    document.querySelectorAll('input[name="delivery"]');

const pincodeInput =
    document.getElementById("checkoutPincode");

const ownerRadio =
    document.getElementById("ownerDelivery");

const ownerDeliveryOption =
    document.getElementById("ownerDeliveryOption");

const ownerNote =
    document.getElementById("ownerDeliveryNote");

const deliverySection =
    document.getElementById("deliverySection");

pincodeInput.addEventListener("input", () => {

    const pin = pincodeInput.value.trim();

    const isDelhiNCR = delhiNcrPins.some(prefix =>
        pin.startsWith(prefix)
    );

    if (isDelhiNCR) {

        ownerDeliveryOption.style.display = "flex";

        ownerRadio.disabled = false;

    }
    else {

        ownerDeliveryOption.style.display = "none";

        ownerRadio.disabled = true;

        standardRadio.checked = true;

    }

    updateOrderSummary();

});

function updateOrderSummary() {

    const totalItems = getTotalItems();

    const freeShipping = totalItems >= 3;

    const subtotal = getCartTotal();
    const pin = pincodeInput.value.trim();

    const selectedDelivery =
        document.querySelector('input[name="delivery"]:checked');

    const deliveryMethod = selectedDelivery
        ? selectedDelivery.value
        : "standard";

    let shipping = 0;

    // Don't calculate shipping until pincode is complete
    if (pin.length < 6) {

        subtotalAmount.textContent = `₹${subtotal}`;
        shippingAmount.textContent = "--";
        orderTotal.textContent = `₹${subtotal}`;

        return;
    }

    if (freeShipping) {

        shipping = 0;

    } else {

        shipping = ownerRadio.checked
            ? SHIPPING.OWNER
            : SHIPPING.STANDARD;
    }

    subtotalAmount.textContent =
        `₹${subtotal}`;

    standardDeliveryPrice.textContent =
        freeShipping ? "FREE" : "₹60";

    shippingAmount.textContent =
        freeShipping
            ? "FREE"
            : money.format(shipping);
    if (freeShipping) {

        deliverySection.classList.remove("show");

    } else {

        deliverySection.classList.add("show");

    }

    orderTotal.textContent =
        `₹${subtotal + shipping}`;
}

function getShippingCharge() {

    const totalItems = getTotalItems();

    if (totalItems >= 3) {
        return 0;
    }

    const selectedDelivery =
        document.querySelector(
            'input[name="delivery"]:checked'
        );

    return selectedDelivery?.value === DELIVERY.OWNER
        ? SHIPPING.OWNER
        : SHIPPING.STANDARD;

}

async function createRazorpayOrder() {

    const response = await fetch("/api/create-order", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            amount: getCartTotal() + getShippingCharge()
        })

    });

    if (!response.ok) {
        throw new Error("Failed to create Razorpay order.");
    }

    return response.json();

}

async function verifyPayment(payment) {

    const response = await fetch("/api/verify-payment", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(payment)

    });

    return response.json();

}

async function placeOrder(customer, cart) {

    const response = await fetch("/api/place-order", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            customer,
            cart
        })

    });

    return response.json();

}

function initCheckout() {

    document
        .getElementById("checkoutForm")
        .addEventListener("submit", async (e) => {

            e.preventDefault();

            for (const item of state.cart) {

                if (item.designs.length !== item.quantity) {

                    alert(
                        `Your ${item.pack} requires ${item.quantity} designs. Please edit your cart before placing the order.`
                    );

                    return;
                }
            }

            if (!validateCheckoutName()) return;
            if (!validateCheckoutMobile()) return;
            if (!validateCheckoutAddress()) return;

            const order = await createRazorpayOrder();

            const options = {

                key: import.meta.env.VITE_RAZORPAY_KEY_ID,

                amount: order.amount,

                currency: order.currency,

                name: "Stick N Lit",

                description: "Custom Sticker Lighters",

                order_id: order.id,

                prefill: {
                    name: checkoutEls.name.value,
                    contact: checkoutEls.mobile.value
                },

                theme: {
                    color: "#000000"
                },

                handler: async function (response) {

                    try {

                        checkoutEls.modal.classList.remove("show");

                        showStatus(
                            null,
                            "Processing your payment...\nPlease don't close this page."
                        );
                        const paymentResult = await verifyPayment(response);
                        if (!paymentResult.success) {

                            showStatus(
                                false,
                                "Payment verification failed. Please try again."
                            );

                            return;
                        }

                        const selectedDelivery =
                            document.querySelector('input[name="delivery"]:checked');

                        const deliveryMethod = selectedDelivery
                            ? selectedDelivery.value
                            : "standard";

                        const shippingCharge = getShippingCharge();

                        const customer = {

                            full_name: checkoutEls.name.value.trim(),
                            mobile: checkoutEls.mobile.value.trim(),
                            address: checkoutEls.address.value.trim(),
                            pincode: checkoutEls.pincode.value.trim(),

                            delivery_method: deliveryMethod,
                            shipping_charge: shippingCharge,

                            payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id
                        };

                        const orderResult = await placeOrder(customer, state.cart);

                        if (orderResult.pending) {

                            showStatus(
                                true,
                                "Payment received successfully! Your order is being confirmed. If you don't receive confirmation shortly, please contact us with your payment ID."
                            );

                            clearCart();

                            return;
                        }

                        if (!orderResult.success) {

                            showStatus(
                                false,
                                orderResult.message || "Failed to save your order."
                            );

                            return;
                        }
                        checkoutEls.modal.classList.remove("show");

                        document.getElementById("checkoutForm").reset();
                        checkoutEls.nameError.textContent = "";
                        checkoutEls.mobileError.textContent = "";
                        checkoutEls.addressError.textContent = "";

                        clearCart()

                        showStatus(
                            true,
                            "Your payment was successful! Your order has been placed."
                        );

                    } catch (err) {

                        showStatus(
                            false,
                            "Something went wrong while verifying your payment."
                        );

                    }

                },

                modal: {
                    ondismiss: function () {

                        // Close checkout modal
                        checkoutEls.modal.classList.remove("show");

                        // Reset checkout form (optional)
                        document.getElementById("checkoutForm").reset();

                        checkoutEls.nameError.textContent = "";
                        checkoutEls.mobileError.textContent = "";
                        checkoutEls.addressError.textContent = "";

                        // Show payment cancelled message
                        showStatus(
                            false,
                            "Your payment was not completed. Your cart has been saved and you can try again anytime."
                        );

                    }
                }

            };

            const razorpay = new Razorpay(options);

            razorpay.open();

        });

    checkoutEls.name.addEventListener("blur", validateCheckoutName);
    checkoutEls.mobile.addEventListener("blur", validateCheckoutMobile);
    checkoutEls.address.addEventListener("blur", validateCheckoutAddress);

    checkoutEls.name.addEventListener("input", validateCheckoutName);
    checkoutEls.mobile.addEventListener("input", validateCheckoutMobile);
    checkoutEls.address.addEventListener("input", validateCheckoutAddress);

    deliveryOptions.forEach(option => {
        option.addEventListener("change", updateOrderSummary);
    });

    checkoutEls.mobile.addEventListener("input", () => {
        checkoutEls.mobile.value =
            checkoutEls.mobile.value.replace(/\D/g, "").slice(0, 10);
    });

    checkoutEls.modal.classList.remove("show");

    checkoutEls.name.value = "";
    checkoutEls.mobile.value = "";
    checkoutEls.address.value = "";

    updateOrderSummary();
    // Your checkoutForm submit listener should also be inside this function
}

export {
    createRazorpayOrder,
    verifyPayment,
    initCheckout,
    updateOrderSummary
};