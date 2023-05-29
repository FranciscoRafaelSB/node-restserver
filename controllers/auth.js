import bcryptjs from "bcryptjs";

import { response, request } from "express";
import { Usuario } from "../models/usuario.js ";
import { generarJWT } from "../helpers/generarJWT.js";
import { googleVerify } from "../helpers/google-verify.js";

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

export const googleSignIn = async (req = request, res = response) => {
  const { id_token } = req.body;

  try {
    const { nombre, correo, img } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      //Tengo que crearlo
      const data = {
        nombre,
        correo,
        password: ":P",
        img,
        rol: "USER_ROLE",
        google: true,
      };

      usuario = new Usuario(data);
      await usuario.save();
    }

    //Si el usuario en DB
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Hable con el administrador, usuario bloqueado",
      });
    }

    //Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Token de google no es valido",
    });
  }
};

