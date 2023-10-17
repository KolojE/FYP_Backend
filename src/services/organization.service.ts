import OrganizationModel, { IOrganization } from "../models/organization";
import { hashPassword } from "../utils/hash";
import { validationService } from "./validation.service";
import userModel, { role, IUser } from "../models/user";
import statusModel, { Status } from "../models/status";
import { Document } from "mongoose";

type newOrganization = Omit<IOrganization,keyof Document|"ID"|"system"> 
type rootAdmin = Omit<IUser,keyof Document|"ID"> & {
    password:string|Object
}
type status = Omit<Status,keyof Document>
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
            organization: newOrganization._id,
            password: {
                hashed: hashedPassword.hashed,
                salt: hashedPassword.salt,
            },
            role: role.admin,
        });
        return newAdminUser;
    }

    export async function create_default_system_config(this: IOrganization, next: Function) {
        const doc = this;


        const pendingStatus = new statusModel<status>({
            desc: "Pending",
            organization:doc._id,

        })
        const resolvedStatus = new statusModel<status>({
            desc: "Resolved",
            organization:doc._id,
            

        })

        const systemDefaultStatus = await pendingStatus.save();
        await resolvedStatus.save();
        doc.system = {
            autoActiveNewUser: false,
            defaultStatus: systemDefaultStatus._id,
        }
        next();










    }
}


