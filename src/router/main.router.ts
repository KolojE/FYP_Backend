import { Router } from "express";
import { clientErrorHandler, errorHandler } from "../exception/errorHandler";
import authenticationRouter from "./authentication.router";
import complainantRouter from "./registration.rotuer";
import organizationRouter from "./organization.router";
import administratorRouter from "./administrator.router";

const mainRouter = Router();

mainRouter.use("/Organization", organizationRouter)
mainRouter.use("/Complainant", complainantRouter)
mainRouter.use(authenticationRouter);
mainRouter.use(administratorRouter);
mainRouter.use(clientErrorHandler);
mainRouter.use(errorHandler);

export default mainRouter;

