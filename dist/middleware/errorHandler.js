"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientErrorHandler = void 0;
function clientErrorHandler(err, req, res, next) {
    console.log(err.message);
    if (err.status)
        res.send();
}
exports.clientErrorHandler = clientErrorHandler;
//# sourceMappingURL=errorHandler.js.map