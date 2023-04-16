import { Router } from "express";
import { clientErrorHandler, errorHandler } from "../exception/errorHandler";
import authenticationRouter from "./authentication.router";
import registrationRouter from "./registration.rotuer";
import organizationRouter from "./organization.router";
import administratorRouter from "./administrator.router";
import complainantRouter from "./complainant.router";
import userRouter from "./user.router";

const mainRouter = Router();

mainRouter.use(authenticationRouter);
mainRouter.use(registrationRouter);

mainRouter.use("/Organization", organizationRouter)
mainRouter.use("/report", complainantRouter)
mainRouter.use("/admin", administratorRouter);
mainRouter.use("/user",userRouter);
mainRouter.use(clientErrorHandler);
mainRouter.use(errorHandler);

export default mainRouter;

