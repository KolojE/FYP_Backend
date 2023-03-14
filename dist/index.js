"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./config/db");
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const organization_router_1 = __importDefault(require("./router/organization.router"));
const complainants_router_1 = __importDefault(require("./router/complainants.router"));
(0, dotenv_1.config)();
console.log("Starting Server...");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/Organization", organization_router_1.default);
app.use("/Complainant", complainants_router_1.default);
app.listen(8080, () => {
    console.log("Listening on port:8080");
});
(0, db_1.ConnectDatabase)(() => {
    console.log("Connected to Database");
});
//# sourceMappingURL=index.js.map