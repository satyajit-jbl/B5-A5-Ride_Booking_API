
import { Router } from "express";
import { UserControllers } from "./user.controller";
import { validateRequest } from "../../middlewares/validateRequests";
import { createUserZodSchema } from "./user.validation";
import { Role } from './user.interface';
import { checkAuth } from '../../middlewares/checkAuth';

const router = Router()

router.post("/register", 
    validateRequest(createUserZodSchema), 
    UserControllers.createUser)
router.get("/all-users", checkAuth(Role.ADMIN, Role.SUPER_ADMIN), UserControllers.getAllUsers)

export const UserRoutes = router