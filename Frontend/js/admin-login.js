// ==========================================
// SSV HOTEL - ADMIN LOGIN
// ==========================================

const loginForm =
    document.getElementById("adminLoginForm");

const loginBtn =
    document.getElementById("loginBtn");

loginForm.addEventListener("submit", async function(e) {

    e.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();

    if (username === "" || password === "") {

        alert("Please enter Username and Password.");

        return;

    }

    loginBtn.disabled = true;

    loginBtn.innerHTML = "Logging in...";

    try {

        const response = await fetch(
            `${API_BASE}/api/admin/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    username: username,

                    password: password

                })

            }
        );

        const result = await response.json();

        if (result.success) {

            localStorage.setItem(
                "adminLoggedIn",
                "true"
            );

            localStorage.setItem(
                "adminName",
                username
            );

            window.location.href =
                "admin-dashboard.html";

        } else {

            alert(
                result.message ||
                "Invalid username or password."
            );

            loginBtn.disabled = false;

            loginBtn.innerHTML = "🔐 Login";

        }

    }

    catch (error) {

        console.error(
            "Admin Login Error:",
            error
        );

        alert(
            "Unable to connect to server."
        );

        loginBtn.disabled = false;

        loginBtn.innerHTML = "🔐 Login";

    }

});

// ==========================================
// CHECK EXISTING LOGIN
// ==========================================

window.addEventListener("load", function() {

    if (
        localStorage.getItem("adminLoggedIn")
        === "true"
    ) {

        window.location.href =
            "admin-dashboard.html";

    }

});

// ==========================================
// RESET BUTTON
// ==========================================

window.addEventListener("pageshow", function() {

    loginBtn.disabled = false;

    loginBtn.innerHTML = "🔐 Login";

});