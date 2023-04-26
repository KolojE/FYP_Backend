"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationController = void 0;
const errorHandler_1 = require("../exception/errorHandler");
const authentication_services_1 = require("../services/authentication.services");
async function authenticationController(req, res, next) {
    try {
        const user = await authentication_services_1.authenticationService.authenticateUser(req.body);
        console.log(user);
        if (user === null)
            throw new errorHandler_1.clientError({
                message: "Failed to authenticate user, no user found.",
                status: errorHandler_1.statusCode.notfound,
            });
        const token = await authentication_services_1.authenticationService.generateJWT(user);
        res.set({
            "Authorization": `Baerer ${token}`
        });
        const userOmitPassword = Object.assign(Object.assign({}, user.toObject()), { password: undefined });
        console.log("user ommited password" + userOmitPassword);
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
//# sourceMappingURL=authentication.controller.js.map