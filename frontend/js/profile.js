document.addEventListener("DOMContentLoaded", () => {

    const STORAGE_KEY = "healthcareProfile";


    const defaultProfile = {
        name: "Aarav Kulkarni",
        email: "aarav.kulkarni@example.com",
        phone: "+91 98765 43210",
        address: "Kopargaon, Maharashtra",
        role: "Patient"
    };


    let profile = loadProfile();


    function loadProfile() {

        try {

            const stored =
                localStorage.getItem(STORAGE_KEY);

            if (stored) {
                return {
                    ...defaultProfile,
                    ...JSON.parse(stored)
                };
            }

        } catch (error) {

            console.error(
                "Unable to load profile:",
                error
            );

        }

        return { ...defaultProfile };

    }


    function saveProfile() {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(profile)
        );

    }


    function getInitials(name) {

        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(part => part.charAt(0).toUpperCase())
            .join("");

    }


    const profileInitials =
        document.getElementById("profileInitials");

    const profileName =
        document.getElementById("profileName");

    const profileEmail =
        document.getElementById("profileEmail");

    const profileFullName =
        document.getElementById("profileFullName");

    const profilePhone =
        document.getElementById("profilePhone");

    const profileEmailInput =
        document.getElementById("profileEmailInput");

    const profileAddress =
        document.getElementById("profileAddress");

    const editProfileButton =
        document.getElementById("editProfileButton");

    const saveProfileButton =
        document.getElementById("saveProfileButton");

    const cancelProfileButton =
        document.getElementById("cancelProfileButton");

    const profileForm =
        document.getElementById("profileForm");

    const logoutButton =
        document.getElementById("logoutButton");


    function renderProfile() {

        profileInitials.textContent =
            getInitials(profile.name);

        profileName.textContent =
            profile.name;

        profileEmail.textContent =
            profile.email;

        profileFullName.value =
            profile.name;

        profilePhone.value =
            profile.phone;

        profileEmailInput.value =
            profile.email;

        profileAddress.value =
            profile.address;

    }


    function openEditMode() {

        profileForm.classList.add("editing");

        profileFullName.focus();

        profileForm.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }


    function closeEditMode() {

        profileForm.classList.remove("editing");

        renderProfile();

    }


    editProfileButton.addEventListener(
        "click",
        openEditMode
    );


    cancelProfileButton.addEventListener(
        "click",
        closeEditMode
    );


    saveProfileButton.addEventListener(
        "click",
        () => {

            const name =
                profileFullName.value.trim();

            const email =
                profileEmailInput.value.trim();

            const phone =
                profilePhone.value.trim();

            const address =
                profileAddress.value.trim();


            if (!name || !email) {

                if (typeof showMessage === "function") {

                    showMessage(
                        "Name and email are required.",
                        "warning"
                    );

                }

                return;

            }


            profile = {

                ...profile,

                name,
                email,
                phone,
                address

            };


            saveProfile();

            renderProfile();

            profileForm.classList.remove("editing");


            if (typeof showMessage === "function") {

                showMessage(
                    "Profile updated successfully.",
                    "success"
                );

            }

        }
    );


    logoutButton.addEventListener(
        "click",
        () => {

            const confirmed =
                window.confirm(
                    "Are you sure you want to log out?"
                );


            if (!confirmed) return;


            localStorage.removeItem("healthcareToken");
            localStorage.removeItem("healthcareUser");

            window.location.href = "login.html";

        }
    );


    renderProfile();

});