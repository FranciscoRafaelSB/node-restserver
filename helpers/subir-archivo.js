import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const subirArchivo = (
  files,
  carpeta = "",
  extensionesValidas = ["png", "jpg", "jpeg", "gif"]
) => {
  return new Promise((resolve, reject) => {
    // Procesar la imagen
    const archivo = files.archivo;
    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];

    // Generar el nombre del archivo
    const nombreTemp = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemp);

    // Mover la imagen
    archivo.mv(uploadPath, (err) => {
      if (err) {
        return reject("Error al mover la imagen");
      }
      resolve(nombreTemp);
    });
  });
};
