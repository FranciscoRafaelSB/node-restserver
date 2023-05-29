import { Router } from "express";
import { check } from "express-validator";
import {
  validarJWT,
  validarCampos,
  isAdminRole,
  isRole,
} from "../middlewares/index.js";

import {
  existeCategoriaPorId,
  existeProductoPorId,
} from "../helpers/dbValidators.js";
import {
  actualizarProducto,
  borrarProducto,
  crearProducto,
  obtenerProducto,
  obtenerProductos,
} from "../controllers/productos.js";

export const productosRouter = Router();

/**
 * {{url}}/api/productos
 */

//Obtener todos los productos - público
productosRouter.get("/", obtenerProductos);

//Obtener un producto por id - público
productosRouter.get(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  obtenerProducto
);

//Crear un producto - cualquier persona con un token válido
productosRouter.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es oligatorio").notEmpty(),
    check("categoria").custom(existeCategoriaPorId),
    check("categoria", "La categoria es oligatoria").isMongoId(),

    validarCampos,
  ],
  crearProducto
);

//Actualizar un producto - cualquier persona con un token válido
productosRouter.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  actualizarProducto
);

//Borrar un producto - Admin
productosRouter.delete(
  "/:id",
  [
    validarJWT,
    isAdminRole,
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  borrarProducto
);
