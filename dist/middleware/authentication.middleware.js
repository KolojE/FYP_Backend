"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.complainantVerificationMiddleware = exports.adminVerificationMiddleware = exports.authenticationMiddleware = void 0;
const errorHandler_1 = require("../exception/errorHandler");
const user_1 = require("../models/user");
const authentication_services_1 = require("../services/authentication.services");
async function authenticationMiddleware(req, res, next) {
    var _a;
    try {
        const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (!token) {
            throw {
                message: "Token is not provided !",
                status: errorHandler_1.statusCode.unauthorize,
            };
        }
        const user = await authentication_services_1.authenticationService.verifyToken(token);
        if (!user) {
            throw {
                message: "The token is not belong to any user!",
                status: errorHandler_1.statusCode.unauthorize,
            };
        }
        req.user = user;
        next();
    }
    catch (err) {
        next(err);
    }
}
exports.authenticationMiddleware = authenticationMiddleware;
async function adminVerificationMiddleware(req, res, next) {
    try {
        if (req.user.role === user_1.role.admin) {
            next();
            return;
        }
        console.log("authenticating admin");
        throw {
            message: "You do not have sufficient permission to make the request",
            status: errorHandler_1.statusCode.unauthorize,
        };
    }
    catch (err) {
        next(err);
    }
}
exports.adminVerificationMiddleware = adminVerificationMiddleware;
async function complainantVerificationMiddleware(req, res, next) {
    try {
        if (req.user.role === user_1.role.complainant) {
            next();
            return;
        }
        throw {
            message: "You do not have sufficient permission to make the request",
            status: errorHandler_1.statusCode.unauthorize,
        };
    }
    catch (err) {
        next(err);
    }
}
exports.complainantVerificationMiddleware = complainantVerificationMiddleware;
//# sourceMappingURL=authentication.middleware.js.map