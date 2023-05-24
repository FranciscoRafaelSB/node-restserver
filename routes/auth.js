import { Router } from "express";
import { check } from "express-validator";

import { googleSignIn, login } from "../controllers/auth.js";
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
authRouter.post(
  "/google",
  [check("id_token", "Google token is required").notEmpty(), validarCampos],
  googleSignIn
);
