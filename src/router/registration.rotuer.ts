import { Router } from "express";
import { registerComplainantController } from "../controller/registration.controller";

const registrationRouter = Router();

//use authentication middleware

registrationRouter.post("/register", registerComplainantController);
export default registrationRouter;
