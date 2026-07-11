import { supabase } from "../../src/js/supabase.js";
import "./auth.js";

const table = document.getElementById("ordersTable");

const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

if (error) {
    console.error(error);
} else {
    renderOrders(orders);
}

async function renderOrders(orders) {

    table.innerHTML = "";

    for (const order of orders) {

        const { data: customer } = await supabase
            .from("customers")
            .select("*")
            .eq("id", order.customer_id)
            .single();

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>#${order.id}</td>

            <td>
                <strong>${customer.full_name}</strong><br>
                ${customer.mobile}
            </td>

            <td>₹${order.total_price}</td>

            <td>${order.payment_status}</td>

            <td>
                <span class="status status-${order.status.toLowerCase()}">
                    ${order.status}
                </span>
            </td>

            <td>
                ${new Date(order.created_at).toLocaleDateString()}
            </td>

            <td>
                <a
                    class="view-btn"
                    href="order.html?id=${order.id}">
                    View
                </a>
            </td>
        `;

        table.appendChild(tr);
    }
}