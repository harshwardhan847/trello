import { Router } from "express";
import {
  createBoard,
  getBoard,
  getBoards,
} from "../controllers/board.controller";

const router = Router();

router.get("/boards", getBoards);
router.get("/boards/:boardId", getBoard);
router.post("/boards/:boardId", createBoard);

export default router;
