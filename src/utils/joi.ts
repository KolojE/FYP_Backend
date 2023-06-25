import { IField, IForm, inputType } from "../models/form";
import Joi, { string } from "joi";
type schema = {
    [key: string]: Joi.Schema
}
//TODO - Validate the submitted form schema

export function generateSchema(form: IForm) {
    const formSchema: schema = {}

    const fields:Array<IField> = form.fields;
    fields.unshift(...form.defaultFields);

    fields.forEach(field => {
        const fieldID = field._id.toString();
        switch (field.inputType) {
            case inputType.DropDown:
                if (!field.options) {
                    console.error("type dropdown shouldnt have empty options array ")
        console.log(field._id+" "+field.label+" "+field.inputType)
                    break;
                }
                formSchema[fieldID] = Joi.string().valid(...field.options);
                break;
            case inputType.Map:
        console.log(field._id+" "+field.label+" "+field.inputType)
                formSchema[fieldID] = Joi.object().keys({
                    La: Joi.number(),
                    Lo: Joi.number(),
                })
                break;
            case inputType.Date:
                formSchema[fieldID] = Joi.date().iso();
        console.log(field._id+" "+field.label+" "+field.inputType)
                break;
            case inputType.Text:
                formSchema[fieldID] = Joi.string();
        console.log(field._id+" "+field.label+" "+field.inputType)
                break;
            case inputType.Time:
                formSchema[fieldID] = Joi.date().iso();
        console.log(field._id+" "+field.label+" "+field.inputType)
                break;
            case inputType.Photo:
                formSchema[fieldID] = Joi.array().items(Joi.string());
        console.log(field._id+" "+field.label+" "+field.inputType)
        break;
        }


        if (field.required) {
            formSchema[fieldID].required();
        }

    })


    return Joi.object(formSchema);

}