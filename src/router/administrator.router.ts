import { Router } from "express";
import { addFormController, deleteFormController, deleteMemberController, updateFormController, updateMemberActivationController,  viewMembersController } from "../controller/administrator.controller";
import { clientErrorHandler, errorHandler } from "../exception/errorHandler";
import { adminVerificationMiddleware, authenticationMiddleware } from "../middleware/authentication.middleware";


const administratorRouter = Router();


administratorRouter.use(authenticationMiddleware);
administratorRouter.use(adminVerificationMiddleware)
administratorRouter.post("/addForm", addFormController);
administratorRouter.post("/updateForm", updateFormController);
administratorRouter.post("/memberActivation", updateMemberActivationController);


administratorRouter.get("/viewMembers", viewMembersController);


administratorRouter.delete("/deleteForm",deleteFormController)
administratorRouter.delete("/deleteMember",deleteMemberController);

administratorRouter.use(clientErrorHandler);
administratorRouter.use(errorHandler);

export default administratorRouter;



