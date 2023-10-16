"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = exports.hashPassword = void 0;
const bcrypt_1 = require("bcrypt");
async function hashPassword(password) {
    const saltValue = await (0, bcrypt_1.genSalt)();
    const hashValue = await (0, bcrypt_1.hash)(password, saltValue);
    const result = {
        salt: saltValue,
        hashed: hashValue,
    };
    return result;
}
exports.hashPassword = hashPassword;
async function verify(password, hashedPassword) {
    const result = await (0, bcrypt_1.compare)(password, hashedPassword);
    console.log(result);
    return result;
}
exports.verify = verify;
//# sourceMappingURL=hash.js.map