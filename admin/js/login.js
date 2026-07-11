import { supabase } from "../../src/js/supabase.js";

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        document.getElementById("errorMessage").textContent =
            error.message;
        return;
    }

    window.location.href = "index.html";
});