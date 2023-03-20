import { Router } from "express";
import { clientErrorHandler, errorHandler } from "../exception/errorHandler";
import authenticationRouter from "./authentication.router";
import complainantRouter from "./registration.rotuer";
import organizationRouter from "./organization.router";

const mainRouter = Router();

mainRouter.use("/Organization", organizationRouter)
mainRouter.use("/Complainant", complainantRouter)
mainRouter.use(authenticationRouter);
mainRouter.use(errorHandler);
mainRouter.use(clientErrorHandler);

export default mainRouter;

