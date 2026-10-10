import { Router } from "express";
import { listEmployees, myEmployee, createEmployee, updateEmployee, deleteEmployee } from "../controllers/employeeController.js";
import { requireAuth, allowRoles } from "../middleware/auth.js";

const router = Router();
const managersOnly = [requireAuth, allowRoles("admin", "hr")];

router.get("/me", requireAuth, myEmployee);
router.get("/", ...managersOnly, listEmployees);
router.post("/", ...managersOnly, createEmployee);
router.put("/:id", ...managersOnly, updateEmployee);
router.delete("/:id", ...managersOnly, deleteEmployee);

export default router;
