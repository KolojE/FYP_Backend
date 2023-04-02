import { Router } from "express";
import { register_Complainant } from "../controller/registration.controller";

const registrationRouter = Router();

//use authentication middleware

registrationRouter.post("/register", register_Complainant);
export default registrationRouter;
