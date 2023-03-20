"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationService = void 0;
const validation_service_1 = require("./validation.service");
const hash_1 = require("../utils/hash");
const errorHandler_1 = require("../exception/errorHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
var authenticationService;
(function (authenticationService) {
    async function authenticateUser(login) {
        if (!validation_service_1.validationService.is_Email(login.identifier)) {
            throw {
                message: "Identifier is not an email!",
                status: errorHandler_1.statusCode.unauthorize
            };
        }
        const user = await user_1.default.findOne({ email: login.identifier }).exec();
        if (user) {
            console.log(login.password);
            if (await (0, hash_1.verify)(login.password, user.password.hashed))
                return user;
            else {
                throw {
                    message: "password incorrect !",
                    status: errorHandler_1.statusCode.unauthorize
                };
            }
        }
        return null;
    }
    authenticationService.authenticateUser = authenticateUser;
    function generateJWT(user) {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT secret key is not set !");
        }
        const token = jsonwebtoken_1.default.sign({
            _id: user._id,
            ID: user.ID,
        }, process.env.JWT_SECRET);
        return token;
    }
    authenticationService.generateJWT = generateJWT;
    async function verifyToken(token) {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT secret key is not set !");
        }
        try {
            const data = await jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const User = await user_1.default.findById(data._id).exec();
            if (!User)
                throw {
                    message: "Token invalid!",
                    status: errorHandler_1.statusCode.unauthorize
                };
            return User;
        }
        catch (err) {
            throw {
                message: err,
                status: errorHandler_1.statusCode.unauthorize
            };
        }
    }
    authenticationService.verifyToken = verifyToken;
})(authenticationService = exports.authenticationService || (exports.authenticationService = {}));
//# sourceMappingURL=authentication.services.js.map