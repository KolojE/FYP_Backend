"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectDatabase = void 0;
const dotenv_1 = require("dotenv");
const mongoose_1 = require("mongoose");
(0, dotenv_1.config)();
async function ConnectDatabase(callback) {
    console.log("Connecting database...");
    if (!process.env.DB_CONN_STRING) {
        throw new Error("Database connection is not set in dotevn !");
    }
    (0, mongoose_1.connect)(process.env.DB_CONN_STRING).then((resolved) => {
        console.log("Connected to database");
    }, (rejected) => {
        console.log(rejected);
        console.log("Connection to database is rejected!");
    });
}
exports.ConnectDatabase = ConnectDatabase;
//# sourceMappingURL=db.js.map