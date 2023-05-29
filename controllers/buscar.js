import { request, response } from "express";
// import { ObjectId } from "mongoose";

import { Usuario, Categoria, Producto } from "../models/index.js";
import { isValidObjectId } from "mongoose";

const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];

const buscarUsuarios = async (termino = "", res = response) => {
  const esMongoId = isValidObjectId(termino);

  //Buscar usuario por id
  if (esMongoId) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  //Expresión regular para hacer busquedas insensibles
  const regex = new RegExp(termino, "i");

  //Buscar usuarios por nombre o correo
  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });

  res.json({
    results: usuarios,
  });
};

const buscarCategorias = async (termino = "", res = response) => {
  const esMongoId = isValidObjectId(termino);

  //Buscar categoria por id
  if (esMongoId) {
    const categoria = await Categoria.findById(termino);
    return res.json({
      results: categoria ? [categoria] : [],
    });
  }

  //Expresión regular para hacer busquedas insensibles
  const regex = new RegExp(termino, "i");

  //Buscar categorias por nombre
  const categorias = await Categoria.find({ nombre: regex, estado: true });

  res.json({
    results: categorias,
  });
};

const buscarProductos = async (termino = "", res = response) => {
  const esMongoId = isValidObjectId(termino);

  //Buscar producto por id
  if (esMongoId) {
    const producto = await Producto.findById(termino).populate(
      "categoria",
      "nombre"
    );
    return res.json({
      results: producto ? [producto] : [],
    });
  }

  //Expresión regular para hacer busquedas insensibles
  const regex = new RegExp(termino, "i");

  //Buscar productos por nombre
  const productos = await Producto.find({
    $or: [{ nombre: regex }, { preceio: regex }],
    $and: [{ estado: true }],
  }).populate("categoria", "nombre");

  res.json({
    results: productos,
  });
};

const buscarRoles = async (termino = "", res = response) => {
  const esMongoId = isValidObjectId(termino);

  //Buscar rol por id
  if (esMongoId) {
    const rol = await Role.findById(termino);
    return res.json({
      results: rol ? [rol] : [],
    });
  }

  //Expresión regular para hacer busquedas insensibles
  const regex = new RegExp(termino, "i");

  //Buscar roles por nombre
  const roles = await Role.find({ rol: regex });

  res.json({
    results: roles,
  });
};

export const buscar = async (req = request, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);
      break;

    case "categorias":
      buscarCategorias(termino, res);
      break;

    case "productos":
      buscarProductos(termino, res);
      break;

    case "roles":
      buscarRoles(termino, res);
      break;

    default:
      res.status(500).json({
        msg: "Se le olvido hacer esta búsqueda",
      });
  }
};
