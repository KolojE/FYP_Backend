import { ConnectDatabase } from "./config/db";
import express, { Express } from "express";
import { config } from "dotenv";
import mainRouter from "./router/main.router";

config();


console.log("Starting Server...")
const app: Express = express();

app.use(express.json())
app.use(mainRouter);
app.listen(8080, () => {
    console.log("Listening on port:8080")
})


ConnectDatabase(() => {
    console.log("Connected to Database");
});

