"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerComplainantController = void 0;
const registration_service_1 = require("../services/registration.service");
const authentication_services_1 = require("../services/authentication.services");
async function registerComplainantController(req, res, next) {
    try {
        const result = await registration_service_1.registrationService.register_Complainant(req.body);
        const token = await authentication_services_1.authenticationService.generateJWT(result);
        res.set({
            "Authorization": `Baerer ${token}`
        });
        res.status(200).json({
            message: "Registration Successful !",
            user: result,
        }).send();
    }
    catch (err) {
        next(err);
    }
}
exports.registerComplainantController = registerComplainantController;
//# sourceMappingURL=registration.controller.js.map