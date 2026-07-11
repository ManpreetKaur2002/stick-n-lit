import { supabase } from "../../src/js/supabase.js";
import "./auth.js";

const params = new URLSearchParams(window.location.search);

const orderId = params.get("id");

// Fetch order
const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

if (orderError) {
    console.error(orderError);
}

console.log("order", order);

const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id);

console.log("items", items);
console.log("itemsError", itemsError);

const itemsContainer =
    document.getElementById("itemsContainer");

itemsContainer.innerHTML = "";

for (const item of items) {

    const { data: designs } = await supabase
        .from("order_designs")
        .select("*")
        .eq("order_item_id", item.id);

    const div = document.createElement("div");

    div.className = "order-item";

    div.innerHTML = `
        <h3>${item.pack_name}</h3>

        <p>Quantity: ${item.quantity}</p>

        <p>Price: ₹${item.price}</p>

        <h4>Designs</h4>

        <ul>
            ${designs.map(design => `
                <li>
                    ${design.design_name}
                    (${design.collection})
                </li>
            `).join("")}
        </ul>
    `;

    itemsContainer.appendChild(div);
}

// Fetch customer
const { data: customer, error: customerError } = await supabase
    .from("customers")
    .select("*")
    .eq("id", order.customer_id)
    .single();

console.log("customer", customer);
console.log("customerError", customerError);

document.getElementById("orderTitle").textContent =
    `Order #${order.id}`;

document.getElementById("customerName").textContent =
    customer.full_name;

document.getElementById("customerMobile").textContent =
    customer.mobile;

document.getElementById("customerAddress").textContent =
    customer.address;

document.getElementById("customerPincode").textContent =
    customer.pincode;

document.getElementById("deliveryMethod").textContent =
    customer.delivery_method;

document.getElementById("shippingCharge").textContent =
    `₹${order.shipping}`;

document.getElementById("paymentStatus").textContent =
    order.payment_status;

document.getElementById("paymentId").textContent =
    order.payment_id;

document.getElementById("razorpayOrderId").textContent =
    order.razorpay_order_id;

const statusSelect =
    document.getElementById("statusSelect");

statusSelect.value = order.status;

// const saveButton =
//     document.getElementById("saveStatus");
// saveButton.addEventListener("click", async () => {

//     const { error } = await supabase
//         .from("orders")
//         .update({
//             status: statusSelect.value
//         })
//         .eq("id", order.id);

//     if (error) {

//         alert("Failed to update status.");

//         console.error(error);

//         return;
//     }

//     alert("Status updated successfully!");

// });

document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "orders.html";
});

document.getElementById("saveStatus").addEventListener("click", async () => {

    const status = document.getElementById("statusSelect").value;

    const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId);

    if (error) {
        alert("Failed to update status");
        console.error(error);
        return;
    }

    location.reload();
    document.getElementById("statusSelect").value = order.status;
});

