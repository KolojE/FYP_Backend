"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportIncidentController = void 0;
const reportIncident_service_1 = require("../services/reportIncident.service");
async function reportIncidentController(req, res, next) {
    try {
        await reportIncident_service_1.reportIncidentService.reportIncident(req.body, req.user);
        res.status(200).json({
            message: "Vlidate sucess, report being saved"
        }).send();
    }
    catch (err) {
        next(err);
    }
}
exports.reportIncidentController = reportIncidentController;
//# sourceMappingURL=complainant.controller.js.map