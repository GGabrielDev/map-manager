import { Router } from "express";
import { AllRoles, SearchRoleById, CreateRoles, UpdateRoles, DeleteRoles } from "@/controllers/Role";

const router = Router();

router.get("/roles", AllRoles);
router.get("/roles/:id", SearchRoleById);
router.post("/roles", CreateRoles);
router.put("/roles/:id", UpdateRoles);
router.delete("/roles/:id", DeleteRoles);

export default router;