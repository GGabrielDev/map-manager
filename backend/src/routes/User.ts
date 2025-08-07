import { Router, Request, Response } from "express";
import { AllUsers, SearchUserById, CreateUser, UpdateUser, DeleteUser} from "@/controllers/User";

const router = Router();

router.get(
    "/users",
    async (_, res) => {
        try {
            const users = await AllUsers();
            res.json(users);
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            }else{
                res.status(500).json({ message: "Error inesperado." });
            }
        }
    }
);

router.get(
    "/users/:id",
    async (req: Request, res: Response) => {
        try {
            const user = await SearchUserById(Number(req.params.id));
            if (!user) {
                return res.status(404).json({ message: "Usuario no encontrado." });
            }
            res.json(user);
        } catch (error) {
            if (error instanceof Error) {
                res.status(401).json({ message: error.message });
            }else{
                res.status(500).json({ message: "Error inesperado." });
            }
        }
    }
);
router.post("/users", CreateUser);
router.put("/users/:id", UpdateUser);
router.delete("/users/:id", DeleteUser);

export default router;