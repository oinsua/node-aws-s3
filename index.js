import express from 'express';
import fileUpload from 'express-fileupload';
import { downLoadFile, getFiles, getFileUrl, getOneFile, upload } from './s3.js';


//initial app
const app = express();

//setting
app.set('PORT', process.env.PORT || 4000);

//middleware
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: './upload'
  }))
app.use(express.json());

//routers
app.get('/', (req, res) => {
    res.status(200).json({message: "Welcome to server AWS3"});
});

app.post('/files', async (req, res) => {
    console.log('req.files: ', req.files);
    const result = await upload(req.files.file);
    res.status(200).json(result);
});

app.get('/files', async (req, res) => {
    const result = await getFiles();
    res.status(200).json(result.Contents);
});

app.get('/files/:fileName', async (req, res) => {
    console.log('req.params.fileName: ', req.params.fileName);
    const result = await getOneFile(req.params.fileName);
    res.status(200).json(result.$metadata);
});

app.get('/download/:fileName', async (req, res) => {
    console.log('req.params.fileName: ', req.params.fileName);
    await downLoadFile(req.params.fileName);
    res.status(200).json({message: 'download file'});
});

app.get('/fileUrl/:fileName', async (req, res) => {
    console.log('req.params.fileName: ', req.params.fileName);
    const result = await getFileUrl(req.params.fileName);
    res.status(200).json({url: result});
});

//intial server
app.listen(app.get('PORT'), () => {
    console.log(`Server on port ${app.get('PORT')}`);
});