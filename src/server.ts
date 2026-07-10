import app from "./app";
import "dotenv/config";
import { prisma } from "./lib/prisma";
import config from "./config";
const PORT = config.port;
async function main() {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully.")
        app.listen(PORT, () => {

            console.log(`Server is running on port : ${PORT}`)

        })
    } catch (error) {
         await prisma.$disconnect();
        console.error("Error starting the server:", error)
        process.exit(1)
    }
}

main();