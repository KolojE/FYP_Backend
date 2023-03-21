"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationMiddleware = void 0;
const errorHandler_1 = require("../exception/errorHandler");
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
        console.log(token);
        const user = await authentication_services_1.authenticationService.verifyToken(token);
        if (!user) {
            throw {
                message: "Token is not provided !",
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
//# sourceMappingURL=authentication.middleware.js.map