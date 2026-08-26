import { Router } from "express";
import {
  getBoards,
  createBoard,
  getBoard,
} from "../controllers/board.controller";

const router = Router();

router.get("/boards/:orgId", getBoards);
router.post("/board", createBoard);
router.get("/board/:boardId", getBoard);
// Todo
// router.patch("/:boardId",updateBoard)
// router.delete("/:boardId",deleteBoard)

export default router;
