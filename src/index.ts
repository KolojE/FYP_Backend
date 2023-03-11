import { ConnectDatabase } from "./config/db";
import express, { Express, Request, Response } from "express";
import { config } from "dotenv";
import organizationRouter from "./router/organization.router";

config();


console.log("Starting Server...")
const app: Express = express();

app.use(express.json())
app.use("/Organization", organizationRouter)

app.listen(8080, () => {
    console.log("Listening on port:8080")
})


ConnectDatabase(() => {
    console.log("Connected to Database");
});

