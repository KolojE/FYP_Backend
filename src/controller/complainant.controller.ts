import { Request, Response } from "express";
import { reportIncidentService } from "../services/reportIncident.service";
import ReportModel from "../models/report";
import { PipelineStage } from "mongoose";
import { clientError, statusCode } from "../exception/errorHandler";
import { ObjectId } from "mongodb";


export async function reportIncidentController(req: Request, res: Response, next: Function) {

    try {
        
        await reportIncidentService.reportIncident(req.body, req.user);
        res.status(200).json(
            {
                message: "Vlidate sucess, report being saved"
            },
        ).send()
    } catch (err) {
        next(err)
    }

}

export async function reportPhotoVideoUploadController(req: Request, res: Response, next: Function) {
try {
        const file = req.file;
        if (!file) {
            throw new clientError({
                message: "No File Uploaded",
                status: statusCode.badRequest,
            })
        }

        file.path = file.path.replace(/\\/g, "/");
        file.path = file.path.replace("public", "");

        res.status(200).json({
            message: `Photo/Video Uploaded Successfully path is ${file.path}`,
            filePath: file.path
        })

    } catch (err) {
        next(err)
    }
    
}


export async function getReportController(req: Request, res: Response, next: Function) {

    try {
        const user = req.user;
        const limit = req.query?.limit;
        const reportID = req.query?.reportID;
        const subDate = {
            fromDate: req.query?.subFromDate,
            toDate: req.query?.subToDate
        }
        const sortBy = req.query?.sortBy;
        const status = req.query?.status?.toString().split(",");
        const type = req.query?.type?.toString().split(",");


        if (reportID) {
            const report = await ReportModel.findOne({
                _id: reportID,
                "organization": user.organization._id,
                "complainant": user._id,
            }).populate("status").populate("form");

            if (!report) {
                throw new clientError({
                    message: `No Report Found with _id ${reportID}`,
                    status: statusCode.notfound,
                })
            }
            console.log(report)
            res.status(200).json({
                message: "Report Found",
                report: report
            })

            return
        }

        const query = ReportModel.find({
            organization: user.organization._id,
            complainant: user._id,
        })

        if (subDate.fromDate) {
            query.find({
                submissionDate: { $gte: new Date(subDate.fromDate.toString()) },
            })
        }
        if (subDate.toDate) {
            query.find({
                submissionDate: { $lte: new Date(subDate.toDate.toString()) },
            })
        }

        if (status || type) {
            const statuses = status?.map((id) => {
                return { "status": new ObjectId(id) }
            }) || []

            const types = type?.map((id) => {
                return { "form": new ObjectId(id) }
            }) || []

            const and = []

            if (statuses.length > 0) {
                and.push({ $or: statuses })
            }

            if (types.length > 0) { 
                and.push({ $or: types })
            }

            console.log(statuses)
            query.find({
                $and:and
                
            })
        }


        if (sortBy == "upDate") {
            query.sort({
                "updateDate": 1
            })
        }
        else {
            query.sort({
                "submissionDate": 1
            })
        }


        query.populate("status").populate("complainant").populate("form")

        if (limit) {
            query.limit(parseInt(limit.toString()))
        }

        const result = await query.exec();

        console.log(JSON.stringify(result,null,2))
        res.status(200).send({
            message: `successfully get the submitted reports by User ${user._id}`,
            reports: result
        })

    } catch (err) {
        next(err);
    }

}

