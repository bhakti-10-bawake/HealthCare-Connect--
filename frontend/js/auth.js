/* =========================================================
   HEALTHCARE CONNECT
   AUTHENTICATION
========================================================= */

const AUTH_API_BASE_URL = "http://localhost:5000/api/auth";


/* =========================================================
   HELPERS
========================================================= */

function authShowMessage(message, type = "error") {

    if (typeof showMessage === "function") {

        showMessage(message, type);

        return;
    }

    alert(message);
}


function authSetLoading(button, loading, loadingText = "Please wait...") {

    if (!button) return;

    if (loading) {

        button.dataset.originalText =
            button.innerHTML;

        button.disabled = true;

        button.innerHTML = loadingText;

    } else {

        button.disabled = false;

        if (button.dataset.originalText) {

            button.innerHTML =
                button.dataset.originalText;
        }
    }
}


function saveAuthentication(result) {

    if (!result || !result.token) {
        return;
    }

    localStorage.setItem(
        "healthcareToken",
        result.token
    );

    if (result.user) {

        localStorage.setItem(
            "healthcareUser",
            JSON.stringify(result.user)
        );
    }
}


/* =========================================================
   ROLE REDIRECTION
========================================================= */

function redirectByRole(user) {

    const role =
        user?.role || "PATIENT";


    switch (role.toUpperCase()) {

        case "DOCTOR":

            window.location.href =
                "doctor-dashboard.html";

            break;


        case "PHARMACY":

            window.location.href =
                "pharmacy-dashboard.html";

            break;


        case "ADMIN":

            window.location.href =
                "admin-dashboard.html";

            break;


        default:

            window.location.href =
                "dashboard.html";

            break;
    }
}


/* =========================================================
   LOGIN
========================================================= */

async function handleLogin(event) {

    event.preventDefault();


    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const loginButton =
        document.getElementById("loginButton");


    const email =
        emailInput?.value.trim();

    const password =
        passwordInput?.value;


    if (!email || !password) {

        authShowMessage(
            "Please enter your email and password."
        );

        return;
    }


    authSetLoading(
        loginButton,
        true,
        "Signing in..."
    );


    try {

        console.log(
            "Sending login request to:",
            `${AUTH_API_BASE_URL}/login`
        );


        const response =
            await fetch(
                `${AUTH_API_BASE_URL}/login`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        email,

                        password

                    })
                }
            );


        const result =
            await response.json();


        console.log(
            "Login response:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to login."
            );
        }


        saveAuthentication(result);


        authShowMessage(
            "Login successful!",
            "success"
        );


        setTimeout(() => {

            redirectByRole(
                result.user
            );

        }, 500);

    }

    catch (error) {

        console.error(
            "Login error:",
            error
        );


        authShowMessage(
            error.message ||
            "Unable to connect to the server."
        );

    }

    finally {

        authSetLoading(
            loginButton,
            false
        );
    }
}


/* =========================================================
   REGISTER
========================================================= */

async function handleRegister(event) {

    event.preventDefault();


    const fullNameInput =
        document.getElementById("fullName");

    const emailInput =
        document.getElementById("registerEmail");

    const phoneInput =
        document.getElementById("phone");

    const passwordInput =
        document.getElementById("registerPassword");

    const confirmPasswordInput =
        document.getElementById("confirmPassword");

    const termsInput =
        document.getElementById("terms");

    const registerButton =
        document.getElementById("registerButton");


    const fullName =
        fullNameInput?.value.trim();

    const email =
        emailInput?.value.trim();

    const phone =
        phoneInput?.value.trim();

    const password =
        passwordInput?.value;

    const confirmPassword =
        confirmPasswordInput?.value;


    /* -----------------------------------------
       Validation
    ----------------------------------------- */

    if (
        !fullName ||
        !email ||
        !phone ||
        !password ||
        !confirmPassword
    ) {

        authShowMessage(
            "Please complete all required fields."
        );

        return;
    }


    if (password.length < 8) {

        authShowMessage(
            "Password must contain at least 8 characters."
        );

        return;
    }


    if (password !== confirmPassword) {

        authShowMessage(
            "Passwords do not match."
        );

        return;
    }


    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(email)) {

        authShowMessage(
            "Please enter a valid email address."
        );

        return;
    }


    const phoneRegex =
        /^[0-9]{10}$/;


    if (!phoneRegex.test(phone)) {

        authShowMessage(
            "Please enter a valid 10-digit phone number."
        );

        return;
    }


    if (
        termsInput &&
        !termsInput.checked
    ) {

        authShowMessage(
            "Please accept the terms of service."
        );

        return;
    }


    authSetLoading(
        registerButton,
        true,
        "Creating account..."
    );


    try {

        console.log(
            "Sending registration request to:",
            `${AUTH_API_BASE_URL}/register`
        );


        const response =
            await fetch(
                `${AUTH_API_BASE_URL}/register`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        fullName,

                        email,

                        phone,

                        password

                    })
                }
            );


        const result =
            await response.json();


        console.log(
            "Registration response:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result.message ||
                "Unable to create account."
            );
        }


        saveAuthentication(result);


        authShowMessage(
            "Account created successfully!",
            "success"
        );


        setTimeout(() => {

            redirectByRole(
                result.user
            );

        }, 500);

    }

    catch (error) {

        console.error(
            "Registration error:",
            error
        );


        authShowMessage(
            error.message ||
            "Unable to connect to the server."
        );

    }

    finally {

        authSetLoading(
            registerButton,
            false
        );
    }
}


/* =========================================================
   PASSWORD VISIBILITY
========================================================= */

function setupPasswordToggle(
    toggleId,
    inputId
) {

    const toggle =
        document.getElementById(toggleId);

    const input =
        document.getElementById(inputId);


    if (!toggle || !input) {
        return;
    }


    toggle.addEventListener(
        "click",
        () => {

            const isPassword =
                input.type === "password";


            input.type =
                isPassword
                    ? "text"
                    : "password";


            const icon =
                toggle.querySelector("i");


            if (icon) {

                icon.className =
                    isPassword
                        ? "bi bi-eye-slash"
                        : "bi bi-eye";
            }
        }
    );
}


/* =========================================================
   FORGOT PASSWORD
========================================================= */

function handleForgotPassword(event) {

    event.preventDefault();


    authShowMessage(
        "Password recovery will be available soon."
    );
}


/* =========================================================
   INITIALIZE LOGIN PAGE
========================================================= */

function initializeLogin() {

    const loginForm =
        document.getElementById("loginForm");


    if (!loginForm) {
        return;
    }


    loginForm.addEventListener(
        "submit",
        handleLogin
    );


    setupPasswordToggle(
        "togglePassword",
        "password"
    );


    const forgotPassword =
        document.getElementById(
            "forgotPassword"
        );


    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            handleForgotPassword
        );
    }
}


/* =========================================================
   INITIALIZE REGISTER PAGE
========================================================= */

function initializeRegister() {

    const registerForm =
        document.getElementById(
            "registerForm"
        );


    if (!registerForm) {
        return;
    }


    registerForm.addEventListener(
        "submit",
        handleRegister
    );


    setupPasswordToggle(
        "toggleRegisterPassword",
        "registerPassword"
    );
}


/* =========================================================
   START
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeLogin();

        initializeRegister();

    }
);