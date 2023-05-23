"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.clientErrorHandler = exports.clientError = exports.statusCode = void 0;
var statusCode;
(function (statusCode) {
    statusCode[statusCode["badRequest"] = 400] = "badRequest";
    statusCode[statusCode["notfound"] = 404] = "notfound";
    statusCode[statusCode["conflict"] = 409] = "conflict";
    statusCode[statusCode["unauthorized"] = 401] = "unauthorized";
})(statusCode = exports.statusCode || (exports.statusCode = {}));
class clientError extends Error {
    constructor({ message, status, data }) {
        super(message);
        this.data = data;
        this.status = status;
    }
}
exports.clientError = clientError;
function clientErrorHandler(err, req, res, next) {
    if (!(err instanceof clientError)) {
        next(err);
        return;
    }
    res.status(err.status ? err.status : 500).json({
        data: err.data,
        message: err.message
    }).send();
}
exports.clientErrorHandler = clientErrorHandler;
function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(500).json({
        message: "Server error!",
        err: err
    }).send();
}
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map