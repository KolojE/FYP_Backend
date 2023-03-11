import { config } from "dotenv";
import { connect } from "mongoose";
config();

export async function ConnectDatabase(callback: () => void) {
    console.log("Connecting database...");

    if (!process.env.DB_CONN_STRING) {
        throw new Error("Database connection is not set in dotevn !");
    }

    connect(process.env.DB_CONN_STRING).then((resolved) => {
        console.log("Connected to database");

    }, (rejected) => {
        console.log(rejected);
        console.log("Connection to database is rejected!");

    })

}



