"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenAuthenticationController = exports.authenticationController = void 0;
const errorHandler_1 = require("../exception/errorHandler");
const authentication_services_1 = require("../services/authentication.services");
const user_1 = __importStar(require("../models/user"));
const validation_service_1 = require("../services/validation.service");
async function authenticationController(req, res, next) {
    try {
        const user = await authentication_services_1.authenticationService.authenticateUser(req.body);
        if (user == null)
            throw new errorHandler_1.clientError({
                message: "Failed to authenticate user, no user found.",
                status: errorHandler_1.statusCode.notfound,
            });
        if (user.role === user_1.role.complainant) {
            await validation_service_1.validationService.is_Complinant_Active(user);
        }
        const token = await authentication_services_1.authenticationService.generateJWT(user);
        res.set({
            "Authorization": `Baerer ${token}`
        });
        const userOmitPassword = Object.assign(Object.assign({}, user), { password: undefined });
        res.status(200).json({
            loginUser: userOmitPassword,
            message: "Sucessfully authenticatd token returned in the header",
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}
exports.authenticationController = authenticationController;
async function tokenAuthenticationController(req, res, next) {
    var _a;
    try {
        const authorization = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ');
        if (!authorization)
            throw new errorHandler_1.clientError({
                message: "Please Porvid token",
                status: errorHandler_1.statusCode.unauthorized,
            });
        const type = authorization[0];
        if (type != "Baerer")
            throw new errorHandler_1.clientError({
                message: "authorization method should be Bearer",
                status: errorHandler_1.statusCode.badRequest,
            });
        const token = authorization[1];
        const decodedToken = await authentication_services_1.authenticationService.verifyToken(token);
        const loginUser = await user_1.default.findById(decodedToken._id).lean();
        if (!loginUser) {
            throw new errorHandler_1.clientError({
                message: "User not found",
                status: errorHandler_1.statusCode.notfound,
            });
        }
        if (loginUser.role === user_1.role.complainant) {
            validation_service_1.validationService.is_Complinant_Active(loginUser);
        }
        const userOmitPassword = Object.assign(Object.assign({}, loginUser), { password: undefined });
        res.status(200).send({
            loginUser: userOmitPassword,
            message: "Login Sucessfully",
        });
    }
    catch (err) {
        next(err);
    }
}
exports.tokenAuthenticationController = tokenAuthenticationController;
//# sourceMappingURL=authentication.controller.js.map