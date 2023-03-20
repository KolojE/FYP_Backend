import { Router } from "express";
import { register_Complainant } from "../controller/registration.controller";
import { clientErrorHandler, errorHandler } from "../exception/errorHandler";

const registrationRouter = Router();

//use authentication middleware

registrationRouter.post("/registerComplainant", register_Complainant);
export default registrationRouter;
