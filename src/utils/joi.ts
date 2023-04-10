import { IField, Form, inputType } from "../models/form";
import Joi, { string } from "joi";
type schema = {
    [key: string]: Joi.Schema
}
//TODO - Validate the submitted form schema

export function generateSchema(form: Form) {
    const formSchema: schema = {}
    form.fields.forEach(field => {

        switch (field.inputType) {
            case inputType.DropDown:
                if (!field.options) {
                    console.error("type dropdown shouldnt have empty options array ")
                    break;
                }
                formSchema[field.label] = Joi.string().valid(...field.options);
                break;
            case inputType.Map:
                formSchema[field.label] = Joi.object().keys({
                    La: Joi.number(),
                    Lo: Joi.number(),
                })
                break;
            case inputType.Date:
                formSchema[field.label] = Joi.date();
                break;
            case inputType.Text:
                formSchema[field.label] = Joi.string();
                break;
            case inputType.Time:
                formSchema[field.label] = Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/)
                break;
        }

        if (field.required) {
            formSchema[field.label].required();
        }

    })

    console.log(formSchema);

    return Joi.object(formSchema);

}