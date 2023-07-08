import { Request, Response, query } from "express";
import complaiantModel, { IComplainant } from "../models/complainant";
import { administratorService } from "../services/administrator.service";
import { validationService } from "../services/validation.service";
import { FormModel } from "../models/form";
import { clientError, statusCode } from "../exception/errorHandler";
import userModel, { IUser, role } from "../models/user";
import mongoose, { isObjectIdOrHexString } from "mongoose";
import ReportModel, { IReport } from "../models/report";
import statusModel, { Status } from "../models/status";
import { ObjectId } from "mongodb";
import OrganizationModel, { IOrganization } from "../models/organization";
import adminModel from "../models/administrator";



export async function addFormController(req: Request, res: Response, next: Function) {
    try {
        const newForm = req.body;
        const user = req.user;
        console.log(newForm)
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

        console.log(`Form ${updateForm._id} is updated. `, updatedForm, updateForm);
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

        const deletedForm = await FormModel.findOneAndUpdate({
            _id: formToDelete,
            organization: user.organization
        },
            {
                $set: {
                    isDeleted: true
                }
            });

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

    type Members = { user: IUser, organization: IOrganization, base64ProfilePicture: string | null } & IComplainant[]

    try {
        const members = await complaiantModel.aggregate<Members>([
            {
                $lookup: {
                    from: "users", localField: "user", foreignField: "_id",
                    as: "user"
                }
            }
            ,
            {
                $lookup: {
                    from: "organizations", localField: "user.organization", foreignField: "_id",
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

        const deletedMember = await userModel.findOne({ _id: deleteUserId, role: role.complainant, "organization": user.organization })

        const deletedComplainant = await complaiantModel.findOne({ user: deleteUserId })

        if (!deletedComplainant) {
            throw new clientError({
                message: `No member is deleted cause the ID associated to the member is not found or trying to delete admin account ${deleteUserId}`,
                status: statusCode.notfound,
            })
        }

        if (deletedComplainant.activation) {
            throw new clientError({
                message: `No member is deleted cause the member is activated ${deleteUserId}`,
                status: statusCode.notfound,
            })
        }

        if (!deletedMember) {
            throw new clientError({
                message: `No member is deleted cause the ID associated to the member is not found or trying to delete admin account ${deleteUserId}`,
                status: statusCode.notfound,
            })
        }

        res.status(200).json({
            message: `successfully deleted member ${deleteUserId}`,
            data: deletedMember,
        }).send()

    }
    catch (err) {
        next(err);
    }
}

export async function getReportController(req: Request, res: Response, next: Function) {
    try {

        console.log(req.query)

        if (req.query.reportID) {
            const reportID = req.query.reportID;
            const report = await ReportModel.findOne({
                _id: reportID
                , "organization": req.user.organization._id
            }).populate("status").populate("form").populate({
                path: "complainant",
                select: "-password -organization",
                options: { lean: true },
                justOne: true,
            }).lean();

            console.log(report)
            if (!report) {
                throw new clientError({
                    message: `Report with id ${reportID} is not found`,
                    status: statusCode.notfound,
                })
            }

            res.status(200).send({
                message: `Successfully returned report`,
                report: report,
            })

            return;
        }

        const query = administratorService.filterQueryBuilder(req);
        const result = await query.exec()

        console.log(result)
        res.status(200).send({
            message: `Successfully returned reports for organization`,
            reports: result,
        })

    } catch (err) {
        next(err)
    }

}

export async function getReportExcelController(req: Request, res: Response, next: Function) {
    try {
        const pipeline = administratorService.filterQueryBuilder(req);
        const result = await pipeline.exec();
        const transformedResult = await administratorService.reportResultTransformer(result);
        const reportExcel = await administratorService.generateReportExcel(transformedResult);

        res.status(200).send({
            fileUrl: reportExcel,
        })

    } catch (err) {
        next(err)
    }

}


export async function updateOrganization(req: Request, res: Response, next: Function) {

    type StatusReplacmentMapper = {
        [key: string]: string
    }

    const user = req.user;
    const organizationToUpdate: IOrganization = req.body.organization;
    const stattusesToUpdateAndCreate: Status[] = req.body.statuses;
    const statusesToDelete: Status[] = req.body.statusesToDelete;
    const statusReplacementMapper: StatusReplacmentMapper = req.body.statusReplacementMapper;

    const defaultStatusID = organizationToUpdate.system.defaultStatus;


    try {

        const organization = await OrganizationModel.findOne({ _id: user.organization });
        if (!organization) {
            throw new clientError({
                message: `Organization not found`,
                status: statusCode.notfound,
            })
        }
        if (user.organization._id != organizationToUpdate._id) {
            throw new clientError({
                message: `You are not authorized to update organization`,
                status: statusCode.unauthorized,
            })
        }

        const newStatuesOldIDs: string[] = [];
        const newStatuses: Status[] = [];
        const updatedStatuses: Status[] = [];
        const deletedStatuses: Status[] = [];
        if (stattusesToUpdateAndCreate) {
            for (let i = 0; i < stattusesToUpdateAndCreate.length; i++) {
                const status = stattusesToUpdateAndCreate[i];
                let newID = ""
                if (!isObjectIdOrHexString(status._id)) {
                    const newStatus = new statusModel({
                        desc: status.desc,
                        organization: user.organization,
                    });

                    newStatuses.push(newStatus);
                    newStatuesOldIDs.push(status._id.toString());
                    newID = newStatus._id.toHexString();
                }
                else {
                    const updatedStatus = await statusModel.findOne({ _id: status._id, "organization": user.organization });
                    if (!updatedStatus) {
                        throw new clientError({
                            message: `no status with id ${status._id} was found`,
                            status: statusCode.notfound,
                        })
                    }
                    updatedStatus.desc = status.desc;
                    updatedStatuses.push(updatedStatus);
                    newID = updatedStatus._id.toHexString();
                }

                if (status._id == defaultStatusID) {
                    const ID = new mongoose.Types.ObjectId(newID);
                    organizationToUpdate.system.defaultStatus = ID
                }
            }
        }

        const reportsToUpdateQueries: mongoose.Query<mongoose.mongo.UpdateResult, mongoose.Document<unknown, {}, IReport> & Omit<IReport & { _id: mongoose.Types.ObjectId; }, never>, {}, IReport>[] = []

        if (statusReplacementMapper) {
            Object.keys(statusReplacementMapper).forEach((key) => {
                const reportWithStatusID = key;
                const updateReportToStatusID = statusReplacementMapper[key];

                if (!isObjectIdOrHexString(reportWithStatusID)) {
                    throw new clientError({
                        message: `report id ${reportWithStatusID} is not a valid id`,
                        status: statusCode.badRequest,
                    })
                }

                if (!isObjectIdOrHexString(updateReportToStatusID)) {
                    const newStatusHexIDIndex = newStatuesOldIDs.findIndex((status) => status == updateReportToStatusID);
                    if (newStatusHexIDIndex == -1) {
                        throw new clientError({
                            message: `status id ${updateReportToStatusID} is not a valid id`,
                            status: statusCode.badRequest,
                        })
                    }
                    const newStattusHexID = newStatuses[newStatusHexIDIndex]._id.toHexString();
                    statusReplacementMapper[key] = newStattusHexID;
                }
                reportsToUpdateQueries.push(ReportModel.updateMany({
                    status: key,
                    organization: user.organization,
                },{
                    status: statusReplacementMapper[key],
                }))
            })
        }

        if (statusesToDelete) {
            for (let i = 0; i < statusesToDelete.length; i++) {
                const status = statusesToDelete[i];
                if (!isObjectIdOrHexString(status._id)) {
                    throw new clientError({
                        message: `status to be delete id ${status._id} is not a valid id`,
                        status: statusCode.notfound,
                    })
                }
                const deletedStatus = await statusModel.findOne({ _id: status._id, "organization": user.organization });
                if (!deletedStatus) {
                    throw new clientError({
                        message: `no status with id ${status._id} was found`,
                        status: statusCode.notfound,
                    })
                }
                if (deletedStatus._id === organization.system.defaultStatus) {
                    throw new clientError({
                        message: `default status cannot be deleted`,
                        status: statusCode.badRequest,
                    })
                }

                deletedStatuses.push(deletedStatus);
            }
        }

        if (organizationToUpdate) {
            await OrganizationModel.findOneAndUpdate({ _id: new ObjectId(user.organization) }, {
                name: organizationToUpdate.name,
                contactNo: organizationToUpdate.contactNo,
                address: organizationToUpdate.address,
                "system.defaultStatus": organizationToUpdate.system.defaultStatus,
                "system.autoActiveNewUser": organizationToUpdate.system.autoActiveNewUser,
            }, { new: true }).lean();
        }

        console.log(deletedStatuses)
        if (newStatuses.length > 0) {
            await statusModel.insertMany(newStatuses);
        }

        if (deletedStatuses.length > 0) {
            await statusModel.deleteMany({ $or: statusesToDelete.map((status) => ({ _id: status._id })) });
        }

        if (updatedStatuses.length > 0) {
            await statusModel.bulkWrite(updatedStatuses.map((status) => ({
                updateOne: {
                    filter: { _id: status._id },
                    update: { desc: status.desc },
                }
            })))
        }

        const updatedReport =  await Promise.all(reportsToUpdateQueries);

        const updatedNewStatuses = await statusModel.find({ "organization": user.organization }).select({ organization: 0 });
        const updatedOrganization = await OrganizationModel.findOne({ _id: user.organization });


        res.status(200).send({
            message: "succesfully updated organization ",
            organization: updatedOrganization,
            statuses: updatedNewStatuses,
        })
    }
    catch (err) {
        next(err)
    }

}

export async function updateReportController(req: Request, res: Response, next: Function) {

    console.log(req.body)
    const user = req.user;
    const reportID: string = req.body.reportID;
    const reportStatus: string = req.body.status;
    const reportComment: string = req.body.comment;

    try {
        const status = await statusModel.findOne({ _id: reportStatus, "organization": user.organization._id });
        if (!status) {
            throw new clientError({
                message: `status not found`,
                status: statusCode.notfound,
            })
        }

        const adminID = await adminModel.findOne({ "user": user._id }).select('_id');


        const report = await ReportModel.findOneAndUpdate({ _id: reportID, "organization": user.organization._id },
            {
                $set: {
                    status: status._id,
                    comment: {
                        comment: reportComment,
                        admin: adminID,
                    },
                }
            }, {
            new: true,
        }).populate({
            path: 'status',
        });

        console.log(JSON.stringify(report, null, 2))

        if (!report) {
            throw new clientError({
                message: `report not found`,
                status: statusCode.notfound,
            })
        }

        console.log(report.status._id)

        res.status(200).send({
            message: "succesfully updated report ",
            report: report,
        })

    }
    catch (err) {
        next(err)
    }


}