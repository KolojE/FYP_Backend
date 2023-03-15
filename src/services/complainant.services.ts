import { clientError, statusCode } from "../exception/errorHandler";
import complainantModel, { Complainant } from "../models/complainant";
import OrganizationModel, { Organization } from "../models/organization";
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

export namespace complainantService {
    export async function register_Complainant(complainantData: newComplainant): Promise<Complainant> {

        const newComplainant: newComplainant = complainantData;

        //Get organization from submitted ID
        const Organization = await OrganizationModel.findOne({ ID: newComplainant.organization.ID })

        await validationService.check_Email_Availability(newComplainant.email);


        //if Organization is null throw error
        if (!Organization) {
            throw {
                message: "ID " + newComplainant.organization.ID + " Organization Not Found! ",
                status: statusCode.conflict
            } as clientError
        }
        //TODO - validate passcode

        if (!validationService.is_Email(newComplainant.email)) {
            throw {
                message: "Identifier is not an email !",
                status: statusCode.badRequest
            } as clientError
        }

        //hash password and store salt and hashed password
        const hashedPassword = await hashPassword(newComplainant.password);

        const newComplainant_ = new complainantModel({
            email: newComplainant.email,
            password: {
                hashed: hashedPassword.hashValue,
                salt: hashedPassword.salt
            },
            organization: { _id: Organization._id, ID: Organization.ID },
            profile: {
                username: newComplainant.profile.username,
                contact: newComplainant.profile.contactNo,
            }
        })

        return newComplainant_.save();

    }
}