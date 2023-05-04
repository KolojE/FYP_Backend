import { Request, Response } from "express";
import { reportIncidentService } from "../services/reportIncident.service";
import ReportModel from "../models/report";
import { PipelineStage } from "mongoose";


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


export async function getReportController(req: Request, res: Response, next: Function) {

    try {
        const user = req.user;
        const limit = req.query?.limit;
        const subDate = {
            fromDate: req.query?.subFromDate,
            toDate: req.query?.subToDate
        }
        const sortBy = req.query?.sortBy;

        //default pipeline.
        const pipeline: PipelineStage[] = [
            {
                $match: {
                    "complainant._id": user._id,
                    "organization._id": user.organization._id,
                },
            },
            {
                $lookup: {
                    from: "forms",
                    localField: "form",
                    foreignField: "_id",
                    as: "form",
                },
            },
            {
                $lookup:{
                    from:"status",
                    localField:"status._id",
                    foreignField:"_id",
                    as:"status",
                }
            },
            {
                $unwind: "$form"

            },
            {
                $unwind:"$status"
            },
            {
                $addFields: {
                    "name": "$form.name",
                    "status":"$status.desc"
                
                }
            },
            {
                $project: {
                    "form": 0,
                }
                
            },
        ]


        if (limit) {
            pipeline.push({
                $limit: Number(limit)
            })
        }

        if (subDate.fromDate) {
            console.log(subDate)
            pipeline.push({
                $match: {
                    submissionDate: {
                        $gte: new Date(subDate.fromDate as string)
                    }
                }
            })
        }

        if (subDate.toDate) {
            pipeline.push({
                $match: {
                    submissionDate: {
                        $lte: new Date(subDate.toDate as string),
                    }
                }
            })
        }

        if(sortBy==="subDate")
        {
            pipeline.push({
                $sort:{
                    submissionDate:-1, 
                }
            })
        }else if(sortBy==="upDate")
        {
            pipeline.push({
                $sort:{
                    updateDate:-1,
                }
            })
        }


        const submittedReports = ReportModel.aggregate(pipeline)



        const reports = await submittedReports;

        console.log(JSON.stringify(reports, null, 2))
        res.status(200).send({
            message: `successfully get the submitted reprots by User ${user._id}`,
            reports: reports
        })

    } catch (err) {
        next(err);
    }

}

