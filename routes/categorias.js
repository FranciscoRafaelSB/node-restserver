import { Router } from "express";
import { check } from "express-validator";
import {
  validarJWT,
  validarCampos,
  isAdminRole,
  isRole,
} from "../middlewares/index.js";
import {
  categoriaGetByID,
  categoriasGet,
  categoriasPut,
  catergoriaBorrar,
  crearCategoria,
} from "../controllers/categorias.js";
import { existeCategoriaPorId } from "../helpers/dbValidators.js";

export const categoriasRouter = Router();

/**
 * {{url}}/api/categorias
 */

//Obtener todas las categorías - público
categoriasRouter.get("/", categoriasGet);

//Obtener una categoría por id - público
categoriasRouter.get(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  categoriaGetByID
);

//Crear una categoría - cualquier persona con un token válido
categoriasRouter.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es oligatorio").notEmpty(),
    validarCampos,
  ],
  crearCategoria
);

//Actualizar una categoría - cualquier persona con un token válido
categoriasRouter.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  categoriasPut
);

//Borrar una categoría - Admin
categoriasRouter.delete(
  "/:id",
  [
    validarJWT,
    isAdminRole,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  catergoriaBorrar
);
