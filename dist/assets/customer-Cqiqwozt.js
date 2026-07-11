import{t as e}from"./supabase-QT4RuUVr.js";/* empty css              */import"./auth--GAGNPjD.js";var t=new URLSearchParams(window.location.search).get(`id`);if(!t)throw alert(`Customer ID missing`),Error(`Customer ID missing`);var{data:n,error:r}=await e.from(`customers`).select(`*`).eq(`id`,t).single();r?console.error(r):(document.getElementById(`customerName`).textContent=n.full_name,document.getElementById(`mobile`).textContent=n.mobile,document.getElementById(`address`).textContent=n.address,document.getElementById(`pincode`).textContent=n.pincode);var{data:i,error:a}=await e.from(`orders`).select(`*`).eq(`customer_id`,t).order(`created_at`,{ascending:!1});a&&console.error(a),document.getElementById(`totalOrders`).textContent=i.length;var o=i.reduce((e,t)=>e+t.total_price,0);document.getElementById(`totalSpent`).textContent=`₹${o}`;var s=document.getElementById(`ordersList`);s.innerHTML=``;for(let e of i){let t=document.createElement(`div`);t.className=`order-item`,t.innerHTML=`
        <h3>Order #${e.id}</h3>

        <p>Status : ${e.status}</p>

        <p>Total : ₹${e.total_price}</p>

        <p>
            ${new Date(e.created_at).toLocaleDateString()}
        </p>

        <a
            class="view-btn"
            href="order.html?id=${e.id}">
            View Order
        </a>
    `,s.appendChild(t)}