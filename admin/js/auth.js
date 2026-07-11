import { supabase } from "../../src/js/supabase.js";

const {
    data: { session }
} = await supabase.auth.getSession();

if (!session) {

    window.location.href = "login.html";

}

document.getElementById("logoutBtn")
    ?.addEventListener("click", async () => {

        await supabase.auth.signOut();

        window.location.href = "login.html";

    });