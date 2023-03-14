import { Router } from "express";
import { register_Complainant } from "../controller/complainant.controller";
import { authentication } from "../middleware/authentication";

const complainantRouter = Router();

//use authentication middleware
complainantRouter.use(authentication);

complainantRouter.post("/registerComplainant", register_Complainant);

export default complainantRouter;
