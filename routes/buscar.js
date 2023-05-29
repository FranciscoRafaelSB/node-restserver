import { Router } from "express";
import { check } from "express-validator";

import { buscar } from "../controllers/buscar.js";

export const buscarRouter = Router();

/**
 * {{url}}/api/buscar
 * */

buscarRouter.get("/:coleccion/:termino", buscar);
