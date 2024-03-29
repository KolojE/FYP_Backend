import { Router } from "express"
import { getReportController, reportIncidentController, reportPhotoVideoUploadController } from "../controller/complainant.controller";
import { authenticationMiddleware, complainantVerificationMiddleware } from "../middleware/authentication.middleware";
import { reportPictureMulter } from "../middleware/multerMiddleware";



const complainantRouter = Router();

complainantRouter.use(authenticationMiddleware);
complainantRouter.use(complainantVerificationMiddleware);

complainantRouter.post("/uploadReportPhoto",reportPictureMulter.single("photo"),reportPhotoVideoUploadController );
complainantRouter.post("/reportIncident", reportIncidentController);
complainantRouter.get("/getSubmittedReports",getReportController);
export default complainantRouter;