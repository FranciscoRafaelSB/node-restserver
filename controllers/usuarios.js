import { request, response } from "express";
import { Usuario } from "../models/usuario.js";
import bcryptjs from "bcryptjs";

export const usuariosGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  // const usuarios = await Usuario.find(query)
  //   .skip(Number(desde))
  //   .limit(Number(limite));

  // const total = await Usuario.countDocuments(query);

  const [usuarios, total] = await Promise.all([
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
    Usuario.countDocuments(query),
  ]);

  res.json({
    // resp,
    usuarios,
    total,
  });
};

export const usuariosPost = async (req = request, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //Encriptar la contraseña
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);

  //Guardar en BD
  await usuario.save();

  res.json(usuario);
};

export const usuariosPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  //TODO validar contra base de datos
  if (password) {
    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json({
    msg: "put API - Controlador",
    usuario,
  });
};

export const usuariosDelete = async (req = request, res = response) => {
  const { id } = req.params;

  // const uid = req.uid;

  //Borrar fisicamente de la db
  // await Usuario.findByIdAndDelete(id);

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
  //usuarioAutenticado
  // const usuarioAuth = req.usuario;

  res.json({
    usuario,
  });
};
