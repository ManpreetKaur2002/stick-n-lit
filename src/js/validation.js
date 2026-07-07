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

function validateCheckoutName() {

    const name = checkoutEls.name.value.trim();

    if (name.length < 3) {

        checkoutEls.nameError.textContent =
            "Name must be at least 3 characters.";

        return false;
    }

    if (!/^[A-Za-z ]+$/.test(name)) {

        checkoutEls.nameError.textContent =
            "Only letters are allowed.";

        return false;
    }

    checkoutEls.nameError.textContent = "";

    return true;
}

function validateCheckoutMobile() {
    const mobile = checkoutEls.mobile.value.trim();

    if (!/^[6-9]\d{9}$/.test(mobile)) {
        checkoutEls.mobileError.textContent =
            "Enter a valid 10-digit mobile number.";
        return false;
    }

    checkoutEls.mobileError.textContent = "";

    return true;
}

function validateCheckoutAddress() {
    const address = checkoutEls.address.value.trim();

    if (address.length < 10) {
        checkoutEls.addressError.textContent =
            "Please enter a complete address.";
        return false;
    }

    checkoutEls.addressError.textContent = "";
    return true;
}

export {
    validateCheckoutName,
    validateCheckoutMobile,
    validateCheckoutAddress
};