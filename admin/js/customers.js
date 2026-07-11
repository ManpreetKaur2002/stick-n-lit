import { supabase } from "../../src/js/supabase.js";
import "./auth.js";

const table = document.getElementById("customersTable");

const { data: customers, error } = await supabase
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

if (error) {
    console.error(error);
}

table.innerHTML = "";

for (const customer of customers) {

    const { data: orders } = await supabase
        .from("orders")
        .select("id,total_price")
        .eq("customer_id", customer.id);

    const totalOrders = orders.length;

    const totalSpent = orders.reduce(
        (sum, order) => sum + order.total_price,
        0
    );

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${customer.full_name}</td>

        <td>${customer.mobile}</td>

        <td>${totalOrders}</td>

        <td>₹${totalSpent}</td>

        <td>
            <button
                class="view-btn"
                data-id="${customer.id}">
                View
            </button>
        </td>
    `;

    table.appendChild(row);
}

document.querySelectorAll(".view-btn").forEach(button => {

    button.addEventListener("click", () => {

        const customerId = button.dataset.id;

        window.location.href =
            `customer.html?id=${customerId}`;

    });

});