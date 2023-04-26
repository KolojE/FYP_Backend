import { Router } from "express";
import { authenticationController } from "../controller/authentication.controller";
import { clientError, clientErrorHandler, errorHandler } from "../exception/errorHandler";

const authenticationRouter = Router();

authenticationRouter.post("/login", authenticationController);
authenticationRouter.use(clientErrorHandler);
authenticationRouter.use(errorHandler)
export default authenticationRouter;