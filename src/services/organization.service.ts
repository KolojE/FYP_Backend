import OrganizationModel, { IOrganization } from "../models/organization";
import { hashPassword } from "../utils/hash";
import { validationService } from "./validation.service";
import userModel, { role, IUser } from "../models/user";
import statusModel, { Status } from "../models/status";
type newOrganization = {
    name: string,
    address: string,
    contactNo: string,
    passcode: string,
    rootAdmin: {
        email: string,
        password: string,
    }

}
export namespace OrganizationService {
    export async function create_New_Organization(data: newOrganization): Promise<IOrganization> {

        const newOrganization = data;

        await validationService.check_Email_Availability(newOrganization.rootAdmin.email);

        const newOrganization_ = new OrganizationModel({
            name: newOrganization.name,
            address: newOrganization.address,
            contactNo: newOrganization.contactNo,
            passcode: newOrganization.passcode,
        });


        const result = newOrganization_.save();



        return result;

    }

    export async function create_Root_Admin(newOrganization: IOrganization, data: newOrganization): Promise<IUser> {
        const newRootAdmin = data.rootAdmin;
        const hashedPassword = await hashPassword(newRootAdmin.password);
        validationService.is_Email(newRootAdmin.email);
        //create a default administrator
        const newAdminUser = new userModel({
            email: newRootAdmin.email,
            organization: {
                _id: newOrganization._id,
                ID: newOrganization.ID
            },
            password: {
                hashed: hashedPassword.hashValue,
                salt: hashedPassword.salt,
            },
            role: role.admin,
        });
        return await newAdminUser.save();
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


