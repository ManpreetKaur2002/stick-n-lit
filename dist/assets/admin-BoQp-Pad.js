import{t as e}from"./supabase-QT4RuUVr.js";/* empty css              */import"./auth--GAGNPjD.js";var{data:t}=await e.from(`orders`).select(`*`),{data:n}=await e.from(`failed_orders`).select(`*`);document.getElementById(`totalOrders`).textContent=t.length;var r=t.reduce((e,t)=>e+t.total_price,0);document.getElementById(`totalRevenue`).textContent=`₹${r}`;var i=t.filter(e=>e.status===`Pending`);document.getElementById(`pendingOrders`).textContent=i.length,document.getElementById(`failedPayments`).textContent=n.length;var a=document.getElementById(`recentOrders`),o=t.slice(0,5);for(let t of o){let{data:n}=await e.from(`customers`).select(`*`).eq(`id`,t.customer_id).single(),r=document.createElement(`tr`);r.innerHTML=`
        <td>#${t.id}</td>

        <td>${n.full_name}</td>

        <td>₹${t.total_price}</td>

        <td>
            <span class="status status-${t.status.toLowerCase()}">
                ${t.status}
            </span>
        </td>

        <td>
            <a
                class="view-btn"
                href="order.html?id=${t.id}">
                View
            </a>
        </td>
    `,a.appendChild(r)}