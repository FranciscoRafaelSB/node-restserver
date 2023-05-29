import { response, request } from "express";

import { Categoria } from "../models/categoria.js";

//obtenerCategorias - paginado - total - populate
export const categoriasGet = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [categorias, total] = await Promise.all([
    Categoria.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario"),
    Categoria.countDocuments(query),
  ]);

  const categoriasFilled = categorias.map((categoria) => {
    return {
      nombre: categoria.nombre,
      estado: categoria.estado,
      id: categoria._id,
      usuario: {
        nombre: categoria.usuario.nombre,
        correo: categoria.usuario.correo,
        estado: categoria.usuario.estado,
      },
    };
  });

  res.json({
    categorias: categoriasFilled,
    total,
    // usuario,
  });
};

//Obtener categoria - populate {}
export const categoriaGetByID = async (req = request, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findById(id).populate("usuario");

  res.json({
    categoria,
  });
};

//Crear categoria
export const crearCategoria = async (req = request, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB.nombre} ya existe`,
    });
  }

  //Generar la data a guardar
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Categoria(data);

  //Guardar DB
  await categoria.save();

  res.status(201).json(categoria);
};

//Actualizar categoria
export const categoriasPut = async (req = request, res = response) => {
  const { id } = req.params;

  const { estado, ...resto } = req.body;

  resto.nombre = resto.nombre.toUpperCase();
  // resto.usuario = resto.usuario._id;

  // const category = Categoria.findById(id);
  const newCategory = await Categoria.findByIdAndUpdate(id, resto, {
    new: true,
  }).populate("usuario", "nombre");

  res.json({
    // id,
    // category,
    categoria: newCategory,
  });
};

//Borrar categoria - estado:false

export const catergoriaBorrar = async (req = request, res = response) => {
  const { id } = req.params;
  const categoria = await Categoria.findByIdAndUpdate(
    id,
    {
      estado: false,
    },
    { new: true }
  ).populate("usuario", "nombre");

  res.json({
    categoria,
  });
};
