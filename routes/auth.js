import { Router } from "express";
import { check } from "express-validator";

import { login } from "../controllers/auth.js";
import { validarCampos } from "../middlewares/validar-campos.js";

export const authRouter = Router();

authRouter.post(
  "/login",
  [
    check("correo", "the email is required").isEmail(),
    check("password", "Password is required.").notEmpty(),
    validarCampos,
  ],
  login
);
