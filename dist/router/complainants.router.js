"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const complainant_controller_1 = require("../controller/complainant.controller");
const errorHandler_1 = require("../exception/errorHandler");
const complainantRouter = (0, express_1.Router)();
complainantRouter.post("/registerComplainant", complainant_controller_1.register_Complainant);
complainantRouter.use(errorHandler_1.clientErrorHandler);
complainantRouter.use(errorHandler_1.errorHandler);
exports.default = complainantRouter;
//# sourceMappingURL=complainants.router.js.map