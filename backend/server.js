require("dotenv").config();

const app = require("./src/app");
const {
    testDatabaseConnection
} = require("./src/config/database");


const PORT =
    process.env.PORT || 5000;


async function startServer() {

    console.log("Starting Healthcare Connect backend...");


    /* -----------------------------------------
       Test database
    ----------------------------------------- */

    await testDatabaseConnection();


    /* -----------------------------------------
       Start Express
    ----------------------------------------- */

    app.listen(
        PORT,
        () => {

            console.log(
                `Healthcare Connect API running on port ${PORT}`
            );

        }
    );
}


startServer();