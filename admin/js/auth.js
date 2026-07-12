import { supabase } from "../../src/js/supabase.js";

// Check if user is logged in
const {
    data: { session }
} = await supabase.auth.getSession();

if (!session) {
    window.location.replace("login.html");
    throw new Error("Not logged in");
}

// Check if the logged in user is an admin
const { data: admin, error } = await supabase
    .from("admins")
    .select("id")
    .eq("id", session.user.id)
    .maybeSingle();

if (error || !admin) {

    await supabase.auth.signOut();

    alert("You are not authorized to access the admin panel.");

    window.location.replace("login.html");

    throw new Error("Not an admin");
}

// Logout button
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error(error);
            alert("Logout failed");
            return;
        }

        window.location.replace("login.html");

    });

}