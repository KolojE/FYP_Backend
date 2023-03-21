"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addFormController = void 0;
const administrator_service_1 = require("../services/administrator.service");
async function addFormController(req, res, next) {
    try {
        const newForm = req.body;
        const user = req.user;
        const form = await administrator_service_1.administratorService.addNewForm(newForm, user);
        res.status(200).json({
            message: "successfully added new form",
            data: form,
        });
    }
    catch (err) {
        next(err);
    }
}
exports.addFormController = addFormController;
//# sourceMappingURL=administrator.controller.js.map