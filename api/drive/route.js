const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const os = require("os");
const path = require('path');
const {join} = require("path");


router.get("/", (req, res) => {
    res.json({message: "Got it!"})
})

// ---------------Retourne une liste contenant les dossiers et fichiers à la racine du “drive”---------------------------
const tmpdir = join(os.tmpdir(),"/");
router.get('/api/drive', async (req, res) => {

    try {
        const files = await fs.readdir(tmpdir);
        const dataFiles = await Promise.all(files.map(async fileName => {
            const fileInfo = await fs.stat(path.join(tmpdir, fileName));
            return {
                name: fileName,
                isFolder: fileInfo.isDirectory(),
                size: fileInfo.size
            };
        }));
        res.json(dataFiles);
    } catch (error) {
        res.status(500).send(`Erreur lors de la récupération du contenu du drive: ${error}`);
    }
})

// //---------------------------------------Retourne le contenu de {name}--------------------------------------------------
router.get("/api/drive/:name", async (req, res) => {// ajout de ?
    const name = req.params.name;
    const filePath = path.join(tmpdir, name)
    try{
        const fileInfo = await fs.stat(filePath);
        if (fileInfo.isDirectory()) {
            const files = await fs.readdir(filePath);
            const dataFiles = await Promise.all(files.map(async fileName => {
                const fileInfo = await fs.stat(path.join(filePath, fileName));
                return {
                    name: fileName,
                    isFolder: fileInfo.isDirectory(),
                    size: fileInfo.size
                };
            }));
            res.status(200).json(dataFiles);
        } else {
            const fileStream = fs.createReadStream(filePath);
            res.set('Content-Type', 'application/octet-stream');
            fileStream.pipe(res);
        }
    } catch (error) {
        console.error(error);
        res.status(404).send("Error");
    }
});





//-------------------------------------------------Créer un dossier avec le nom {name}---------------------------------------------------------------------
router.post("/api/drive", async (req, res) => {
    const {name} = req.query;
    if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
        return res.status(400).send("Le nom du dossier ne doit contenir que des caractères alphanumériques, - ou _");
    }
    const folderPath = path.join(os.tmpdir(), name);
    try {
        await fs.mkdir(folderPath);
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(`Impossible de créer le dossier: ${error}`);
    }
});
router.post("/api/drive/:folder", async (req, res) => {
    const { folder } = req.params;
    const { name } = req.query;
    const folderPath = path.join(tmpdir, folder, name);
    if (!name || !/^[a-zA-Z0-9_-]+$/.test(name)) {
        return res.status(400).send("Le nom du dossier n'est pas correct, il doit contenir uniquement des caractères alphanumériques.");
    }
    try {
        await fs.mkdir(folderPath, { recursive: true });
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(`Impossible de créer le dossier: ${error}`);
    }
});

//-------------------------------------Suppression d’un dossier ou d’un fichier avec le nom-----------------------------
router.delete("/api/drive/:name", async (req, res) => {
    const name = req.params.name;
    const filePath = path.join(os.tmpdir(), name);
    try {
        const fileInfos = await fs.stat(filePath);
        if (fileInfos.isDirectory()) {
            await fs.rmdir(filePath, {recursive: true});
        } else {
            await fs.unlink(filePath);
        }
        res.sendStatus(200);
    } catch (error) {
        res.status(400).send(`Impossible de supprimer le fichier ou le dossier ${name}: ${error}`);
    }
});


router.delete("/api/drive/:folder/:name", async (req, res) => {
    const {folder, name} = req.params;
    const folderPath = path.join(tmpdir, folder,name);
    try {
        const fileInfos = await fs.stat(folderPath);
        if (fileInfos.isDirectory()) {
            await fs.rmdir(folderPath, {recursive: true});
        }
        else{
            await fs.unlink(folderPath);
        }
        res.sendStatus(200);
    } catch (error) {
        res.status(400).send('erreur')
    }
})
//----------------------------------------Créer un fichier à la racine du “drive”---------------------------------------


//--------------------------------------------------version simplifier--------------------------------------------------
// router.get("/api/drive/:name?", async (req, res) => {// ajout de ?
//     const name = req.params.name;
//     const filePath =  name ? path.join(tmpdir, name): tmpdir // juste ajouter name ? et : tmpdir
//     try {
//         const fileInfo = await fs.stat(filePath);
//         if (fileInfo.isDirectory()) {
//             const files = await fs.readdir(filePath);
//             const dataFiles = await Promise.all(files.map(async fileName => {
//                 const fileInfo = await fs.stat(path.join(filePath, fileName));
//                 return {
//                     name: fileName,
//                     isFolder: fileInfo.isDirectory(),
//                     size: fileInfo.size
//                 };
//             }));
//             res.status(200).json(dataFiles);
//         } else {
//             const fileStream = fs.createReadStream(filePath);
//             res.set('Content-Type', 'application/octet-stream');
//             fileStream.pipe(res);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(404).send("Error");
//     }
// });
// router.post("/api/drive/:folder?", async (req, res) => {
//     const { folder } = req.params;
//     const { name } = req.query;
//     const folderPath = folder ? path.join(tmpdir, folder, name) : path.join(tmpdir, name);
//     // utilisé pour créer le chemin complet du dossier à l'intérieur du dossier spécifié : utilisé pour créer le chemin complet du dossier à la racine du "drive
//     if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
//         return res.status(400).send("Le nom du dossier ne doit contenir que des caractères alphanumériques, - ou _");
//     }
//     try {
//         await fs.mkdir(folderPath, { recursive: true });
//         res.sendStatus(201);
//     } catch (error) {
//         res.status(500).send(`Impossible de créer le dossier: ${error}`);
//     }
// });
// Exporte le routeur
module.exports = router;