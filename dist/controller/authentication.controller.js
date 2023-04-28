"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenAuthenticationController = exports.authenticationController = void 0;
const errorHandler_1 = require("../exception/errorHandler");
const authentication_services_1 = require("../services/authentication.services");
const user_1 = __importDefault(require("../models/user"));
async function authenticationController(req, res, next) {
    try {
        const user = await authentication_services_1.authenticationService.authenticateUser(req.body);
        if (user == null)
            throw new errorHandler_1.clientError({
                message: "Failed to authenticate user, no user found.",
                status: errorHandler_1.statusCode.notfound,
            });
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
                status: errorHandler_1.statusCode.unauthorize,
            });
        const type = authorization[0];
        console.log(type);
        if (type != "Baerer")
            throw new errorHandler_1.clientError({
                message: "authorization method should be Bearer",
                status: errorHandler_1.statusCode.badRequest,
            });
        const token = authorization[1];
        const decodedToken = await authentication_services_1.authenticationService.verifyToken(token);
        const loginUser = await user_1.default.findById(decodedToken._id).lean();
        const userOmitPassword = Object.assign(Object.assign({}, loginUser), { password: undefined });
        console.log(userOmitPassword);
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