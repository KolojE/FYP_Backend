import { clientError, statusCode } from "../exception/errorHandler";
import OrganizationModel, { IOrganization } from "../models/organization";
import userModel, { role, IUser } from "../models/user";
import { hashPassword } from "../utils/hash";
import { validationService } from "./validation.service";

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

export namespace registrationService {
    export async function register_Complainant(complainantData: newComplainant): Promise<IUser> {

        const newComplainant: newComplainant = complainantData;
        console.log(newComplainant)

        //Get organization from submitted ID
        const Organization = await OrganizationModel.findOne({ ID: newComplainant.organization.ID })

        await validationService.check_Email_Availability(newComplainant.email);


        //if Organization is null throw error
        if (!Organization) {
            throw new clientError ({
                message: "ID " + newComplainant.organization.ID + " Organization Not Found! ",
                status: statusCode.notfound
            }) 
        }

        //TODO - validate passcode

        if (!validationService.is_Email(newComplainant.email)) {
            throw new clientError({
                message: "Identifier is not an email !",
                status: statusCode.badRequest
            }) 
        }

        //hash password and store salt and hashed password
        const hashedPassword = await hashPassword(newComplainant.password);

        const newComplainant_ = new userModel({
            email: newComplainant.email,
            password: {
                hashed: hashedPassword.hashValue,
                salt: hashedPassword.salt
            },
            organization: { _id: Organization._id, ID: Organization.ID },
            profile: {
                username: newComplainant.profile.username,
                contact: newComplainant.profile.contactNo,
            },
            role: role.complainant,
        })



        return newComplainant_.save();

    }
}