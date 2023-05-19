import { response, request } from "express";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/usuario.js";

export const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No hay token en la peticion",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    req.uid = payload.uid;

    // leer el usuario que corresponde al uid
    const usuario = await Usuario.findById(payload.uid);

    // verificar si el usuario existe
    if (!usuario) {
      return res.status(401).json({
        msg: "Token no valido - usuario no existe en DB",
      });
    }

    // verificar si el uid tiene estado true
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token no valido - usuario con estado: false",
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(401).json({
      msg: "Token no valido",
    });
  }
};
