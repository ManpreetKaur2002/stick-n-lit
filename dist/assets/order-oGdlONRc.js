import{t as e}from"./supabase-QT4RuUVr.js";/* empty css              */import"./auth--GAGNPjD.js";var t=new URLSearchParams(window.location.search).get(`id`),{data:n,error:r}=await e.from(`orders`).select(`*`).eq(`id`,t).single();r&&console.error(r),console.log(`order`,n);var{data:i,error:a}=await e.from(`order_items`).select(`*`).eq(`order_id`,n.id);console.log(`items`,i),console.log(`itemsError`,a);var o=document.getElementById(`itemsContainer`);o.innerHTML=``;for(let t of i){let{data:n}=await e.from(`order_designs`).select(`*`).eq(`order_item_id`,t.id),r=document.createElement(`div`);r.className=`order-item`,r.innerHTML=`
        <h3>${t.pack_name}</h3>

        <p>Quantity: ${t.quantity}</p>

        <p>Price: ₹${t.price}</p>

        <h4>Designs</h4>

        <ul>
            ${n.map(e=>`
                <li>
                    ${e.design_name}
                    (${e.collection})
                </li>
            `).join(``)}
        </ul>
    `,o.appendChild(r)}var{data:s,error:c}=await e.from(`customers`).select(`*`).eq(`id`,n.customer_id).single();console.log(`customer`,s),console.log(`customerError`,c),document.getElementById(`orderTitle`).textContent=`Order #${n.id}`,document.getElementById(`customerName`).textContent=s.full_name,document.getElementById(`customerMobile`).textContent=s.mobile,document.getElementById(`customerAddress`).textContent=s.address,document.getElementById(`customerPincode`).textContent=s.pincode,document.getElementById(`deliveryMethod`).textContent=s.delivery_method,document.getElementById(`shippingCharge`).textContent=`₹${n.shipping}`,document.getElementById(`paymentStatus`).textContent=n.payment_status,document.getElementById(`paymentId`).textContent=n.payment_id,document.getElementById(`razorpayOrderId`).textContent=n.razorpay_order_id;var l=document.getElementById(`statusSelect`);l.value=n.status,document.getElementById(`backBtn`).addEventListener(`click`,()=>{window.location.href=`orders.html`}),document.getElementById(`saveStatus`).addEventListener(`click`,async()=>{let r=document.getElementById(`statusSelect`).value,{error:i}=await e.from(`orders`).update({status:r}).eq(`id`,t);if(i){alert(`Failed to update status`),console.error(i);return}location.reload(),document.getElementById(`statusSelect`).value=n.status});