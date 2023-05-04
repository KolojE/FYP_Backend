import { Router } from "express"
import { getReportController, reportIncidentController } from "../controller/complainant.controller";
import { authenticationMiddleware, complainantVerificationMiddleware } from "../middleware/authentication.middleware";



const complainantRouter = Router();

complainantRouter.use(authenticationMiddleware);
complainantRouter.use(complainantVerificationMiddleware);

complainantRouter.post("/reportIncident", reportIncidentController);
complainantRouter.get("/getSubmittedReports",getReportController);
export default complainantRouter;