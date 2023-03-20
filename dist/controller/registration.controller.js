"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register_Complainant = void 0;
const registration_service_1 = require("../services/registration.service");
async function register_Complainant(req, res, next) {
    try {
        const result = await registration_service_1.registrationService.register_Complainant(req.body);
        res.status(200).json({
            message: "Registration Successful !",
            resolved: result,
        }).send();
    }
    catch (err) {
        next(err);
    }
}
exports.register_Complainant = register_Complainant;
//# sourceMappingURL=registration.controller.js.map