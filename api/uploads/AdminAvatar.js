import multer from 'multer';

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "../admin/public/image");
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname);
    },
});
const upload = multer({ storage });
export const uploadSingle = upload.single("file");
export const adminAvatar = (req, res) => {
    uploadSingle(req, res, function(err){
        if (err instanceof multer.MulterError){
            return res.status(500).json(err);
        } 
        else if (err){
            return res.status(500).json(err);
        }
        const file = req.file;
        return res.status(200).json(file.filename);
    });
};
