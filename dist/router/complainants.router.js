"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const complainant_controller_1 = require("../controller/complainant.controller");
const authentication_1 = require("../middleware/authentication");
const complainantRouter = (0, express_1.Router)();
complainantRouter.use(authentication_1.authentication);
complainantRouter.post("/registerComplainant", complainant_controller_1.register_Complainant);
exports.default = complainantRouter;
//# sourceMappingURL=complainants.router.js.map