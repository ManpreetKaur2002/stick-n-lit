export const money = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
});

export function formatPrice(amount) {
    return money.format(amount);
}

export const delhiNcrPins = [
    "110", // Delhi
    "121", // Faridabad
    "122", // Gurgaon
    "201", // Noida
    "203", // Greater Noida
];

export const DELIVERY = {
    STANDARD: "standard",
    OWNER: "owner"
};

export const SHIPPING = {
    STANDARD: 60,
    OWNER: 5000,
    FREE_MIN_QUANTITY: 3
};

export const PACKS = {
    SINGLE: {
        id: "single",
        quantity: 1,
        price: 199
    },
    TWIN: {
        id: "twin",
        quantity: 2,
        price: 359
    },
    TRIO: {
        id: "trio",
        quantity: 3,
        price: 549
    },
    FIVE: {
        id: "five",
        quantity: 5,
        price: 849
    }
};

export const ORDER_STATUS = {
    CONFIRMED: "Confirmed",
    PENDING: "Pending"
};

export const PAYMENT_STATUS = {
    PAID: "Paid",
    FAILED: "Failed"
};

export const collections = {
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