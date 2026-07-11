import{t as e}from"./supabase-QT4RuUVr.js";/* empty css              */import"./auth--GAGNPjD.js";var t=document.getElementById(`ordersTable`),{data:n,error:r}=await e.from(`orders`).select(`*`).order(`created_at`,{ascending:!1});r?console.error(r):i(n);async function i(n){t.innerHTML=``;for(let r of n){let{data:n}=await e.from(`customers`).select(`*`).eq(`id`,r.customer_id).single(),i=document.createElement(`tr`);i.innerHTML=`
            <td>#${r.id}</td>

            <td>
                <strong>${n.full_name}</strong><br>
                ${n.mobile}
            </td>

            <td>₹${r.total_price}</td>

            <td>${r.payment_status}</td>

            <td>
                <span class="status status-${r.status.toLowerCase()}">
                    ${r.status}
                </span>
            </td>

            <td>
                ${new Date(r.created_at).toLocaleDateString()}
            </td>

            <td>
                <a
                    class="view-btn"
                    href="order.html?id=${r.id}">
                    View
                </a>
            </td>
        `,t.appendChild(i)}}