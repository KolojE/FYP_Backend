import { role, IUser } from "../models/user";
import AdminModel from "../models/administrator";
import complaiantModel, { IComplainant } from "../models/complainant";
import { ObjectId } from "mongodb";
import { clientError, statusCode } from "../exception/errorHandler";
import { readFile} from "fs/promises";
import OrganizationModel from "../models/organization";
import { Request } from "express";

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
            const organization = await OrganizationModel.findById(doc.organization._id)
            if (!organization) {
                throw new clientError({
                    message: "organization not found",
                    status: statusCode.notfound,
                })
            }
            const defaultActivation = organization?.system.autoActiveNewUser
            const newComplainant = new complaiantModel({
                user: {
                    _id: doc._id,
                    ID: doc.ID
                },
                activation: defaultActivation,
            });
            await newComplainant.save();
            next();
        }
    }


    export async function delete_role(doc: IUser, next: Function) {
        console.log(doc)
        if (doc.role === role.admin) {
            throw new clientError({
                message: "delete admin role is currently not allowed !",
                status: statusCode.badRequest,
            })
        }


        const deletedRole = await complaiantModel.findOneAndDelete({
            "user._id": doc._id
        })
    }

    export async function getBased64profilePicture(user: IUser) {

        const profilePicturePath = user.profilePicture;
        if (!profilePicturePath) {
            return null
        }

            const data =await readFile(profilePicturePath).catch(err => {
                throw new clientError({
                    message: "Error while reading profile picture",
                    status: statusCode.badRequest,
                })
            }
            )
            if (!data) { throw new Error("while reading profile picture" +data) }

            const profilePictureFileID = profilePicturePath.substring(profilePicturePath.lastIndexOf('/') + 1,profilePicturePath.lastIndexOf("."));
            const base64Data = Buffer.from(data).toString('base64');
            return base64Data;

    }

    export async function updatedBase64ProfilePicture(user:IUser,profilePictureFileNameID:string) {
        if (!user) {
            throw new clientError({
                message: "user not found",
                status: statusCode.notfound,
            })
        }
        if (user.profilePicture === profilePictureFileNameID) {
            return null;
        }

        return getBased64profilePicture(user);
    }

}



