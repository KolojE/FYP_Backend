import complainantModel, { Complainant } from "../models/complainant";
import OrganizationModel, { Organization } from "../models/organization";
import { hashPassword } from "../utils/hash";

interface newComplainant {
    email: string,
    password: string,
    organization: {
        ID: string,
        passCode: string,
    },
    profile:
    {
        username: string,
        contactNo?: string,
    }

}

export namespace complainantService {
    export async function register_Complainant(complainantData: newComplainant): Promise<Complainant> {

        const newComplainant: newComplainant = complainantData;
        console.log(newComplainant.profile)
        //Get organization from submitted ID

        const Organization: Organization | null = await OrganizationModel.findOne({ ID: newComplainant.organization.ID })


        //TODO - validate passcode

        //if Organization is null throw error
        if (!Organization) {
            throw {
                message: "ID " + newComplainant.organization.ID + " Organization Not Found! ",
                status: 500
            }
        }


        //hash password and store salt and hashed password
        const hashedPassword = await hashPassword(newComplainant.password);
        const newComplainant_ = new complainantModel<Complainant>({
            email: newComplainant.email,
            password: hashedPassword.hashValue,
            organization: { _id: Organization._id, ID: Organization.ID },
            passwordSalt: hashedPassword.salt,
            profile: {
                username: newComplainant.profile.username,
                contact: newComplainant.profile.contactNo,
            }
        })

        return newComplainant_.save();

    }
}