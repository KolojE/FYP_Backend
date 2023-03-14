import OrganizationModel, { Organization } from "../models/organization";

type newOrganization = {
    name: String,
    address: String,
    contactNo: String,
    passcode: String,
}
export namespace OrganizationService {
    export async function create_New_Organization(data: newOrganization): Promise<Organization> {

        const newOrganization = data;
        console.log(newOrganization)

        try {
            const newOrganization_ = new OrganizationModel({
                name: newOrganization.name,
                address: newOrganization.address,
                contactNo: newOrganization.contactNo,
                passcode: newOrganization.passcode,
            });

            return await newOrganization_.save();
        } catch (err) {
            throw err;
        }

    }

    export async function get_All_Organizations(): Promise<Organization[]> {
        const organizations = await OrganizationModel.find().exec();
        return organizations;
    }
}