import { Router } from "express";
import { check } from "express-validator";

import {
  usuariosDelete,
  usuariosGet,
  usuariosPost,
  usuariosPut,
} from "../controllers/usuarios.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import {
  emailExiste,
  esRolValido,
  existeUsuarioPorId,
} from "../helpers/dbValidators.js";

export const router = Router();

router.get("/", usuariosGet);

router.put(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRolValido),
    validarCampos,
  ],
  usuariosPut
);

router.post(
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

router.delete(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);
