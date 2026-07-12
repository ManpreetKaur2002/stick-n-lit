import { supabase } from "../../src/js/supabase.js";

const {
    data: { session },
} = await supabase.auth.getSession();

console.log(session)
if (!session) {
    window.location.replace("login.html");
}

// Redirect immediately if the user signs out
supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_OUT") {
        window.location.replace("login.html");
    }
});

// Logout button
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener("click", async () => {

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error(error);
            alert(error.message);
            return;
        }

        window.location.replace("login.html");

    });

}