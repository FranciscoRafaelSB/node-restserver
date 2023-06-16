import { Router } from "express";
import { check } from "express-validator";

import { validarCampos, validarArchivoSubir } from "../middlewares/index.js";
import {
  actualizarImagen,
  actualizarImagenCloudynary,
  cargarArchivo,
  mostrarImagen,
} from "../controllers/uploads.js";
import { coleccionesPermitidasValidas } from "../helpers/dbValidators.js";

export const uploadRouter = Router();

// Path: /api/uploads

// Subir archivos
uploadRouter.post("/", validarArchivoSubir, cargarArchivo);

uploadRouter.put(
  "/:coleccion/:id",
  [
    validarArchivoSubir,
    check("id", "El id debe ser de mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidasValidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  //   actualizarImagen
  actualizarImagenCloudynary
);

uploadRouter.get(
  "/:coleccion/:id",
  [
    check("id", "El id debe ser de mongo").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidasValidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  mostrarImagen
);
