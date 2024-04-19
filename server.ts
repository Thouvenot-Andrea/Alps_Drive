



import express, {Request, Response} from 'express';
import fs, { Dirent } from "fs";
import os from "os";
import {join} from 'path';
import path from "node:path";

let tmpdir = os.tmpdir();
let app = express();

app.use(function autoriser(req: Request, res: Response, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
})

app.get("/", function afficher(req: Request, res: Response) {
    res.send("hello , bonjour")
});

app.get ('/api/drive/:path(*)', async function affichage(req: Request, res: Response) {
    const path = req.params.path;
    const filePath = join(tmpdir, path);
    try{

        const info = await fs.promises.stat(filePath)
        if(info.isDirectory()) {
            const files: string[] = await fs.promises.readdir(filePath);
            const dataFiles = await Promise.all(files.map(async fileName => {
                const fileInfo = await fs.promises.stat(join(filePath, fileName));
                return {
                    name: fileName,
                    isFolder: fileInfo.isDirectory(),
                    size: fileInfo.size
                };
            }));
            res.status(200).json(dataFiles);
        }else{
            const fileData = await fs.promises.readFile(filePath);
            res.set('Content-Type', 'application/octet-stream');
            res.send(fileData);
        }
    }catch (error){
        res.status(500).send(error);
    }
})
app.post("/api/drive/:path(*)", async function affichage(req: Request, res: Response) {
    const { name } = req.query as { name: string };
    const { path:folderPath } = req.params;

    if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
        return res.status(400).send("Seuls les lettres et les chiffres sont autorisés.");
    }
    try {
    const fullPath = join(tmpdir, folderPath || '', name);

        await fs.promises.mkdir(fullPath);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).send(error);
    }
});
app.delete("/api/drive/:path(*)", async function affichage(req: Request, res: Response) {
    const path =req.params.path;
    const filePath = join(tmpdir, path);
    try{
        const info = await fs.promises.stat(filePath);
        if(info.isDirectory()) {
            await fs.promises.rmdir(filePath);

        }else{
            await fs.promises.unlink(filePath)
        }
        res.sendStatus(200)
    }catch(error){
        res.status(500).send(error);
    }
})

app.listen(3000, function () {
    console.log("Server started on port 3000");
});



