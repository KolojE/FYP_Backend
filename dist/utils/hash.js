"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.hashPassword = void 0;
const bcrypt_1 = require("bcrypt");
async function hashPassword(password) {
    const saltValue = await (0, bcrypt_1.genSalt)();
    const hashValue = await (0, bcrypt_1.hash)(password, saltValue);
    const result = {
        salt: saltValue,
        hashValue: hashValue,
    };
    return result;
}
exports.hashPassword = hashPassword;
async function verify(password, salt, hashedPassword) {
    const hashValue = await (0, bcrypt_1.hash)(password, salt);
    const result = (0, bcrypt_1.compare)(hashValue, hashedPassword);
    return result;
}
exports.verify = verify;
//# sourceMappingURL=hash.js.map