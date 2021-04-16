//a rota que utilizar esse middleware receberá o corpo no formato multipart/formData, e n em json.
import multer from 'multer';
import multerConfig from '../../config/uploadLocal';

const upload = multer(multerConfig);

export default upload;