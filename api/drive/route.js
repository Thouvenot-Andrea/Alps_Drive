const express = require('express');
const {promises: fs} = require("fs");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({message: "Got it!"})
})

// PREMIERE VERSION QUI FONCTIONNE PAS
// app.get('/api/drive', async (req, res) => {
//         const file = await fs.promises.readdir('/', {withFilesType: true})
//         const datafile = file.map(file => {
//             return obj = {
//                 name: file.name,
//                 isFolder: file.isDirectory()
//             }
//         })
//
//         res.send(datafile)
//     })

                    // Gestionnaire de route pour /api/drive/
router.get('/api/drive', async (req, res) => {
// Définit une route GET sur '/api/drive'. Lorsqu'une requête GET est reçue à cette URL, la fonction de rappel fournie sera exécutée.

    const files = await fs.readdir('/');
    // Lecture du contenu du répertoire racine et stockage dans la variable 'files'.

    const dataFiles = await Promise.all(files.map(async (fileName) => {
        // Utilisation de 'map' pour itérer sur chaque élément de 'files' et création d'une nouvelle liste 'dataFiles'.

        fileInfo = await fs.stat('/' + fileName);
        // Obtention des informations sur le fichier ou le répertoire actuel et stockage dans 'fileInfo'.

        return {
            // Création d'un objet avec deux propriétés : 'name' qui contient le nom du fichier ou du répertoire, et 'isFolder' qui indique si le fichier est un répertoire ou non.
            name: fileName,
            isFolder: fileInfo.isDirectory()
        };
    }));
    res.json(dataFiles);
    // Envoi de la liste 'dataFiles' sous forme de réponse JSON à la requête HTTP.

});


module.exports = router;