import { Router } from "express";
import { addFormController } from "../controller/administrator.controller";
import { clientErrorHandler, errorHandler } from "../exception/errorHandler";
import { authenticationMiddleware } from "../middleware/authentication.middleware";


const administratorRouter = Router();


administratorRouter.use(authenticationMiddleware);
administratorRouter.post("/addForm", addFormController);

administratorRouter.use(clientErrorHandler);
administratorRouter.use(errorHandler);

export default administratorRouter;



