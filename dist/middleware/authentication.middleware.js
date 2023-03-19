"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationMiddleware = void 0;
function authenticationMiddleware(req, res, next) {
    const token = req.headers["authorization"];
}
exports.authenticationMiddleware = authenticationMiddleware;
//# sourceMappingURL=authentication.middleware.js.map