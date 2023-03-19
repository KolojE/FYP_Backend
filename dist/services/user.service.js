"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const user_1 = require("../models/user");
const administrator_1 = __importDefault(require("../models/administrator"));
const complainant_1 = __importDefault(require("../models/complainant"));
var userService;
(function (userService) {
    async function create_role(doc, next) {
        if (doc.role === user_1.role.admin) {
            const newAdmin = new administrator_1.default({
                User: {
                    _id: doc._id,
                    ID: doc.ID
                }
            });
            await newAdmin.save();
            next();
        }
        if (doc.role === user_1.role.complainant) {
            const newComplainant = new complainant_1.default({
                User: {
                    _id: doc._id,
                    ID: doc.ID
                }
            });
            await newComplainant.save();
            next();
        }
    }
    userService.create_role = create_role;
})(userService = exports.userService || (exports.userService = {}));
//# sourceMappingURL=user.service.js.map