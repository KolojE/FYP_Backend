import { Router } from "express"
import { reportIncidentController } from "../controller/complainant.controller";
import { authenticationMiddleware, complainantVerificationMiddleware } from "../middleware/authentication.middleware";



const complainantRouter = Router();

complainantRouter.use(authenticationMiddleware);
complainantRouter.use(complainantVerificationMiddleware);

complainantRouter.post("/reportIncident", reportIncidentController);

export default complainantRouter;