"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const registration_controller_1 = require("../controller/registration.controller");
const registrationRouter = (0, express_1.Router)();
registrationRouter.post("/register", registration_controller_1.register_Complainant);
exports.default = registrationRouter;
//# sourceMappingURL=registration.rotuer.js.map