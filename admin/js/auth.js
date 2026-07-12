import { supabase } from "../../src/js/supabase.js";

// Check if the user is logged in
const {
    data: { session }
} = await supabase.auth.getSession();

// If there is no session, redirect to login
if (!session) {
    window.location.replace("login.html");
}

// Listen for auth changes
supabase.auth.onAuthStateChange((event) => {

    if (event === "SIGNED_OUT") {
        window.location.replace("login.html");
    }

});

// Logout
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        const { error } = await supabase.auth.signOut({
            scope: "global"
        });

        if (error) {
            console.error(error);
            alert("Logout failed");
            return;
        }

        window.location.replace("login.html");

    });

}