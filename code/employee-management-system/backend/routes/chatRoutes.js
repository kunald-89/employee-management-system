import {Router} from "express";
import rateLimit from "express-rate-limit";
import {chat} from "../controllers/chatController.js";
import {requireAuth} from "../middleware/auth.js";
const router=Router(),limiter=rateLimit({windowMs:60000,limit:8,standardHeaders:"draft-8",legacyHeaders:false});
router.post("/",requireAuth,limiter,chat);
export default router;