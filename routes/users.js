import { Router } from "express";
import { check } from "express-validator";

import {
  validarJWT,
  validarCampos,
  isAdminRole,
  isRole,
} from "../middlewares/index.js";

import {
  usuariosDelete,
  usuariosGet,
  usuariosPost,
  usuariosPut,
} from "../controllers/usuarios.js";
import {
  emailExiste,
  esRolValido,
  existeUsuarioPorId,
} from "../helpers/dbValidators.js";

export const usersRouter = Router();

usersRouter.get("/", usuariosGet);

usersRouter.put(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRolValido),
    validarCampos,
  ],
  usuariosPut
);

usersRouter.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check("password", "El password es obligatorio y mas de 6 letras").isLength({
      min: 6,
    }),
    // check("correo", "El correo no es valido").isEmail(),
    check("correo").isEmail().custom(emailExiste),
    check("rol").custom(esRolValido),

    // check("rol", "No es un rol permitido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    validarCampos,
  ],
  usuariosPost
);

usersRouter.delete(
  "/:id",
  [
    validarJWT,
    // isAdminRole,
    isRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);
