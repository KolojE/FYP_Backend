"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_controller_1 = require("../controller/authentication.controller");
const authenticationRouter = (0, express_1.Router)();
authenticationRouter.post("/login", authentication_controller_1.authentication);
exports.default = authenticationRouter;
//# sourceMappingURL=authentication.router.js.map