import express, { Router } from "express";
import { createCollectionController, registerOrganizationController } from "../controller/organization.controller";
import { clientErrorHandler, errorHandler } from "../exception/errorHandler";


const organizationRouter: Router = express.Router();

organizationRouter.use(express.json())

organizationRouter.post('/addOrganization', registerOrganizationController);
organizationRouter.post('/createCollection', createCollectionController);
organizationRouter.use(clientErrorHandler);
organizationRouter.use(errorHandler)

//error handler middleware
export default organizationRouter;