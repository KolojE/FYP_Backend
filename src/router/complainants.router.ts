import { Router } from "express";
import { register_Complainant } from "../controller/complainant.controller";
import { clientErrorHandler, errorHandler } from "../exception/errorHandler";

const complainantRouter = Router();

//use authentication middleware
complainantRouter.post("/registerComplainant", register_Complainant);
complainantRouter.use(clientErrorHandler);
complainantRouter.use(errorHandler);
export default complainantRouter;
