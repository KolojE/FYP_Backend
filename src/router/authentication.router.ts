import { Router } from "express";
import { authentication } from "../controller/authentication.controller";

const authenticationRouter = Router();

authenticationRouter.post("/login", authentication);

export default authenticationRouter;