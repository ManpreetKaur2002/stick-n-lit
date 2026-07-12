import { supabase } from "../../src/js/supabase.js";

// If already logged in, go to dashboard
const {
    data: { session },
} = await supabase.auth.getSession();

if (session) {
    window.location.replace("index.html");
}

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    const { error } =
        await supabase.auth.signInWithPassword({

            email,
            password,

        });

    if (error) {

        document.getElementById("errorMessage").textContent =
            error.message;

        return;

    }

    window.location.replace("index.html");

});