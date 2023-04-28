import { role, IUser } from "../models/user";
import AdminModel from "../models/administrator";
import complaiantModel, { IComplainant } from "../models/complainant";
import { ObjectId } from "mongodb";
import { clientError, statusCode } from "../exception/errorHandler";

export namespace userService {

    export async function create_role(doc: IUser, next: Function) {
        if (doc.role === role.admin) {
            const newAdmin = new AdminModel({
                user: {
                    _id: new ObjectId(doc._id),
                    ID: doc.ID
                }
            });
            await newAdmin.save();
            next();
        }

        if (doc.role === role.complainant) {
            const newComplainant = new complaiantModel({
                user: {
                    _id:doc._id,
                    ID: doc.ID
                },
                activation:false,
            });
            await newComplainant.save();
            next();
        }
    }

    export async function delete_role(doc:IUser,next:Function)
    {
        console.log(doc)
        if(doc.role === role.admin)
        {
            throw new clientError({
                message:"delete admin role is currently not allowed !",
                status:statusCode.badRequest,
            }) 
        }


        const deletedRole = await complaiantModel.findOneAndDelete({
            "user._id":doc._id
        })
    }       
    }


