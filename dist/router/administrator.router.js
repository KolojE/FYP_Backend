"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const administrator_controller_1 = require("../controller/administrator.controller");
const errorHandler_1 = require("../exception/errorHandler");
const authentication_middleware_1 = require("../middleware/authentication.middleware");
const administratorRouter = (0, express_1.Router)();
administratorRouter.use(authentication_middleware_1.authenticationMiddleware);
administratorRouter.post("/addForm", administrator_controller_1.addFormController);
administratorRouter.post("/updateForm", administrator_controller_1.updateFormController);
administratorRouter.post("/updateMember", administrator_controller_1.updateMembersController);
administratorRouter.get("/viewMember", administrator_controller_1.viewMembersController);
administratorRouter.use(errorHandler_1.clientErrorHandler);
administratorRouter.use(errorHandler_1.errorHandler);
exports.default = administratorRouter;
//# sourceMappingURL=administrator.router.js.map