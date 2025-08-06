import { Router } from "express";
import { AllUsers, SearchUsersById, CreateUsers, UpdateUsers, DeleteUser, LoginUsers } from "@/controllers/User";

const router = Router();

router.get("/users", AllUsers);
router.post("/login/", LoginUsers);
router.get("/users/:id", SearchUsersById);
router.post("/users", CreateUsers);
router.put("/users/:id", UpdateUsers);
router.delete("/users/:id", DeleteUser);

export default router;