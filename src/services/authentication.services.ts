import { validationService } from "./validation.service";
import { verify } from "../utils/hash";
import { clientError, statusCode } from "../exception/errorHandler";
import jwt from "jsonwebtoken";
import { Schema } from "mongoose";
import userModel, { IUser } from "../models/user";

type login = {
    identifier: string,
    password: string,
}

type token = {
    _id: Schema.Types.ObjectId,
    ID: String,
}

export namespace authenticationService {

    /**
    Authenticating User Base On Identifier and Password Provided
    @authenticateUser
    @param {login} login - login contain identifier(email) and password  
    **/
    export async function authenticateUser(login: login): Promise<IUser | null > {

        login.identifier = login.identifier.toLowerCase()
        
        if (!validationService.is_Email(login.identifier)) {
            throw new clientError({
                message: "Identifier is not an email!",
                status: statusCode.unauthorized
            }) 
        }

        console.log(login.identifier)
        //find the identifier owner and verify password
        const loginUser = await userModel.findOne({ email: { $regex: new RegExp(login.identifier, 'i') } }).lean();
        console.log(loginUser)
        if (loginUser) {
            console.log(login.password)
            if (await verify(login.password, loginUser.password.hashed))
                return loginUser;
            else {
                throw new clientError( {
                    message: "password incorrect !",
                    status: statusCode.unauthorized
                })
            }
        }

        return null;

    }



    //Generate Jason Web Token
    export function generateJWT(user: IUser): String {

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT secret key is not set !")
        }

        const token = jwt.sign({
            _id: user._id,
            ID: user.ID,
        }, process.env.JWT_SECRET,{algorithm:"HS256"});

        return token
    }



    export async function verifyToken(token: string): Promise<IUser> {

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT secret key is not set !")
        }
        try {
            const data = await jwt.verify(token, process.env.JWT_SECRET) as token;
            const User = await userModel.findById(data._id).exec();
            if (!User)
                throw new clientError ({
                    message: "Token invalid!",
                    status: statusCode.unauthorized
                }) 

            return User;

        } catch (err) {
            throw new clientError ({
                data:err,
                message: "token veification error",
                status: statusCode.unauthorized
            } )
        }



    }

}