import { response, request } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// const cloudinary = require("cloudinary").v2;

import { v2 as cloudinary } from "cloudinary";

cloudinary.config(process.env.CLOUDYNARY_URL);

import { subirArchivo } from "../helpers/index.js";
import { Usuario, Producto } from "../models/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const cargarArchivo = async (req = request, res = response) => {
  try {
    //  Path del archivo
    const nombre = await subirArchivo(req.files, "caballos");
    res.json({ nombre });
  } catch (msg) {
    res.status(400).json({ msg });
  }
};

export const actualizarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvido validar esto" });
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    // Hay que borrar la imagen del servidor
    const pathImagen = `./uploads/${coleccion}/${modelo.img}`;
    if (fs.existsSync(pathImagen)) {
      fs.unlinkSync(pathImagen);
    }
  }

  const nombre = await subirArchivo(req.files, coleccion);
  modelo.img = nombre;

  await modelo.save();

  res.json(modelo);
};

export const actualizarImagenCloudynary = async (
  req = request,
  res = response
) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvido validar esto" });
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    const nombreArr = modelo.img.split("/");
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split(".");
    cloudinary.uploader.destroy(public_id);
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(
    tempFilePath,
    (err, result) => {
      if (err) {
        return res.status(500).json({ msg: err });
      }
    }
  );
  // const nombre = await subirArchivo(req.files, coleccion);
  // modelo.img = nombre;
  modelo.img = secure_url;

  await modelo.save();

  res.json(modelo);
};

export const mostrarImagen = async (req = request, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvido validar esto" });
  }

  // Limpiar imagenes previas
  if (modelo.img) {
    // Hay que borrar la imagen del servidor
    // const pathImagen = `./uploads/${coleccion}/${modelo.img}`;
    const pathImagen = path.resolve(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }

  res.sendFile(path.resolve(__dirname, "../assets/no-image.jpg"));
};
