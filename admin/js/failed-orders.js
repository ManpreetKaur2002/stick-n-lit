import { supabase } from "../../src/js/supabase.js";
import "./auth.js";

const table = document.getElementById("failedOrdersTable");

const { data, error } = await supabase
    .from("failed_orders")
    .select("*")
    .order("created_at", { ascending: false });

if (error) {
    console.error(error);
}

table.innerHTML = "";

for (const order of data) {

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>#${order.id}</td>

        <td>${order.full_name || "-"}</td>

        <td>${order.mobile || "-"}</td>

        <td>₹${order.total_price ?? 0}</td>

        <td>${order.reason || "Payment Failed"}</td>

        <td>
            ${new Date(order.created_at)
            .toLocaleDateString("en-IN")}
        </td>
    `;

    table.appendChild(row);
}