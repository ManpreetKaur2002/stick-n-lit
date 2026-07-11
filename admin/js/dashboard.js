import { supabase } from "../../src/js/supabase.js";
import "./auth.js";

const { data: orders } = await supabase
    .from("orders")
    .select("*");

const { data: failed } = await supabase
    .from("failed_orders")
    .select("*");

document.getElementById("totalOrders").textContent =
    orders.length;

const revenue =
    orders.reduce((sum, order) =>
        sum + order.total_price, 0);

document.getElementById("totalRevenue").textContent =
    `₹${revenue}`;

const pending =
    orders.filter(order =>
        order.status === "Pending");

document.getElementById("pendingOrders").textContent =
    pending.length;

document.getElementById("failedPayments").textContent =
    failed.length;

const recentTable =
    document.getElementById("recentOrders");

const latestOrders =
    orders.slice(0, 5);

for (const order of latestOrders) {

    const { data: customer } = await supabase
        .from("customers")
        .select("*")
        .eq("id", order.customer_id)
        .single();

    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>#${order.id}</td>

        <td>${customer.full_name}</td>

        <td>₹${order.total_price}</td>

        <td>
            <span class="status status-${order.status.toLowerCase()}">
                ${order.status}
            </span>
        </td>

        <td>
            <a
                class="view-btn"
                href="order.html?id=${order.id}">
                View
            </a>
        </td>
    `;

    recentTable.appendChild(tr);

}