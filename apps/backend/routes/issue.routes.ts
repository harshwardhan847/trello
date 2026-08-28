import { Router } from "express";
import {
  createIssue,
  getIssue,
  getIssuesBySection,
} from "../controllers/issue.controller";

const router = Router();

router.get("/section/:sectionId", getIssuesBySection);
router.post("/", createIssue);
router.get("/:issueId", getIssue);
// TODO
// router.delete("/",);
// router.put("/",)

export default router;
