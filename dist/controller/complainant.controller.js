"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register_Complainant = void 0;
const complainant_services_1 = require("../services/complainant.services");
async function register_Complainant(req, res) {
    try {
        const result = await complainant_services_1.complainantService.register_Complainant(req.body);
        res.status(200).json({
            message: "Registration Successful !",
            resolved: result,
        }).send();
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Registration failed ! Please make sure the json is matched",
            err: err,
        }).send();
    }
}
exports.register_Complainant = register_Complainant;
//# sourceMappingURL=complainant.controller.js.map