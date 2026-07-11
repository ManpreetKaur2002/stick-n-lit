import { supabase } from "../../src/js/supabase.js";
import "./auth.js";

const params = new URLSearchParams(window.location.search);

const customerId = params.get("id");

if (!customerId) {

    alert("Customer ID missing");

    throw new Error("Customer ID missing");

}

// CUSTOMER

const { data: customer, error: customerError } =
    await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId)
        .single();

if (customerError) {

    console.error(customerError);

} else {

    document.getElementById("customerName").textContent =
        customer.full_name;

    document.getElementById("mobile").textContent =
        customer.mobile;

    document.getElementById("address").textContent =
        customer.address;

    document.getElementById("pincode").textContent =
        customer.pincode;

}

// ORDERS

const { data: orders, error: ordersError } =
    await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

if (ordersError) {

    console.error(ordersError);

}

document.getElementById("totalOrders").textContent =
    orders.length;

const totalSpent = orders.reduce(
    (sum, order) => sum + order.total_price,
    0
);

document.getElementById("totalSpent").textContent =
    `₹${totalSpent}`;

const ordersList =
    document.getElementById("ordersList");

ordersList.innerHTML = "";

for (const order of orders) {

    const div = document.createElement("div");

    div.className = "order-item";

    div.innerHTML = `
        <h3>Order #${order.id}</h3>

        <p>Status : ${order.status}</p>

        <p>Total : ₹${order.total_price}</p>

        <p>
            ${new Date(order.created_at).toLocaleDateString()}
        </p>

        <a
            class="view-btn"
            href="order.html?id=${order.id}">
            View Order
        </a>
    `;

    ordersList.appendChild(div);

}
