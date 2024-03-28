import express from 'express'
import multer from 'multer';
import cookieParser from 'cookie-parser';
import AuthRoutes from './routes/Auth.js';
import PostRoutes from './routes/Posts.js'
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, '../client/public/upload');
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + file.originalname)
    },
});

const upload = multer({ storage });
app.post('/api/upload', upload.single('file'), function (req, res){
    const file = req.file;
    res.status(200).json(file.filename)
});

app.use("/api/auth", AuthRoutes);
app.use("/api/posts", PostRoutes);

app.listen(8800, () => {
    console.log("Connected!");
})
