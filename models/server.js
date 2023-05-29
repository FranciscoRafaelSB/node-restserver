import express from "express";
import cors from "cors";

import { dbConnection } from "../database/config.js";
import {
  usersRouter,
  authRouter,
  categoriasRouter,
  productosRouter,
  buscarRouter,
} from "../routes/index.js";

export class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.paths = {
      auth: "/api/auth",
      buscar: "/api/buscar",
      categorias: "/api/categorias",
      usuarios: "/api/usuarios",
      productos: "/api/productos",
    };

    //Conectar a base de datos
    this.conectarDB();

    //Middlewares
    this.midelewares();

    //Rutas de mi app
    this.routes();
  }

  async conectarDB() {
    await dbConnection();
  }

  midelewares() {
    //CORS
    this.app.use(cors());

    //Lectura y parseo del body
    this.app.use(express.json());

    //Directorio público
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.paths.auth, authRouter);
    this.app.use(this.paths.buscar, buscarRouter);
    this.app.use(this.paths.categorias, categoriasRouter);
    this.app.use(this.paths.usuarios, usersRouter);
    this.app.use(this.paths.productos, productosRouter);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}!`);
    });
  }
}
