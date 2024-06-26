const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
// fs = file system
const os = require("os");
const path = require('path');
const {join} = require("path");


router.get("/", (req, res) => {
    res.json({message: "Got it!"})
})

// ---------------Retourne une liste contenant les dossiers et fichiers à la racine du “drive”---------------------------
const tmpdir = join(os.tmpdir(), "/");
/*join() du module path pour concaténer plusieurs parties de chemin ensemble de manière sûre et portable/
os.tmpdir() revoie le répertoire par défaut pour les fichiers temporaires en linux '/tpm'
 / le / ne change rien là, mais si je mes route.bis/drive le répertoire par défaut sera route.bis/drive. */
router.get('/api/drive', async (req, res) => {

    try {
        const files = await fs.readdir(tmpdir);
        const dataFiles = await Promise.all(files.map(async fileName => {
        // promise.all pour attendre que toutes les promesses retournées par files.map soit résolues
        // files.map crée un tableau de promesses où chaque promesse correspond à l'exécution de la fonction 'async' pour chaque fichier "files"
        // async fileName fonction de rappel asynchrone traite chaque fichier, elle attende que fs.stat soient résolu pour obtenir les informations
            const fileInfo = await fs.stat(join(tmpdir, fileName));
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
    const filePath =join(tmpdir, name)
    try {
        const fileInfo = await fs.stat(filePath);
        if (fileInfo.isDirectory()) {
            const files = await fs.readdir(filePath);
            const dataFiles = await Promise.all(files.map(async fileName => {
                //la function asynchrone est définie comme une fonction fléchée prenant fileName comme argument
                const info = await fs.stat(join(filePath));
                return {
                    name: fileName,
                    isFolder: info.isDirectory(),
                    size: info.size
                };
            }));
            res.status(200).json(dataFiles);
        } else {
            const fileData = await fs.readFile(filePath);
            res.set('Content-Type', 'application/octet-stream');
            res.send(fileData);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération du contenu du fichier :', error);
        res.status(500).send('Erreur lors de la récupération du contenu du fichier.');
    }
});


//-------------------------------------------------Créer un dossier avec le nom {name}---------------------------------------------------------------------
router.post("/api/drive", async (req, res) => {
    const {name} = req.query;
    //si on veut sortir une propriété spécifier que d'un object en JS, on spécifie le nom de la propriété entre accolades({}) pour utiliser la syntaxe de déstructuration.
    if (!/^[a-zA-Z0-9-_]+$/.test(name)) {
        return res.status(400).send("Le nom du dossier ne doit contenir que des caractères alphanumériques, - ou _");
    }
    const folderPath = join(tmpdir, name);
    try {
        await fs.mkdir(folderPath);
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(`Impossible de créer le dossier: ${error}`);
    }
});
router.post("/api/drive/:folder", async (req, res) => {
    const {folder} = req.params;
    const {name} = req.query;

    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
        // les /.../ syntaxe utilisée pour définir une expression régulière en JS
        // ^ indique le début de la chaîne de caractère
        //+ signifie une où plusieurs occurrences
        // .test(name) vérifie  si c'est true ou false
        return res.status(400).send("Le nom du dossier n'est pas correct, il doit contenir uniquement des caractères alphanumériques.");
    }
    const folderPath = join(tmpdir, folder, name);
    try {
        await fs.mkdir(folderPath, {recursive: true});
        res.sendStatus(201);
    } catch (error) {
        res.status(500).send(`Impossible de créer le dossier: ${error}`);
    }
});

//-------------------------------------Suppression d’un dossier ou d’un fichier avec le nom-----------------------------
router.delete("/api/drive/:name", async (req, res) => {
    const name = req.params.name;
    const filePath = join(os.tmpdir(), name);
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
    const folderPath = join(tmpdir, folder, name);
    try {
        const fileInfos = await fs.stat(folderPath);
        if (fileInfos.isDirectory()) {
            await fs.rmdir(folderPath, {recursive: true});
        } else {
            await fs.unlink(folderPath);
        }
        res.sendStatus(200);
    } catch (error) {
        res.status(400).send('erreur')
    }
})
//----------------------------------------Créer un fichier à la racine du “drive”---------------------------------------
router.put('/api/drive', async (req, res) => {
    try {
        await fs.copyFile(req.files.file.file, join(tmpdir, req.files.file.filename))
        await fs.rm(join(tmpdir, req.files.file.uuid), {recursive: true})
        console.log(req.files)
        return res.sendStatus(200)

    } catch (e) {
        return res.sendStatus(400)
    }
})

router.put('/api/drive/:folder', async (req, res) => {
    const folder = req.params.folder;
    const uploadDir = path.join(tmpdir, folder);
//Si {folder} n’existe pas
    try {
        await fs.access(uploadDir, fs.constants.F_OK);
    } catch (error) {
        return res.sendStatus(404);
    }
//Si aucun fichier n’est présent dans la requête
    if (!req.files || !req.files.file) {
        return res.sendStatus(400);
    }

    try {
        await fs.copyFile(req.files.file.file, path.join(uploadDir, req.files.file.filename));
        await fs.rm(join(tmpdir, req.files.file.uuid), { recursive: true });
        return res.sendStatus(201);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});


//--------------------------------------------------version simplifier--------------------------------------------------
// const tmpdir = join(os.tmpdir(),"/");
// router.get("/route.bis/drive/:name?", async (req, res) => {// ajout de ?
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
// router.post("/route.bis/drive/:folder?", async (req, res) => {
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
// router.delete("/route.bis/drive/:folder?/:name", async (req, res) => {
//     const {folder, name} = req.params;
//     const folderPath = folder ? path.join(tmpdir, folder,name) : path.join(tmpdir,name);
//     try {
//         const fileInfos = await fs.stat(folderPath);
//         if (fileInfos.isDirectory()) {
//             await fs.rmdir(folderPath, {recursive: true});
//         }
//         else{
//             await fs.unlink(folderPath);
//         }
//         res.sendStatus(200);
//     } catch (error) {
//         res.status(400).send('erreur')
//     }
// })
// router.put('/route.bis/drive/:folder?', async (req, res) => {
//     const folder = req.params.folder;
//     const uploadDir = folder ? path.join(tmpdir, folder) : tmpdir;
//
//     // Si un dossier est spécifié, vérifiez s'il existe
//     if (folder) {
//         try {
//             const stat = await fs.stat(uploadDir);
//             if (!stat.isDirectory()) {
//                 // Si le chemin spécifié n'est pas un dossier, retournez une erreur 400
//                 return res.sendStatus(400);
//             }
//         } catch (error) {
//             // Si une erreur se produit lors de l'accès au dossier, retournez une erreur 404
//             return res.sendStatus(404);
//         }
//     }
//
//     try {
//         // Vérifiez si un fichier est présent dans la requête
//         if (!req.files || !req.files.file) {
//             return res.sendStatus(400);
//         }
//         // Copiez le fichier dans le dossier spécifié ou à la racine
//         const destination = folder ? uploadDir : tmpdir;
//         await fs.copyFile(req.files.file.file, path.join(destination, req.files.file.filename));
//         // Supprimez le fichier temporaire
//         await fs.rm(join(tmpdir, req.files.file.uuid), {recursive: true})
//
//         return res.sendStatus(201);
//     } catch (error) {
//         console.error(error);
//         return res.sendStatus(500);
//     }
// });
module.exports = router;
