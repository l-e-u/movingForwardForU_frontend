import util from 'util';
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';

const storage = new GridFsStorage({
    url: process.env.MONGO_URI,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ['image/jpeg', 'image/png', 'appication/pdf'];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}--movingForward-${file.originalname}`;
            return filename;
        };

        return {
            bucketName: 'attachment',
            filename: `${Date.now()}--movingForward-${file.originalname}`
        };
    }
});

const uploadFiles = multer({ storage: storage }).single('file');
const uploadFilesMiddleware = util.promisify(uploadFiles);

export { uploadFilesMiddleware };