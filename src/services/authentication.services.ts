import { validationService } from "./validation.service";
import { verify } from "../utils/hash";
import { clientError, statusCode } from "../exception/errorHandler";
import jwt from "jsonwebtoken";
import { Document, Schema } from "mongoose";
import userModel, { User } from "../models/user";

type login = {
    identifier: string,
    password: string,
}

type token = {
    _id: Schema.Types.ObjectId,
    ID: String,
}

export namespace authenticationService {

    export async function authenticateUser(login: login): Promise<User | null> {
        if (!validationService.is_Email(login.identifier)) {
            throw {
                message: "Identifier is not an email!",
                status: statusCode.unauthorize
            } as clientError
        }


        //find the identifier owner and verify password
        const user = await userModel.findOne({ email: login.identifier }).exec()
        if (user) {
            console.log(login.password)
            if (await verify(login.password, user.password.hashed))
                return user;
            else {
                throw {
                    message: "password incorrect !",
                    status: statusCode.unauthorize
                } as clientError
            }
        }

        return null;

    }

    export function generateJWT(user: User): String {

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT secret key is not set !")
        }

        const token = jwt.sign({
            _id: user._id,
            ID: user.ID,
        }, process.env.JWT_SECRET);

        return token
    }

    export async function verifyToken(token: string): Promise<User> {

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT secret key is not set !")
        }
        try {
            const data = await jwt.verify(token, process.env.JWT_SECRET) as token;
            const User = await userModel.findById(data._id).exec();
            if (!User)
                throw {
                    message: "Token invalid!",
                    status: statusCode.unauthorize
                } as clientError

            return User;

        } catch (err) {
            throw {
                message: err,
                status: statusCode.unauthorize
            } as clientError
        }



    }

}