import { Schema, ObjectId, model, Model } from "mongoose"
interface Complainant {
    complainant_ID: Schema.Types.ObjectId,
    complainant_Email: string,
    complainant_Password: string,
    complainant_Profile: string,
    organization: {
        type: Schema.Types.ObjectId, ref: 'Organization'
    }
}

const complainantSchema = new Schema<Complainant>({
    complainant_ID: { type: Schema.Types.ObjectId, required: true },
    complainant_Email: { type: String, required: true },
    complainant_Password: { type: String, required: true },
    complainant_Profile: { type: String, required: true },
    organization: {
        type: Schema.Types.ObjectId, ref: 'Organization'
    }
});


const complainantModel: Model<Complainant> = model<Complainant>('Complainant', complainantSchema)

export default complainantModel;