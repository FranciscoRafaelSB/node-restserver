import { response, request } from "express";

import { Producto, Categoria } from "../models/index.js";

//obtenerProductos - paginado - total - populate
export const obtenerProductos = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [productos, total] = await Promise.all([
    Producto.find(query)
      .skip(Number(desde))
      .limit(Number(limite))
      .populate("usuario", "nombre")
      .populate("categoria", "nombre"),
    Producto.countDocuments(query),
  ]);

  res.json({
    productos,
    total,
  });
};

//Obtener producto - populate {}
export const obtenerProducto = async (req = request, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.json({
    producto,
  });
};

//Crear producto
export const crearProducto = async (req = request, res = response) => {
  const { estado, usuario, ...body } = req.body;

  const productoDB = await Producto.findOne({ nombre: body.nombre });
  const categoriaDB = await Categoria.findById(body.categoria);

  //Verificar si el producto existe
  if (productoDB) {
    return res.status(400).json({
      msg: `La producto ${productoDB.nombre} ya existe`,
    });
  }

  //Verificar si la categoria existe
  if (!categoriaDB) {
    return res.status(400).json({
      msg: `La categoria ${categoriaDB} no existe`,
    });
  }

  //Generar la data a guardar
  const data = {
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
    ...body,
  };

  const producto = new Producto(data);

  //Guardar DB
  await producto.save();

  res.status(201).json(producto);
};

//Actualizar producto
export const actualizarProducto = async (req = request, res = response) => {
  const { id } = req.params;

  const { estado, ...resto } = req.body;

  resto.nombre = resto.nombre.toUpperCase();

  const producto = await Producto.findByIdAndUpdate(id, resto, {
    new: true,
  }).populate("usuario", "nombre");

  res.json({
    producto,
  });
};

//Borrar producto - estado:false
export const borrarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findByIdAndUpdate(
    id,
    {
      estado: false,
    },
    { new: true }
  ).populate("usuario", "nombre");

  res.json({
    producto,
  });
};
