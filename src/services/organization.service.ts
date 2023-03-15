import { Administrator, administratorModel } from "../models/administrator";
import OrganizationModel, { Organization } from "../models/organization";
import { hashPassword } from "../utils/hash";
import { validationService } from "./validation.service";

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
    export async function create_New_Organization(data: newOrganization): Promise<Organization> {

        const newOrganization = data;


        const newOrganization_ = new OrganizationModel({
            name: newOrganization.name,
            address: newOrganization.address,
            contactNo: newOrganization.contactNo,
            passcode: newOrganization.passcode,
        });


        const result = newOrganization_.save();



        return result;

    }

    export async function create_Root_Admin(newOrganization: Organization, data: newOrganization): Promise<Administrator> {
        const newRootAdmin = data.rootAdmin;
        const hashedPassword = await hashPassword(newRootAdmin.password);
        validationService.is_Email(newRootAdmin.email);
        //create a default administrator
        const newRootAdmin_ = new administratorModel({
            email: newRootAdmin.email,
            organization: {
                _id: newOrganization._id,
                ID: newOrganization.ID
            },
            password: {
                hashed: hashedPassword.hashValue,
                salt: hashedPassword.salt,
            }
        });
        return await newRootAdmin_.save();
    }


}