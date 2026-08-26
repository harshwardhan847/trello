import { Router } from "express";
import { createOrg, getOrgs } from "../controllers/org.controller";

const router = Router();

router.get("/", getOrgs);
router.post("/", createOrg);
// TODO
// router.delete("/",deleteOrg);
// router.put("/",updateOrg)

export default router;
