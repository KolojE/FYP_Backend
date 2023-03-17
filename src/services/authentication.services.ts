import { validationService } from "./validation.service";
import { verify } from "../utils/hash";
import { clientError } from "../exception/errorHandler";
import jwt from "jsonwebtoken";
import { Document, Schema } from "mongoose";
import userModel, { User } from "../models/user";

type login = {
    identifier: string,
    password: string,
}

export namespace authenticationService {

    export async function authenticateUser(login: login): Promise<User | null> {
        if (!validationService.is_Email(login.identifier)) {
            throw {
                message: "Identifier is not an email!",
                status: 401
            } as clientError
        }

        //find the identifier owner and verify password
        const user = await userModel.findOne({ email: login.identifier }).exec()
        if (user) {
            if (await verify(login.password, user.password.salt, user.password.hashed))
                return user;
        }

        return null

    }

    export async function generateJWT(user: User) {

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT is not set !")
        }

        jwt.sign({
            _id: user._id,
            ID: user.ID,
        }, process.env.JWT_SECRET)
    }

}