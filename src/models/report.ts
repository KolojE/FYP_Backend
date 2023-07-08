import { Document, Mixed, Model, model, Schema, Types } from "mongoose";
import { inputType } from "./form";
import { any } from "joi";


interface IComment{
    comment:string;
    admin?: string;
    
}

export interface IDetails 
{
[key:string]:{
    label:string;
    inputType:inputType;
    value:any;
};
}

const detailsSchema = new Schema<IDetails>({
    label: { type: String, required: true },
    inputType: { type: String, required: true },
    value: { type:Schema.Types.Mixed, required: true },
  });


export interface IReport extends Document {
    submissionDate: Date;
    updateDate:Date;
    details: IDetails;
    location:{
        latitude:number;
        longitude:number;
    }
    form: Types.ObjectId;
    status: Types.ObjectId;
    organization: Types.ObjectId;
    complainant: Types.ObjectId;
    comment?:IComment;

}


const reportSchema = new Schema<IReport>({
    updateDate:{type:Date,required:true},
    submissionDate: { type: Date, required: true },
    details: { 
        type: Map,
        of: detailsSchema,
        required: true
    },
    location:{
        latitude:{type:Schema.Types.Number,required:true},
        longitude:{type:Schema.Types.Number,required:true}
    },
    form: { type: Schema.Types.ObjectId, required: true, ref: "form" },
    organization: { type: Schema.Types.ObjectId, required: true, ref: "organization" },
    complainant: { type: Schema.Types.ObjectId, required: true, ref: "user" },
    status: { type: Schema.Types.ObjectId, required: true, ref:"status"},
    comment: {
        comment:{type:Schema.Types.String,required:false},
        admin: {type:Schema.Types.ObjectId,required:false,ref:"admin"}
    }

});

const ReportModel: Model<IReport> = model<IReport>('report', reportSchema);

export default ReportModel;
