import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

import { dbConnection } from "../database/config.js";
import {
  usersRouter,
  authRouter,
  categoriasRouter,
  productosRouter,
  buscarRouter,
  uploadRouter,
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
      uploads: "/api/uploads",
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

    //FileUpload - Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, authRouter);
    this.app.use(this.paths.buscar, buscarRouter);
    this.app.use(this.paths.categorias, categoriasRouter);
    this.app.use(this.paths.usuarios, usersRouter);
    this.app.use(this.paths.productos, productosRouter);
    this.app.use(this.paths.uploads, uploadRouter);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}!`);
    });
  }
}
