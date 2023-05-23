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
        switch (field.inputType) {
            case inputType.DropDown:
                if (!field.options) {
                    console.error("type dropdown shouldnt have empty options array ")
                    break;
                }
                formSchema[field._id] = Joi.string().valid(...field.options);
                break;
            case inputType.Map:
                formSchema[field._id] = Joi.object().keys({
                    La: Joi.number(),
                    Lo: Joi.number(),
                })
                break;
            case inputType.Date:
                formSchema[field._id] = Joi.date().iso();
                break;
            case inputType.Text:
                formSchema[field._id] = Joi.string();
                break;
            case inputType.Time:
                formSchema[field._id] = Joi.date().iso();
                break;
            case inputType.Photo:
                formSchema[field._id] = Joi.array().items(Joi.string());
        }

        if (field.required) {
            formSchema[field._id].required();
        }

    })


    return Joi.object(formSchema);

}