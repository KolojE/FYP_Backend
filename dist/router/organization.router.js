"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const organization_controller_1 = require("../controller/organization.controller");
const errorHandler_1 = require("../exception/errorHandler");
const organizationRouter = express_1.default.Router();
organizationRouter.use(express_1.default.json());
organizationRouter.post('/addOrganization', organization_controller_1.registerOrganizationController);
organizationRouter.post('/createCollection', organization_controller_1.createCollectionController);
organizationRouter.use(errorHandler_1.clientErrorHandler);
organizationRouter.use(errorHandler_1.errorHandler);
exports.default = organizationRouter;
//# sourceMappingURL=organization.router.js.map