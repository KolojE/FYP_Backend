import { Document } from "mongoose";
import { clientError, statusCode } from "../exception/errorHandler";
import OrganizationModel, { IOrganization } from "../models/organization";
import userModel, { role, IUser } from "../models/user";
import { hashPassword } from "../utils/hash";
import { validationService } from "./validation.service";

type newComplainant  = Omit<IUser,keyof Document|"ID"> & {
    organization:IOrganization & {
        ID?:string
    },
    password:string|Object
}




export namespace registrationService {
    export async function register_Complainant(complainantData: newComplainant): Promise<IUser> {

        const newComplainant: newComplainant = complainantData;
        console.log(newComplainant)
        newComplainant.email = newComplainant.email.toLowerCase()
        //Get organization from submitted ID
        const ID = newComplainant.organization.ID;
        const Organization = await OrganizationModel.findOne({ ID:RegExp(ID,"i") })

        await validationService.check_Email_Availability(newComplainant.email);


        //if Organization is null throw error
        if (!Organization) {
            throw new clientError ({
                message: "ID " + newComplainant.organization.ID + " Organization Not Found! ",
                status: statusCode.notfound
            }) 
        }


        if (!validationService.is_Email(newComplainant.email)) {
            throw new clientError({
                message: "Identifier is not an email !",
                status: statusCode.badRequest
            }) 
        }

        //hash password and store salt and hashed password
        const hashedPassword = await hashPassword(newComplainant.password.toString());

        const newComplainant_ = new userModel<Omit<IUser,keyof Document>>({
            email: newComplainant.email,
            name:newComplainant.name,
            password: {
                hashed: hashedPassword.hashed,
                salt: hashedPassword.salt,
            },
            organization: Organization._id,
            role: role.complainant,
        })



        return newComplainant_.save();

    }
}