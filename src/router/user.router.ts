import { Router } from "express";
import { getUserInfoController } from "../controller/user.controller";
import { authenticationMiddleware } from "../middleware/authentication.middleware";
import { clientErrorHandler, errorHandler } from "../exception/errorHandler";


const userRouter = Router()

userRouter.use(authenticationMiddleware)

userRouter.get("/getUserInfo",getUserInfoController);

userRouter.use(clientErrorHandler);
userRouter.use(errorHandler);
export default userRouter;