import cloudinary from '../../config/cloudinary';
import fs from 'fs';
import path from 'path';

export type dadosArquivo = {
  url: string,
};

/**
 * Função que recebe o caminho de um arquivo contido na pasta temp, envia pra nuvem e exclui
 * o arquivo da pasta temp
 * @param nomeArquivo nome do arquivo contido na pasta temp.
 * @param pastaDestinoCloudinary ex: perfil, portfolio/imagens, portfolio/videos, etc
 * @returns url para acessar a imagem e o seu public_id
 */
const uparArquivoNaNuvem = async(nomeArquivo: string, pastaDestinoCloudinary: string) : 
Promise<dadosArquivo> => 
{ 
  try {
    const {secure_url} = await cloudinary.uploader.upload(
      path.resolve(__dirname, '..', '..', '..','..', 'temp', nomeArquivo), {
        folder: pastaDestinoCloudinary,
        resource_type: 'auto'
      }
    );

    excluirArquivoTemporario(nomeArquivo);
    return {url: secure_url};
  } catch (error) {
    excluirArquivoTemporario(nomeArquivo);
    throw new Error('Falha ao realizar upload de Arquivo');
  } 
};

/**
 * Função que recebe a url de um arquivo na nuvem e exclui ele
 * @param urlArquivo a url do arquivo a ser excluido 
 */
const excluirArquivoDaNuvem = async(urlArquivo: string) : Promise<boolean> =>{
  try {
    const public_id = urlArquivo.substring(62).split('.')[0];
    await cloudinary.uploader.destroy(public_id);
    return true;
  } catch (err) {
    return false;
  }
};

const excluirArquivoTemporario = (nomeArquivo:string) : boolean =>{
  try {
    fs.unlink(path.resolve(__dirname, '..', '..', '..', '..', 'temp', nomeArquivo), (err) => {
      if(err)
        throw new Error();
    });

    return true;
  } catch (error) {
    return false;
  }
};

export {uparArquivoNaNuvem, excluirArquivoDaNuvem, excluirArquivoTemporario};