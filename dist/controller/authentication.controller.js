"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const errorHandler_1 = require("../exception/errorHandler");
const authentication_services_1 = require("../services/authentication.services");
async function authentication(req, res, next) {
    try {
        const user = await authentication_services_1.authenticationService.authenticateUser(req.body);
        console.log(user);
        if (user === null)
            throw {
                message: "Failed to authenticate user, no user found",
                status: errorHandler_1.statusCode.notfound,
            };
        const token = await authentication_services_1.authenticationService.generateJWT(user);
        res.set({
            "Authorization": `Baerer ${token}`
        });
        res.status(200).json({
            message: "Sucessfully authenticatd token returned in the header",
        });
    }
    catch (err) {
        next(err);
    }
}
exports.authentication = authentication;
//# sourceMappingURL=authentication.controller.js.map