import { Router } from "express";
import { authentication } from "../controller/authentication.controller";
import { clientErrorHandler, errorHandler } from "../exception/errorHandler";

const authenticationRouter = Router();

authenticationRouter.post("/login", authentication);
authenticationRouter.use(clientErrorHandler);
authenticationRouter.use(errorHandler);

export default authenticationRouter;