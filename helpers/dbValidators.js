import { Usuario, Categoria, Producto, Role } from "../models/index.js";

export const esRolValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la BD`);
  }
};

export const emailExiste = async (correo = "") => {
  //Verificar si el correo existe
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El Email ${correo} ya esta registrado`);
  }
};

export const existeUsuarioPorId = async (id) => {
  //Verificar si el correo existe
  const exsiteUsuario = await Usuario.findById(id);
  if (!exsiteUsuario) {
    throw new Error(`El id: ${id} no existe`);
  }
};
export const existeCategoriaPorId = async (id) => {
  //Verificar si la categoria existe
  const exsiteCategoria = await Categoria.findById(id);
  if (!exsiteCategoria) {
    throw new Error(`El id: ${id} no existe`);
  }
};
export const existeProductoPorId = async (id) => {
  //Verificar si la producto existe
  const exsiteProducto = await Producto.findById(id);
  if (!exsiteProducto) {
    throw new Error(`El id: ${id} no existe`);
  }
};
