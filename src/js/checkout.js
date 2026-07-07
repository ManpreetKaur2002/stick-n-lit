import { checkoutEls, successModal, showStatus } from "./ui.js";

import {
    validateCheckoutName,
    validateCheckoutMobile,
    validateCheckoutAddress
} from "./validation.js";

import { getCartTotal, clearCart, state } from "./cart.js";

async function createRazorpayOrder() {

    const response = await fetch("/api/create-order", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            amount: getCartTotal()
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

                        console.time("verifyPayment");
                        const paymentResult = await verifyPayment(response);
                        console.timeEnd("verifyPayment");

                        if (!paymentResult.success) {

                            showStatus(
                                false,
                                "Payment verification failed. Please try again."
                            );

                            return;
                        }

                        const customer = {
                            full_name: checkoutEls.name.value.trim(),
                            mobile: checkoutEls.mobile.value.trim(),
                            address: checkoutEls.address.value.trim(),

                            payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id
                        };

                        console.time("placeOrder");
                        const orderResult = await placeOrder(customer, state.cart);
                        console.timeEnd("placeOrder");

                        console.log("Place Order Result:", orderResult);

                        if (!orderResult.success) {

                            console.error(orderResult);

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

                        console.error(err);

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

    checkoutEls.mobile.addEventListener("input", () => {
        checkoutEls.mobile.value =
            checkoutEls.mobile.value.replace(/\D/g, "").slice(0, 10);
    });

    checkoutEls.modal.classList.remove("show");

    checkoutEls.name.value = "";
    checkoutEls.mobile.value = "";
    checkoutEls.address.value = "";

    // Your checkoutForm submit listener should also be inside this function
}

export {
    createRazorpayOrder,
    verifyPayment,
    initCheckout
};