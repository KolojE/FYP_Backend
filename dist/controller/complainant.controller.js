"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register_Complainant = void 0;
const complainant_services_1 = require("../services/complainant.services");
async function register_Complainant(req, res, next) {
    try {
        const result = await complainant_services_1.complainantService.register_Complainant(req.body);
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
//# sourceMappingURL=complainant.controller.js.map