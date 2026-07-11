import{t as e}from"./supabase-QT4RuUVr.js";/* empty css              */import"./auth--GAGNPjD.js";var t=document.getElementById(`failedOrdersTable`),{data:n,error:r}=await e.from(`failed_orders`).select(`*`).order(`created_at`,{ascending:!1});r&&console.error(r),t.innerHTML=``;for(let e of n){let n=document.createElement(`tr`);n.innerHTML=`
        <td>#${e.id}</td>

        <td>${e.full_name||`-`}</td>

        <td>${e.mobile||`-`}</td>

        <td>₹${e.total_price??0}</td>

        <td>${e.reason||`Payment Failed`}</td>

        <td>
            ${new Date(e.created_at).toLocaleDateString(`en-IN`)}
        </td>
    `,t.appendChild(n)}