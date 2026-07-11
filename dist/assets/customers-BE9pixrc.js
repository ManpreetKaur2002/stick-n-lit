import{t as e}from"./supabase-QT4RuUVr.js";/* empty css              */import"./auth--GAGNPjD.js";var t=document.getElementById(`customersTable`),{data:n,error:r}=await e.from(`customers`).select(`*`).order(`created_at`,{ascending:!1});r&&console.error(r),t.innerHTML=``;for(let r of n){let{data:n}=await e.from(`orders`).select(`id,total_price`).eq(`customer_id`,r.id),i=n.length,a=n.reduce((e,t)=>e+t.total_price,0),o=document.createElement(`tr`);o.innerHTML=`
        <td>${r.full_name}</td>

        <td>${r.mobile}</td>

        <td>${i}</td>

        <td>₹${a}</td>

        <td>
            <button
                class="view-btn"
                data-id="${r.id}">
                View
            </button>
        </td>
    `,t.appendChild(o)}document.querySelectorAll(`.view-btn`).forEach(e=>{e.addEventListener(`click`,()=>{let t=e.dataset.id;window.location.href=`customer.html?id=${t}`})});