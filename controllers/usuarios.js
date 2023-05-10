import { request, response } from "express";

export const usuariosGet = (req, res = response) => {
  res.json({
    msg: "get API - Controlador",
  });
};
export const usuariosPost = (req, res = response) => {
  const body = req.body;
  res.json({
    msg: "post API - Controlador",
    body,
  });
};
export const usuariosPut = (req = request, res = response) => {
  const id = req.params.id;
  res.json({
    msg: "put API - Controlador",
    id,
  });
};
export const usuariosDelete = (req, res = response) => {
  res.json({
    msg: "delete API - Controlador",
  });
};
