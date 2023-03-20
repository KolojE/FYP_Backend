"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const errorHandler_1 = require("../exception/errorHandler");
const authentication_router_1 = __importDefault(require("./authentication.router"));
const registration_rotuer_1 = __importDefault(require("./registration.rotuer"));
const organization_router_1 = __importDefault(require("./organization.router"));
const mainRouter = (0, express_1.Router)();
mainRouter.use("/Organization", organization_router_1.default);
mainRouter.use("/Complainant", registration_rotuer_1.default);
mainRouter.use(authentication_router_1.default);
mainRouter.use(errorHandler_1.errorHandler);
mainRouter.use(errorHandler_1.clientErrorHandler);
exports.default = mainRouter;
//# sourceMappingURL=main.router.js.map