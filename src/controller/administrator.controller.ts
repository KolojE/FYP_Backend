import { Request, Response, query } from "express";
import complaiantModel from "../models/complainant";
import { administratorService } from "../services/administrator.service";
import { validationService } from "../services/validation.service";
import { FormModel } from "../models/form";
import { clientError, statusCode } from "../exception/errorHandler";
import userModel, { role } from "../models/user";
import { FilterQuery, PipelineStage } from "mongoose";
import ReportModel from "../models/report";
import statusModel from "../models/status";
import { any } from "joi";
import { stat } from "fs";
import { ObjectId } from "mongodb";



export async function addFormController(req: Request, res: Response, next: Function) {
    try {
        const newForm = req.body;
        const user = req.user;

        await validationService.form_Validation(newForm);



        const form = await administratorService.addNewForm(newForm, user);
        res.status(200).json({
            message: "successfully added new form",
            data: form,
        })

    } catch (err) {
        next(err);
    }


}

export async function updateFormController(req: Request, res: Response, next: Function) {
    try {
        const updateForm = req.body;

        await validationService.form_Validation(updateForm);
        const updatedForm = await administratorService.updateForm(updateForm, req.user)
        res.status(200).json({
            message: "successfully updated form",
            data: updatedForm,
        }).send()
    } catch (err) {
        next(err);
    }
}

export async function deleteFormController(req: Request, res: Response, next: Function) {
    try {
        const formToDelete = req.query._id;
        const user = req.user

        const deletedForm = await FormModel.deleteOne({ _id: formToDelete }).where({ organization: user.organization })
        console.log(`Form ${formToDelete} is deleted. `);

        res.status(200).json({
            message: `sucessfully deleted form ${formToDelete}`,
            data: deletedForm
        })

    } catch (err) {
        next(err);
    }
}



export async function viewMembersController(req: Request, res: Response, next: Function) {
    try {
        const members = await complaiantModel.aggregate([
            {
                $lookup: {
                    from: "users", localField: "user._id", foreignField: "_id",
                    as: "user"
                }
            }
            ,
            {
                $lookup: {
                    from: "organizations", localField: "user.organization._id", foreignField: "_id",
                    as: "organization"
                }
            }
            ,
            {
                $match: {
                    'user.organization': req.user.organization
                }
            }
            ,
            {
                $unwind: "$user"

            },
            {
                $unwind: "$organization"
            },
            {
                $project: {
                    "user.password": 0,
                    "user.organization": 0,
                }
            }
        ]);

        console.log(members)
        res.status(200).json({
            message: "successfully get all members info",
            members: members
        })
    }
    catch (err) {
        next(err)
    }

}

export async function updateMemberActivationController(req: Request, res: Response, next: Function) {

    try {
        const body = req.body;
        console.log(body)
        const updatedMember = await administratorService.updateMemberActivationStatus(body.id, body.activation, req.user);
        res.status(200).json({
            message: "successfully updated member",
            data: updatedMember,
        }).send()
    } catch (err) {
        next(err)
    }
}

export async function deleteMemberController(req: Request, res: Response, next: Function) {
    try {
        const user = req.user;
        const deleteUserId = req.query._id;
        const deletedMember = await userModel.findOneAndDelete({
            _id: deleteUserId, role: role.complainant, "organization._id": user.organization._id
        })
        if (!deletedMember) {
            throw new clientError({
                message: `No member is deleted cause the ID associated to the member is not found or trying to delete admin account ${deleteUserId}`,
                status: statusCode.notfound,
            })
        }


    }
    catch (err) {
        next(err);
    }
}

export async function getReportController(req: Request, res: Response, next: Function) {
    try {
        const user = req.user;
        const sortBy = req.query?.sortBy;
        const groupByType = req.query?.groupByType ? false : true// group report by type, default to true
        const subDate = {
            fromDate: req.query?.subFromDate,
            toDate: req.query?.subToDate,
        };
        const status = req.query?.status?.toString().split(",");
        const type = req.query?.type?.toString().split(",");

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    "organization._id": user.organization._id,
                },

            },
        ]


        if (subDate.fromDate) {
            console.log(subDate.fromDate)
            pipeline.push({
                $match: {
                    submissionDate: { $gte: new Date(subDate.fromDate.toString()) },
                }
            })
        }
        if (subDate.toDate) {
            pipeline.push({
                $match: {
                    submissionDate: { $lte: new Date(subDate.toDate.toString()) },
                }
            })
        }

        if (status) {
            const statuses:FilterQuery<any>[] = []
            status.forEach((type) => {
                console.log(type)
                statuses.push({ "status._id":new ObjectId(type) })
            })
            pipeline.push({
                $match: {
                    $or: statuses
                    
                }
            })
        }

        if (type) {
            const types:FilterQuery<any>[] = []
            type.forEach((type) => {
                console.log(type)
                types.push({ "form_id":new ObjectId(type) })
            })
            pipeline.push({
                $match: {
                    $or: types
                    
                }
            })
        }

        if (sortBy == "upDate") {
            pipeline.push({
                $sort: { "updateDate": 1 }
            })
        }
        else {
            pipeline.push({
                $sort: { "submissionDate": 1 }
            })
        }

        if (groupByType) {
            pipeline.push(...[{
                $group: {
                    _id: "$form_id",
                    reports: { $push: "$$ROOT" },
                }
            }, {
                $lookup: {
                    from: "forms",
                    localField: "_id",
                    foreignField: "_id",
                    as: "form"
                }
            },
            {
                $unwind: "$form"
            },
            {
                $addFields: {
                    name: "$form.name"
                }
            }
            ])
        }


        const result = await ReportModel.aggregate(pipeline);
        console.log(result)
        res.status(200).send({
            message: `Successfully returned reports for organization`,
            reports: result,
        })


    } catch (err) {
        next(err)
    }
}

export async function getReportElement(req: Request, res: Response, next: Function) {
    try {
        const user = req.user;
        const includeType: boolean = req.query?.type ? true : false;
        const includeStatus: boolean = req.query?.status ? true : false;
        const element: {
            type: any,
            status: any
        } = {
            type: null,
            status: null,
        }

        if (includeType)
            element.type = await FormModel.find({ "organization._id": user.organization._id }).select('name');

        if (includeStatus)
            element.status = await statusModel.find({ "organization._id": user.organization._id }).select('desc');


        res.status(200).send({
            message: "succesfully returned Report Element ",
            element: element,
        })



    }
    catch (err) {

    }

}