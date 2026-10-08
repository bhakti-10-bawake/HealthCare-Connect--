document.addEventListener("DOMContentLoaded", () => {

    const healthCentreButton =
        document.getElementById("healthCentreButton");


    healthCentreButton.addEventListener(
        "click",
        () => {

            window.location.href = "doctors.html";

        }
    );

});