document.addEventListener("DOMContentLoaded", () => {

    /*
     * Frontend demonstration data.
     * This will later come from the real queue API.
     */

    const queueData = {
        queueNumber: "A-24",
        doctor: "Dr. Ananya Sharma",
        centre: "Sahyadri Community Health Centre",

        currentToken: "A-20",

        peopleAhead: 4,

        estimatedWait: 20,

        progress: 68
    };


    const queueNumber =
        document.getElementById("queueNumber");

    const queueDoctor =
        document.getElementById("queueDoctor");

    const queueCentre =
        document.getElementById("queueCentre");

    const currentToken =
        document.getElementById("currentToken");

    const peopleAhead =
        document.getElementById("peopleAhead");

    const estimatedWait =
        document.getElementById("estimatedWait");

    const queueProgress =
        document.getElementById("queueProgress");


    queueNumber.textContent =
        queueData.queueNumber;

    queueDoctor.textContent =
        queueData.doctor;

    queueCentre.textContent =
        queueData.centre;

    currentToken.textContent =
        queueData.currentToken;

    peopleAhead.textContent =
        queueData.peopleAhead;

    estimatedWait.textContent =
        `~${queueData.estimatedWait} minutes`;

    queueProgress.style.width =
        `${queueData.progress}%`;


    /*
     * Small simulated live update.
     *
     * This is intentionally only visual for now.
     * Later the backend queue endpoint will provide
     * the actual token and waiting position.
     */

    let simulatedPeopleAhead =
        queueData.peopleAhead;


    setInterval(() => {

        if (simulatedPeopleAhead <= 1) {
            return;
        }

        /*
         * Keep the demo stable rather than changing
         * the queue every few seconds.
         */

    }, 30000);

});