import OrganizationModel, { IOrganization } from "../models/organization";
import { hashPassword } from "../utils/hash";
import { validationService } from "./validation.service";
import userModel, { role, IUser } from "../models/user";
import statusModel, { Status } from "../models/status";
import { Document } from "mongoose";

type newOrganization = Omit<IOrganization,keyof Document|"ID"|"defaultStatus"> 
type rootAdmin = Omit<IUser,keyof Document|"ID"> & {
    password:string|Object
}
export namespace OrganizationService {
    export async function create_New_Organization(data: newOrganization): Promise<IOrganization>{

        const newOrganization = data;

        const newOrganization_ = new OrganizationModel<newOrganization>({
            name: newOrganization.name,
            address: newOrganization.address,
            contactNo: newOrganization.contactNo,
            creationDate:new Date(),
        });
return newOrganization_;

    }

    export async function create_Root_Admin(newOrganization: IOrganization, data: rootAdmin): Promise<IUser> {
        const newRootAdmin = data;
        const hashedPassword = await hashPassword(newRootAdmin.password.toString());
        validationService.is_Email(newRootAdmin.email);
        //create a default administrator
        const newAdminUser = new userModel<rootAdmin>({
            email: newRootAdmin.email,
            name:newRootAdmin.name,
            organization: {
                _id: newOrganization._id,
                ID: newOrganization.ID
            },
            password: {
                hashed: hashedPassword.hashed,
                salt: hashedPassword.salt,
            },
            role: role.admin,
        });
        return newAdminUser;
    }

    export async function create_default_status(this: IOrganization, next: Function) {
        const doc = this;

        const pendingStatus = new statusModel({
            desc: "Pending",
            organization: {
                _id: doc._id,
                ID: doc.ID,
            },

        })
        const resolvedStatus = new statusModel({
            desc: "Resolved",
            organization: {
                _id: doc._id,
                ID: doc.ID,
            }

        })

        const systemDefaultStatus = await pendingStatus.save();
        await resolvedStatus.save();

        doc.defaultStatus = pendingStatus._id;
        next();










    }
}


