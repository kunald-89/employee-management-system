import {Router} from "express";
import rateLimit from "express-rate-limit";
import {login,currentUser} from "../controllers/authController.js";
import {requireAuth} from "../middleware/auth.js";
const router=Router(),limiter=rateLimit({windowMs:15*60*1000,limit:10,standardHeaders:"draft-8",legacyHeaders:false});
router.post("/login",limiter,login);router.get("/me",requireAuth,currentUser);
export default router;