"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const organization_controller_1 = require("../controller/organization.controller");
const organizationRouter = express_1.default.Router();
organizationRouter.use(express_1.default.json());
organizationRouter.get('/getAllOrganization', organization_controller_1.get_All_Organization);
organizationRouter.post('/addOrganization', organization_controller_1.insert_Organization);
organizationRouter.post('/createCollection', organization_controller_1.create_Collection);
exports.default = organizationRouter;
//# sourceMappingURL=organization.router.js.map