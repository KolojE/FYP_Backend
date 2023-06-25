"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const user_1 = require("../models/user");
const administrator_1 = __importDefault(require("../models/administrator"));
const complainant_1 = __importDefault(require("../models/complainant"));
const mongodb_1 = require("mongodb");
const errorHandler_1 = require("../exception/errorHandler");
const promises_1 = require("fs/promises");
const organization_1 = __importDefault(require("../models/organization"));
var userService;
(function (userService) {
    async function create_role(doc, next) {
        if (doc.role === user_1.role.admin) {
            const newAdmin = new administrator_1.default({
                user: {
                    _id: new mongodb_1.ObjectId(doc._id),
                    ID: doc.ID
                }
            });
            await newAdmin.save();
            next();
        }
        if (doc.role === user_1.role.complainant) {
            const organization = await organization_1.default.findById(doc.organization._id);
            if (!organization) {
                throw new errorHandler_1.clientError({
                    message: "organization not found",
                    status: errorHandler_1.statusCode.notfound,
                });
            }
            const defaultActivation = organization === null || organization === void 0 ? void 0 : organization.system.autoActiveNewUser;
            const newComplainant = new complainant_1.default({
                user: {
                    _id: doc._id,
                    ID: doc.ID
                },
                activation: defaultActivation,
            });
            await newComplainant.save();
            next();
        }
    }
    userService.create_role = create_role;
    async function delete_role(doc, next) {
        console.log(doc);
        if (doc.role === user_1.role.admin) {
            throw new errorHandler_1.clientError({
                message: "delete admin role is currently not allowed !",
                status: errorHandler_1.statusCode.badRequest,
            });
        }
        const deletedRole = await complainant_1.default.findOneAndDelete({
            "user._id": doc._id
        });
    }
    userService.delete_role = delete_role;
    async function getBased64profilePicture(user) {
        const profilePicturePath = user.profilePicture;
        if (!profilePicturePath) {
            return null;
        }
        const data = await (0, promises_1.readFile)(profilePicturePath).catch(err => {
            throw new errorHandler_1.clientError({
                message: "Error while reading profile picture",
                status: errorHandler_1.statusCode.badRequest,
            });
        });
        if (!data) {
            throw new Error("while reading profile picture" + data);
        }
        const profilePictureFileID = profilePicturePath.substring(profilePicturePath.lastIndexOf('/') + 1, profilePicturePath.lastIndexOf("."));
        const base64Data = Buffer.from(data).toString('base64');
        return base64Data;
    }
    userService.getBased64profilePicture = getBased64profilePicture;
    async function updatedBase64ProfilePicture(user, profilePictureFileNameID) {
        if (!user) {
            throw new errorHandler_1.clientError({
                message: "user not found",
                status: errorHandler_1.statusCode.notfound,
            });
        }
        if (user.profilePicture === profilePictureFileNameID) {
            return null;
        }
        return getBased64profilePicture(user);
    }
    userService.updatedBase64ProfilePicture = updatedBase64ProfilePicture;
})(userService = exports.userService || (exports.userService = {}));
//# sourceMappingURL=user.service.js.map