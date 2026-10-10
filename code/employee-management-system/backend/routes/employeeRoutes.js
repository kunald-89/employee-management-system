import {Router} from "express";
import {listEmployees,myEmployee,createEmployee} from "../controllers/employeeController.js";
import {requireAuth,allowRoles} from "../middleware/auth.js";
const router=Router();
router.get("/me",requireAuth,myEmployee);
router.get("/",requireAuth,allowRoles("admin","hr"),listEmployees);
router.post("/",requireAuth,allowRoles("admin","hr"),createEmployee);
export default router;