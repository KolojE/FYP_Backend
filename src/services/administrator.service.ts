import { clientError, statusCode } from "../exception/errorHandler";
import complaiantModel from "../models/complainant";
import { IField, IForm, FormModel, inputType } from "../models/form"
import  { IUser } from "../models/user";
import { isObjectIdOrHexString } from "mongoose";


export type newForm = {
    name: String,
    fields: Array<IField>,
    activation: boolean,
}

export namespace administratorService {


    export async function addNewForm(form: newForm, user: IUser): Promise<IForm> {

        const defaultFields = [{
            label:"Date Of Occurence",
            inputType:inputType.Date,
            required:true,
        },{
            label:"Time of Occurence",
            inputType:inputType.Time,
            required:true,
        },{
            label:"Location",
            inputType:inputType.Map,
            required:true,
        }]

        const newForm = new FormModel({
            name: form.name,
            defaultFields:defaultFields,
            fields: form.fields,
            activation_Status: form.activation,
            organization: {
                _id: user.organization._id,
                ID: user.organization.ID,
            },
            creationDate: new Date()
        });

        return await newForm.save();
    }

    export async function updateForm(formToUpdate: IForm, user: IUser): Promise<IForm> {


        if (!formToUpdate._id) {
            throw new clientError({
                message: "ID is not provided !",
                status: statusCode.badRequest,
            })

        }

        const updatedForm = await FormModel.findByIdAndUpdate(
            formToUpdate._id, {
            $set: {
                name: formToUpdate.name,
                fields: formToUpdate.fields,
                activation_Status: formToUpdate.activation_Status,
            }
        }, { returnDocument: "after", runValidators: true }
        ).where({ organization: user.organization })



        if (!updatedForm) {
            throw new clientError({ message: "Form not found !", status: statusCode.notfound })
        }

        return updatedForm
    }

    export async function updateMemberActivationStatus(id: string, activation: boolean, requester: IUser) {

        
        if (!isObjectIdOrHexString(id)) {
            throw new clientError({
                status: statusCode.badRequest,
                message: "ID invalid!"
            })
        }
     const complainant = await complaiantModel.findOne({
        'user._id':id
     }).populate({
        path:"user._id",
        match:{
            'organization._id':requester.organization._id
        }
        
     }).updateOne({$set:{
        activation:activation
     }})  
     console.log(complainant)
    }

}



