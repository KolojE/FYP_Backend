import { role, IUser } from "../models/user";
import AdminModel from "../models/administrator";
import complaiantModel from "../models/complainant";
import { ObjectId } from "mongodb";

export namespace userService {

    export async function create_role(doc: IUser, next: Function) {
        if (doc.role === role.admin) {
            const newAdmin = new AdminModel({
                User: {
                    _id: new ObjectId(doc._id),
                    ID: doc.ID
                }
            });
            await newAdmin.save();
            next();
        }

        if (doc.role === role.complainant) {
            const newComplainant = new complaiantModel({
                User: {
                    _id: new ObjectId(doc._id),
                    ID: doc.ID
                }
            });
            await newComplainant.save();
            next();
        }
    }
}


