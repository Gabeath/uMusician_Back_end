import fs from 'fs';
import sharp from 'sharp';

export const compressImage = async(file: Express.Multer.File): Promise<string> => {

  const newPath = file.path.split('.')[0] + '.jpg';
  const newFileName = file.filename.split('.')[0] + '.jpg';

  const data = await sharp(file.path)
    .resize(640)
    .jpeg({ quality: 80 })
    .toBuffer();

  //Exclui o arquivo original
  fs.access(file.path, (err) => {
    if (!err) {
      fs.unlink(file.path, err => {
        if (err) console.log(err);
      });
    }
  });

  //Salva o arquivo redimensionado/comprimido
  fs.writeFile(newPath, data, err => {
    if (err) {
      throw err;
    }
  });
  
  return newFileName;
};