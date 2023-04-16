import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import userModel from "../models/user";
import { clientError, statusCode } from "../exception/errorHandler";
import { isObjectIdOrHexString } from "mongoose";


export function getUserInfoController(req: Request, res: Response, next: Function) {

    try {

        const _id: ObjectId = new ObjectId(req.user._id);
        const user = userModel.findById(_id);

        if (!user) {
            throw new clientError(
                {
                    message: `No User Found with _id ${_id}`,
                    status:statusCode.notfound,
                })
        }

        res.json({
            message: "User",
            data: user,
        })
    }
    catch (err) {
        next(err);
    }


}
