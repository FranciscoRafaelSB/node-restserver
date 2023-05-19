import bcryptjs from "bcryptjs";

import { response, request } from "express";
import { Usuario } from "../models/usuario.js ";
import { generarJWT } from "../helpers/generarJWT.js";

export const login = async (req = request, res = response) => {
  const { correo, password } = req.body;
  try {
    //Verificar si el correo existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - correo",
      });
    }
    //Si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - estado: false",
      });
    }

    //Verificar la contraseña
    const isValidPassword = bcryptjs.compareSync(password, usuario.password);
    if (!isValidPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - password",
      });
    }

    //Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      msg: "Login ok",
      usuario,
      token,
    });
  } catch (error) {
    return response.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};
