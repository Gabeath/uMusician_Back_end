import crypto from 'crypto';
import multer from 'multer';
import path from 'path';

//Configura para todos os arquivos que recebermos em cada requisição serem salvos na pasta "temp"
//Desta forma, podemos enviar o arquivo pra nuvem, e depois excluí-lo
const config = {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', '..', '..', 'temp'),
    filename: (req, file, callback) => {
      const fileName = `${crypto.randomBytes(8).toString('hex')}-${file.originalname}`;
      callback(null, fileName);
    }
  }),
};

export default config;